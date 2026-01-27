"""
Classification metrics computation.

Provides comprehensive classification metrics including:
- Accuracy, Precision, Recall, F1
- ROC-AUC, PR-AUC
- Confusion matrix
- Calibration metrics
"""

import numpy as np
from typing import Dict, Optional, Tuple
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    average_precision_score,
    confusion_matrix as sklearn_confusion_matrix,
    log_loss,
    matthews_corrcoef,
    cohen_kappa_score
)


def compute_all_metrics(
    y_true: np.ndarray,
    y_pred: np.ndarray,
    y_proba: Optional[np.ndarray] = None,
    average: str = 'weighted'
) -> Dict[str, float]:
    """
    Compute all classification metrics.

    Args:
        y_true: True labels
        y_pred: Predicted labels
        y_proba: Predicted probabilities (optional, for probabilistic metrics)
        average: Averaging strategy for multiclass ('micro', 'macro', 'weighted')

    Returns:
        Dictionary of all computed metrics
    """
    metrics = {}

    # Basic metrics
    metrics['accuracy'] = accuracy_score(y_true, y_pred)
    metrics['precision'] = precision_score(y_true, y_pred, average=average, zero_division=0)
    metrics['recall'] = recall_score(y_true, y_pred, average=average, zero_division=0)
    metrics['f1_score'] = f1_score(y_true, y_pred, average=average, zero_division=0)

    # Additional metrics
    metrics['matthews_corr_coef'] = matthews_corrcoef(y_true, y_pred)
    metrics['cohen_kappa'] = cohen_kappa_score(y_true, y_pred)

    # Probabilistic metrics (if probabilities provided)
    if y_proba is not None:
        try:
            # Check if binary or multiclass
            n_classes = len(np.unique(y_true))

            if n_classes == 2:
                # Binary classification
                metrics['roc_auc'] = roc_auc_score(y_true, y_proba[:, 1] if y_proba.ndim > 1 else y_proba)
                metrics['pr_auc'] = average_precision_score(y_true, y_proba[:, 1] if y_proba.ndim > 1 else y_proba)
            else:
                # Multiclass classification
                metrics['roc_auc'] = roc_auc_score(y_true, y_proba, multi_class='ovr', average=average)
                metrics['pr_auc'] = average_precision_score(y_true, y_proba, average=average)

            # Log loss
            metrics['log_loss'] = log_loss(y_true, y_proba)

            # Calibration error
            metrics['expected_calibration_error'] = compute_expected_calibration_error(y_true, y_proba)

        except Exception as e:
            # Skip probabilistic metrics if computation fails
            print(f"Warning: Could not compute probabilistic metrics: {e}")

    return metrics


def compute_confusion_matrix(y_true: np.ndarray, y_pred: np.ndarray) -> np.ndarray:
    """
    Compute confusion matrix.

    Args:
        y_true: True labels
        y_pred: Predicted labels

    Returns:
        Confusion matrix as numpy array
    """
    return sklearn_confusion_matrix(y_true, y_pred)


def compute_expected_calibration_error(
    y_true: np.ndarray,
    y_proba: np.ndarray,
    n_bins: int = 10
) -> float:
    """
    Compute Expected Calibration Error (ECE).

    ECE measures the difference between predicted probabilities and actual frequencies.

    Args:
        y_true: True labels
        y_proba: Predicted probabilities
        n_bins: Number of bins for calibration

    Returns:
        Expected calibration error (0 = perfectly calibrated, 1 = worst)
    """
    # For binary classification, extract positive class probabilities
    if y_proba.ndim > 1 and y_proba.shape[1] == 2:
        y_proba = y_proba[:, 1]

    # Get predicted class probabilities
    if y_proba.ndim == 1:
        confidences = y_proba
        predictions = (y_proba > 0.5).astype(int)
    else:
        confidences = np.max(y_proba, axis=1)
        predictions = np.argmax(y_proba, axis=1)

    # Create bins
    bins = np.linspace(0, 1, n_bins + 1)
    bin_indices = np.digitize(confidences, bins) - 1
    bin_indices = np.clip(bin_indices, 0, n_bins - 1)

    # Compute ECE
    ece = 0.0
    for i in range(n_bins):
        mask = bin_indices == i
        if np.sum(mask) > 0:
            bin_accuracy = np.mean(predictions[mask] == y_true[mask])
            bin_confidence = np.mean(confidences[mask])
            bin_weight = np.sum(mask) / len(y_true)
            ece += bin_weight * np.abs(bin_accuracy - bin_confidence)

    return ece


def compute_calibration_curve(
    y_true: np.ndarray,
    y_proba: np.ndarray,
    n_bins: int = 10
) -> Tuple[np.ndarray, np.ndarray]:
    """
    Compute calibration curve data.

    Args:
        y_true: True labels
        y_proba: Predicted probabilities
        n_bins: Number of bins

    Returns:
        Tuple of (mean_predicted_probabilities, fraction_of_positives)
    """
    # For binary classification, extract positive class probabilities
    if y_proba.ndim > 1 and y_proba.shape[1] == 2:
        y_proba = y_proba[:, 1]

    # Create bins
    bins = np.linspace(0, 1, n_bins + 1)
    bin_indices = np.digitize(y_proba, bins) - 1
    bin_indices = np.clip(bin_indices, 0, n_bins - 1)

    # Compute calibration curve
    mean_predicted_probs = []
    fraction_of_positives = []

    for i in range(n_bins):
        mask = bin_indices == i
        if np.sum(mask) > 0:
            mean_predicted_probs.append(np.mean(y_proba[mask]))
            fraction_of_positives.append(np.mean(y_true[mask]))
        else:
            mean_predicted_probs.append(np.nan)
            fraction_of_positives.append(np.nan)

    return np.array(mean_predicted_probs), np.array(fraction_of_positives)


def compute_per_class_metrics(
    y_true: np.ndarray,
    y_pred: np.ndarray,
    class_names: Optional[list] = None
) -> Dict[str, Dict[str, float]]:
    """
    Compute metrics for each class individually.

    Args:
        y_true: True labels
        y_pred: Predicted labels
        class_names: Optional list of class names

    Returns:
        Dictionary mapping class names to their metrics
    """
    classes = np.unique(y_true)
    if class_names is None:
        class_names = [f"class_{i}" for i in classes]

    per_class = {}

    for i, class_label in enumerate(classes):
        # Create binary problem for this class
        y_true_binary = (y_true == class_label).astype(int)
        y_pred_binary = (y_pred == class_label).astype(int)

        class_name = class_names[i] if i < len(class_names) else f"class_{class_label}"

        per_class[class_name] = {
            'precision': precision_score(y_true_binary, y_pred_binary, zero_division=0),
            'recall': recall_score(y_true_binary, y_pred_binary, zero_division=0),
            'f1_score': f1_score(y_true_binary, y_pred_binary, zero_division=0),
            'support': int(np.sum(y_true_binary))
        }

    return per_class
