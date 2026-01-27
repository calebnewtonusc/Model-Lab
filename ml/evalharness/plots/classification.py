"""
Classification visualization functions.

All plots are deterministic (same seed → same plot).
"""

import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path
from typing import Optional, List
from sklearn.metrics import roc_curve, precision_recall_curve, auc


# Set style for consistent, professional plots
sns.set_style("whitegrid")
plt.rcParams['figure.figsize'] = (10, 8)
plt.rcParams['font.size'] = 11
plt.rcParams['axes.labelsize'] = 12
plt.rcParams['axes.titlesize'] = 14
plt.rcParams['xtick.labelsize'] = 10
plt.rcParams['ytick.labelsize'] = 10
plt.rcParams['legend.fontsize'] = 10


def plot_confusion_matrix(
    confusion_matrix: np.ndarray,
    class_names: Optional[List[str]] = None,
    output_path: Optional[str] = None,
    seed: int = 42
) -> str:
    """
    Plot confusion matrix heatmap.

    Args:
        confusion_matrix: Confusion matrix array
        class_names: Optional list of class names
        output_path: Path to save plot (if None, shows plot)
        seed: Random seed for reproducibility

    Returns:
        Path to saved plot
    """
    np.random.seed(seed)

    fig, ax = plt.subplots(figsize=(10, 8))

    # Normalize confusion matrix for percentages
    cm_normalized = confusion_matrix.astype('float') / confusion_matrix.sum(axis=1)[:, np.newaxis]

    # Create heatmap
    sns.heatmap(
        cm_normalized,
        annot=confusion_matrix,
        fmt='d',
        cmap='Blues',
        xticklabels=class_names if class_names else range(len(confusion_matrix)),
        yticklabels=class_names if class_names else range(len(confusion_matrix)),
        cbar_kws={'label': 'Proportion'},
        ax=ax
    )

    ax.set_xlabel('Predicted Label')
    ax.set_ylabel('True Label')
    ax.set_title('Confusion Matrix')

    plt.tight_layout()

    if output_path:
        plt.savefig(output_path, dpi=300, bbox_inches='tight')
        plt.close()
        return output_path
    else:
        plt.show()
        return ""


def plot_roc_curve(
    y_true: np.ndarray,
    y_proba: np.ndarray,
    output_path: Optional[str] = None,
    seed: int = 42
) -> str:
    """
    Plot ROC curve.

    Args:
        y_true: True labels
        y_proba: Predicted probabilities
        output_path: Path to save plot
        seed: Random seed for reproducibility

    Returns:
        Path to saved plot
    """
    np.random.seed(seed)

    fig, ax = plt.subplots(figsize=(10, 8))

    # For binary classification
    if y_proba.ndim == 1 or (y_proba.ndim == 2 and y_proba.shape[1] == 2):
        if y_proba.ndim == 2:
            y_proba = y_proba[:, 1]

        fpr, tpr, _ = roc_curve(y_true, y_proba)
        roc_auc = auc(fpr, tpr)

        ax.plot(fpr, tpr, label=f'ROC curve (AUC = {roc_auc:.3f})', linewidth=2)

    else:
        # Multiclass - plot ROC curve for each class
        from sklearn.preprocessing import label_binarize
        classes = np.unique(y_true)
        y_true_bin = label_binarize(y_true, classes=classes)

        for i in range(len(classes)):
            fpr, tpr, _ = roc_curve(y_true_bin[:, i], y_proba[:, i])
            roc_auc = auc(fpr, tpr)
            ax.plot(fpr, tpr, label=f'Class {classes[i]} (AUC = {roc_auc:.3f})', linewidth=2)

    # Plot diagonal
    ax.plot([0, 1], [0, 1], 'k--', label='Random (AUC = 0.500)', linewidth=1)

    ax.set_xlabel('False Positive Rate')
    ax.set_ylabel('True Positive Rate')
    ax.set_title('ROC Curve')
    ax.legend(loc='lower right')
    ax.grid(True, alpha=0.3)

    plt.tight_layout()

    if output_path:
        plt.savefig(output_path, dpi=300, bbox_inches='tight')
        plt.close()
        return output_path
    else:
        plt.show()
        return ""


