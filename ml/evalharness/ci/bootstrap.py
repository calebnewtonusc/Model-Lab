"""
Bootstrap confidence intervals for metrics.

Provides robust uncertainty estimates via resampling.
"""

import numpy as np
from typing import Dict, Tuple, Callable, Any


def bootstrap_confidence_interval(
    data: Tuple[np.ndarray, np.ndarray],
    metric_fn: Callable,
    n_iterations: int = 1000,
    confidence: float = 0.95,
    seed: int = 42
) -> Dict[str, float]:
    """
    Compute bootstrap confidence interval for a metric.

    Args:
        data: Tuple of (predictions, labels)
        metric_fn: Function that computes metric from (predictions, labels)
        n_iterations: Number of bootstrap iterations
        confidence: Confidence level (e.g., 0.95 for 95%)
        seed: Random seed for reproducibility

    Returns:
        Dictionary with mean, lower, upper, confidence, n_bootstraps, seed
    """
    np.random.seed(seed)

    predictions, labels = data
    n_samples = len(predictions)

    # Store bootstrap metric values
    bootstrap_metrics = []

    for _ in range(n_iterations):
        # Resample with replacement
        indices = np.random.choice(n_samples, size=n_samples, replace=True)
        predictions_boot = predictions[indices]
        labels_boot = labels[indices]

        # Compute metric on bootstrap sample
        try:
            metric_value = metric_fn(predictions_boot, labels_boot)
            bootstrap_metrics.append(metric_value)
        except Exception:
            # Skip failed bootstrap samples
            continue

    bootstrap_metrics = np.array(bootstrap_metrics)

    # Compute percentiles for confidence interval
    alpha = 1 - confidence
    lower_percentile = (alpha / 2) * 100
    upper_percentile = (1 - alpha / 2) * 100

    return {
        'mean': float(np.mean(bootstrap_metrics)),
        'std': float(np.std(bootstrap_metrics)),
        'lower': float(np.percentile(bootstrap_metrics, lower_percentile)),
        'upper': float(np.percentile(bootstrap_metrics, upper_percentile)),
        'confidence': confidence,
        'n_bootstraps': n_iterations,
        'seed': seed
    }


def bootstrap_multiple_metrics(
    data: Tuple[np.ndarray, np.ndarray],
    metric_fns: Dict[str, Callable],
    n_iterations: int = 1000,
    confidence: float = 0.95,
    seed: int = 42
) -> Dict[str, Dict[str, float]]:
    """
    Compute bootstrap confidence intervals for multiple metrics.

    Args:
        data: Tuple of (predictions, labels)
        metric_fns: Dictionary of metric names to functions
        n_iterations: Number of bootstrap iterations
        confidence: Confidence level
        seed: Random seed

    Returns:
        Dictionary mapping metric names to CI results
    """
    results = {}

    for metric_name, metric_fn in metric_fns.items():
        results[metric_name] = bootstrap_confidence_interval(
            data, metric_fn, n_iterations, confidence, seed
        )

    return results
