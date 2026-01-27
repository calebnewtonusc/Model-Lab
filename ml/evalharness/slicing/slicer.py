"""
Data slicing functions for performance analysis.

Supports slicing by:
- Confidence levels (deciles)
- Feature values (categorical)
- Missingness patterns
"""

import numpy as np
import pandas as pd
from typing import Dict, List, Any, Callable, Optional


def slice_by_confidence(
    predictions_proba: np.ndarray,
    n_buckets: int = 10
) -> Dict[str, np.ndarray]:
    """
    Slice data by prediction confidence into deciles.

    Args:
        predictions_proba: Predicted probabilities
        n_buckets: Number of confidence buckets

    Returns:
        Dictionary mapping bucket names to indices
    """
    # Get max confidence for each prediction
    if predictions_proba.ndim == 1:
        confidences = predictions_proba
    else:
        confidences = np.max(predictions_proba, axis=1)

    # Create buckets
    percentiles = np.linspace(0, 100, n_buckets + 1)
    bucket_edges = np.percentile(confidences, percentiles)

    slices = {}
    for i in range(n_buckets):
        lower = bucket_edges[i]
        upper = bucket_edges[i + 1]

        if i == n_buckets - 1:
            # Include upper bound in last bucket
            mask = (confidences >= lower) & (confidences <= upper)
        else:
            mask = (confidences >= lower) & (confidences < upper)

        slices[f"confidence_p{int(percentiles[i])}-{int(percentiles[i+1])}"] = np.where(mask)[0]

    return slices


def slice_by_feature(
    data: np.ndarray,
    feature_index: int,
    feature_name: Optional[str] = None
) -> Dict[str, np.ndarray]:
    """
    Slice data by a categorical feature.

    Args:
        data: Input data array
        feature_index: Index of the feature to slice by
        feature_name: Optional name of the feature

    Returns:
        Dictionary mapping feature values to indices
    """
    if data is None:
        return {}

    feature_values = data[:, feature_index] if data.ndim > 1 else data
    unique_values = np.unique(feature_values)

    slices = {}
    for value in unique_values:
        mask = feature_values == value
        name = f"{feature_name or f'feature_{feature_index}'}={value}"
        slices[name] = np.where(mask)[0]

    return slices


def slice_by_missingness(
    data: np.ndarray,
    thresholds: List[float] = [0.1, 0.3]
) -> Dict[str, np.ndarray]:
    """
    Slice data by missingness patterns (low/medium/high missing values).

    Args:
        data: Input data array
        thresholds: Thresholds for low/medium/high missingness

    Returns:
        Dictionary mapping missingness levels to indices
    """
    if data is None:
        return {}

    # Count missing values per row
    if data.ndim == 1:
        missing_counts = np.isnan(data).astype(int)
    else:
        missing_counts = np.sum(np.isnan(data), axis=1)
        missing_fractions = missing_counts / data.shape[1]

    slices = {}

    # Low missingness
    mask = missing_fractions < thresholds[0]
    slices['missingness_low'] = np.where(mask)[0]

    # Medium missingness
    mask = (missing_fractions >= thresholds[0]) & (missing_fractions < thresholds[1])
    slices['missingness_medium'] = np.where(mask)[0]

    # High missingness
    mask = missing_fractions >= thresholds[1]
    slices['missingness_high'] = np.where(mask)[0]

    return slices


def evaluate_slices(
    slices: Dict[str, np.ndarray],
    y_true: np.ndarray,
    y_pred: np.ndarray,
    metric_fn: Callable,
    min_samples: int = 10
) -> List[Dict[str, Any]]:
    """
    Evaluate a metric on each slice.

    Args:
        slices: Dictionary of slice names to indices
        y_true: True labels
        y_pred: Predicted labels
        metric_fn: Function that computes metric from (y_true, y_pred)
        min_samples: Minimum samples required to evaluate a slice

    Returns:
        List of slice results with metrics
    """
    results = []

    for slice_name, indices in slices.items():
        if len(indices) < min_samples:
            continue

        y_true_slice = y_true[indices]
        y_pred_slice = y_pred[indices]

        try:
            metric_value = metric_fn(y_true_slice, y_pred_slice)

            results.append({
                'slice_name': slice_name,
                'sample_count': len(indices),
                'metric_value': float(metric_value),
                'indices': indices.tolist()
            })
        except Exception as e:
            # Skip slices where metric computation fails
            print(f"Warning: Could not compute metric for slice '{slice_name}': {e}")
            continue

    # Sort by metric value (descending)
    results = sorted(results, key=lambda x: x['metric_value'], reverse=True)

    return results


def create_all_slices(
    data: Optional[np.ndarray],
    predictions_proba: Optional[np.ndarray] = None,
    categorical_features: Optional[List[int]] = None,
    feature_names: Optional[List[str]] = None
) -> Dict[str, np.ndarray]:
    """
    Create all standard slices.

    Args:
        data: Input data array
        predictions_proba: Predicted probabilities (for confidence slicing)
        categorical_features: List of indices of categorical features
        feature_names: Optional list of feature names

    Returns:
        Dictionary of all slices
    """
    all_slices = {}

    # Confidence slices
    if predictions_proba is not None:
        all_slices.update(slice_by_confidence(predictions_proba))

    # Missingness slices
    if data is not None:
        all_slices.update(slice_by_missingness(data))

    # Categorical feature slices
    if data is not None and categorical_features:
        for feat_idx in categorical_features:
            feat_name = feature_names[feat_idx] if feature_names and feat_idx < len(feature_names) else None
            all_slices.update(slice_by_feature(data, feat_idx, feat_name))

    return all_slices
