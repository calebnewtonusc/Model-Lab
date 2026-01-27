"""
Failure example selection strategies.

Identifies interesting failure cases for investigation.
"""

import numpy as np
from typing import List, Dict, Any, Optional


def select_top_confident_wrong(
    y_true: np.ndarray,
    y_pred: np.ndarray,
    y_proba: Optional[np.ndarray] = None,
    n: int = 10,
    data: Optional[np.ndarray] = None
) -> List[Dict[str, Any]]:
    """
    Select top N examples where model was confident but wrong.

    These are the most egregious errors worth investigating.

    Args:
        y_true: True labels
        y_pred: Predicted labels
        y_proba: Predicted probabilities
        n: Number of examples to return
        data: Optional input features

    Returns:
        List of failure examples with metadata
    """
    if y_proba is None:
        # Can't select by confidence without probabilities
        return []

    # Find incorrect predictions
    incorrect_mask = y_pred != y_true

    if not np.any(incorrect_mask):
        return []  # No errors!

    # Get confidences for incorrect predictions
    if y_proba.ndim == 1:
        confidences = y_proba[incorrect_mask]
    else:
        confidences = np.max(y_proba[incorrect_mask], axis=1)

    # Get indices of incorrect predictions
    incorrect_indices = np.where(incorrect_mask)[0]

    # Sort by confidence (descending)
    sorted_indices = np.argsort(confidences)[::-1][:n]

    failures = []
    for i in sorted_indices:
        idx = incorrect_indices[i]
        failure = {
            'index': int(idx),
            'true_label': int(y_true[idx]) if np.isscalar(y_true[idx]) else y_true[idx].tolist(),
            'predicted_label': int(y_pred[idx]) if np.isscalar(y_pred[idx]) else y_pred[idx].tolist(),
            'confidence': float(confidences[i]),
            'failure_type': 'high_confidence_wrong'
        }

        if data is not None:
            failure['features'] = data[idx].tolist() if data.ndim > 1 else float(data[idx])

        failures.append(failure)

    return failures


def select_low_confidence_correct(
    y_true: np.ndarray,
    y_pred: np.ndarray,
    y_proba: Optional[np.ndarray] = None,
    n: int = 10,
    data: Optional[np.ndarray] = None
) -> List[Dict[str, Any]]:
    """
    Select top N examples where model was correct but uncertain.

    These represent edge cases or difficult examples.

    Args:
        y_true: True labels
        y_pred: Predicted labels
        y_proba: Predicted probabilities
        n: Number of examples to return
        data: Optional input features

    Returns:
        List of examples with metadata
    """
    if y_proba is None:
        return []

    # Find correct predictions
    correct_mask = y_pred == y_true

    if not np.any(correct_mask):
        return []

    # Get confidences for correct predictions
    if y_proba.ndim == 1:
        confidences = y_proba[correct_mask]
    else:
        confidences = np.max(y_proba[correct_mask], axis=1)

    # Get indices of correct predictions
    correct_indices = np.where(correct_mask)[0]

    # Sort by confidence (ascending)
    sorted_indices = np.argsort(confidences)[:n]

    examples = []
    for i in sorted_indices:
        idx = correct_indices[i]
        example = {
            'index': int(idx),
            'true_label': int(y_true[idx]) if np.isscalar(y_true[idx]) else y_true[idx].tolist(),
            'predicted_label': int(y_pred[idx]) if np.isscalar(y_pred[idx]) else y_pred[idx].tolist(),
            'confidence': float(confidences[i]),
            'failure_type': 'low_confidence_correct'
        }

        if data is not None:
            example['features'] = data[idx].tolist() if data.ndim > 1 else float(data[idx])

        examples.append(example)

    return examples


def select_worst_slice_errors(
    slices: List[Dict[str, Any]],
    y_true: np.ndarray,
    y_pred: np.ndarray,
    y_proba: Optional[np.ndarray] = None,
    n: int = 5,
    data: Optional[np.ndarray] = None
) -> List[Dict[str, Any]]:
    """
    Select errors from the worst-performing slice.

    Args:
        slices: List of slice results (sorted by performance)
        y_true: True labels
        y_pred: Predicted labels
        y_proba: Predicted probabilities
        n: Number of examples to return per slice
        data: Optional input features

    Returns:
        List of failure examples from worst slices
    """
    if not slices:
        return []

    # Get worst slice (last in sorted list)
    worst_slice = slices[-1]
    slice_indices = np.array(worst_slice['indices'])

    # Find incorrect predictions in this slice
    y_true_slice = y_true[slice_indices]
    y_pred_slice = y_pred[slice_indices]
    incorrect_mask = y_pred_slice != y_true_slice

    if not np.any(incorrect_mask):
        return []

    # Get a sample of errors from this slice
    incorrect_slice_indices = slice_indices[incorrect_mask]
    sample_size = min(n, len(incorrect_slice_indices))
    sampled_indices = np.random.choice(incorrect_slice_indices, size=sample_size, replace=False)

    failures = []
    for idx in sampled_indices:
        failure = {
            'index': int(idx),
            'true_label': int(y_true[idx]) if np.isscalar(y_true[idx]) else y_true[idx].tolist(),
            'predicted_label': int(y_pred[idx]) if np.isscalar(y_pred[idx]) else y_pred[idx].tolist(),
            'failure_type': 'worst_slice_error',
            'slice_name': worst_slice['slice_name']
        }

        if y_proba is not None:
            if y_proba.ndim == 1:
                failure['confidence'] = float(y_proba[idx])
            else:
                failure['confidence'] = float(np.max(y_proba[idx]))

        if data is not None:
            failure['features'] = data[idx].tolist() if data.ndim > 1 else float(data[idx])

        failures.append(failure)

    return failures


def select_all_failure_examples(
    y_true: np.ndarray,
    y_pred: np.ndarray,
    y_proba: Optional[np.ndarray] = None,
    slices: Optional[List[Dict[str, Any]]] = None,
    data: Optional[np.ndarray] = None,
    n_per_type: int = 10
) -> List[Dict[str, Any]]:
    """
    Select all types of failure examples.

    Args:
        y_true: True labels
        y_pred: Predicted labels
        y_proba: Predicted probabilities
        slices: Slice results
        data: Optional input features
        n_per_type: Number of examples per failure type

    Returns:
        Combined list of all failure examples
    """
    all_failures = []

    # High confidence wrong
    all_failures.extend(
        select_top_confident_wrong(y_true, y_pred, y_proba, n_per_type, data)
    )

    # Low confidence correct
    all_failures.extend(
        select_low_confidence_correct(y_true, y_pred, y_proba, n_per_type, data)
    )

    # Worst slice errors
    if slices:
        all_failures.extend(
            select_worst_slice_errors(slices, y_true, y_pred, y_proba, n_per_type, data)
        )

    return all_failures