def plot_pr_curve(
    y_true: np.ndarray,
    y_proba: np.ndarray,
    output_path: Optional[str] = None,
    seed: int = 42
) -> str:
    """
    Plot Precision-Recall curve.

    Args:
        y_true: True labels
        y_proba: Predicted probabilities
        output_path: Path to save plot
        seed: Random seed for reproducibility

    Returns:
        Path to saved plot
    """
    np.random.seed(seed)

    fig, ax = plt.subplots(figsize=(10, 8))

    # For binary classification
    if y_proba.ndim == 1 or (y_proba.ndim == 2 and y_proba.shape[1] == 2):
        if y_proba.ndim == 2:
            y_proba = y_proba[:, 1]

        precision, recall, _ = precision_recall_curve(y_true, y_proba)
        pr_auc = auc(recall, precision)

        ax.plot(recall, precision, label=f'PR curve (AUC = {pr_auc:.3f})', linewidth=2)

    else:
        # Multiclass - plot PR curve for each class
        from sklearn.preprocessing import label_binarize
        classes = np.unique(y_true)
        y_true_bin = label_binarize(y_true, classes=classes)

        for i in range(len(classes)):
            precision, recall, _ = precision_recall_curve(y_true_bin[:, i], y_proba[:, i])
            pr_auc = auc(recall, precision)
            ax.plot(recall, precision, label=f'Class {classes[i]} (AUC = {pr_auc:.3f})', linewidth=2)

    # Plot baseline
    baseline = np.sum(y_true) / len(y_true) if y_proba.ndim == 1 else 1 / len(np.unique(y_true))
    ax.axhline(y=baseline, color='k', linestyle='--', label=f'Baseline (y={baseline:.3f})', linewidth=1)

    ax.set_xlabel('Recall')
    ax.set_ylabel('Precision')
    ax.set_title('Precision-Recall Curve')
    ax.legend(loc='best')
    ax.grid(True, alpha=0.3)

    plt.tight_layout()

    if output_path:
        plt.savefig(output_path, dpi=300, bbox_inches='tight')
        plt.close()
        return output_path
    else:
        plt.show()
        return ""


def plot_calibration_curve(
    mean_predicted_probs: np.ndarray,
    fraction_of_positives: np.ndarray,
    output_path: Optional[str] = None,
    seed: int = 42
) -> str:
    """
    Plot calibration curve.

    Args:
        mean_predicted_probs: Mean predicted probabilities per bin
        fraction_of_positives: Fraction of positives per bin
        output_path: Path to save plot
        seed: Random seed for reproducibility

    Returns:
        Path to saved plot
    """
    np.random.seed(seed)

    fig, ax = plt.subplots(figsize=(10, 8))

    # Plot calibration curve
    mask = ~np.isnan(mean_predicted_probs)
    ax.plot(
        mean_predicted_probs[mask],
        fraction_of_positives[mask],
        marker='o',
        linewidth=2,
        markersize=8,
        label='Calibration curve'
    )

    # Plot perfect calibration
    ax.plot([0, 1], [0, 1], 'k--', label='Perfect calibration', linewidth=1)

    ax.set_xlabel('Mean Predicted Probability')
    ax.set_ylabel('Fraction of Positives')
    ax.set_title('Calibration Curve')
    ax.legend(loc='best')
    ax.grid(True, alpha=0.3)
    ax.set_xlim([-0.05, 1.05])
    ax.set_ylim([-0.05, 1.05])

    plt.tight_layout()

    if output_path:
        plt.savefig(output_path, dpi=300, bbox_inches='tight')
        plt.close()
        return output_path
    else:
        plt.show()
        return ""


def plot_confidence_histogram(
    y_true: np.ndarray,
    y_proba: np.ndarray,
    output_path: Optional[str] = None,
    seed: int = 42
) -> str:
    """
    Plot histogram of prediction confidences, separated by correct/incorrect.

    Args:
        y_true: True labels
        y_proba: Predicted probabilities
        output_path: Path to save plot
        seed: Random seed for reproducibility

    Returns:
        Path to saved plot
    """
    np.random.seed(seed)

    fig, ax = plt.subplots(figsize=(10, 8))

    # Get confidences and predictions
    if y_proba.ndim == 1:
        confidences = y_proba
        y_pred = (y_proba > 0.5).astype(int)
    else:
        confidences = np.max(y_proba, axis=1)
        y_pred = np.argmax(y_proba, axis=1)

    # Separate correct and incorrect
    correct_mask = y_pred == y_true
    correct_confidences = confidences[correct_mask]
    incorrect_confidences = confidences[~correct_mask]

    # Plot histograms
    bins = np.linspace(0, 1, 20)
    ax.hist(correct_confidences, bins=bins, alpha=0.6, label='Correct', color='green')
    ax.hist(incorrect_confidences, bins=bins, alpha=0.6, label='Incorrect', color='red')

    ax.set_xlabel('Prediction Confidence')
    ax.set_ylabel('Count')
    ax.set_title('Confidence Distribution')
    ax.legend(loc='best')
    ax.grid(True, alpha=0.3)

    plt.tight_layout()

    if output_path:
        plt.savefig(output_path, dpi=300, bbox_inches='tight')
        plt.close()
        return output_path
    else:
        plt.show()
        return ""
