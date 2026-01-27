"""
Data corruption for stress testing model robustness.

Tests how model performance degrades under various data corruptions.
"""

import numpy as np
from typing import Dict, Any, Callable, Optional


def corrupt_missing_values(
    data: np.ndarray,
    fraction: float = 0.1,
    seed: int = 42
) -> np.ndarray:
    """
    Randomly mask values as missing (NaN).

    Args:
        data: Input data
        fraction: Fraction of values to corrupt
        seed: Random seed

    Returns:
        Corrupted data with missing values
    """
    np.random.seed(seed)
    corrupted = data.copy()

    # Randomly select values to corrupt
    n_values = corrupted.size
    n_corrupt = int(n_values * fraction)
    corrupt_indices = np.random.choice(n_values, size=n_corrupt, replace=False)

    # Flatten, corrupt, and reshape
    flat = corrupted.flatten()
    flat[corrupt_indices] = np.nan
    corrupted = flat.reshape(corrupted.shape)

    return corrupted


def inject_label_noise(
    labels: np.ndarray,
    fraction: float = 0.05,
    seed: int = 42
) -> np.ndarray:
    """
    Randomly flip labels to wrong values.

    Args:
        labels: True labels
        fraction: Fraction of labels to corrupt
        seed: Random seed

    Returns:
        Labels with noise injected
    """
    np.random.seed(seed)
    corrupted = labels.copy()

    # Get unique labels
    unique_labels = np.unique(labels)
    n_classes = len(unique_labels)

    if n_classes < 2:
        return corrupted  # Can't corrupt single-class labels

    # Randomly select labels to corrupt
    n_corrupt = int(len(labels) * fraction)
    corrupt_indices = np.random.choice(len(labels), size=n_corrupt, replace=False)

    # Flip to random other class
    for idx in corrupt_indices:
        current_label = labels[idx]
        other_labels = unique_labels[unique_labels != current_label]
        corrupted[idx] = np.random.choice(other_labels)

    return corrupted


def corrupt_feature(
    data: np.ndarray,
    column: int,
    corruption_type: str = 'shuffle',
    noise_scale: float = 0.1,
    seed: int = 42
) -> np.ndarray:
    """
    Corrupt a specific feature column.

    Args:
        data: Input data
        column: Column index to corrupt
        corruption_type: Type of corruption ('shuffle' or 'noise')
        noise_scale: Scale of noise to add (for 'noise' type)
        seed: Random seed

    Returns:
        Data with corrupted feature
    """
    np.random.seed(seed)
    corrupted = data.copy()

    if corruption_type == 'shuffle':
        # Shuffle the column
        corrupted[:, column] = np.random.permutation(corrupted[:, column])

    elif corruption_type == 'noise':
        # Add Gaussian noise
        feature_values = corrupted[:, column]
        noise = np.random.normal(0, noise_scale * np.std(feature_values), size=len(feature_values))
        corrupted[:, column] = feature_values + noise

    return corrupted


def measure_degradation(
    model_fn: Callable,
    clean_data: np.ndarray,
    clean_labels: np.ndarray,
    corrupted_data: np.ndarray,
    metric_fn: Callable
) -> Dict[str, float]:
    """
    Measure performance degradation from clean to corrupted data.

    Args:
        model_fn: Function that predicts labels from data
        clean_data: Original clean data
        clean_labels: True labels
        corrupted_data: Corrupted version of data
        metric_fn: Metric function to evaluate

    Returns:
        Dictionary with clean_performance, corrupted_performance, degradation_pct
    """
    # Predict on clean data
    clean_predictions = model_fn(clean_data)
    clean_performance = metric_fn(clean_labels, clean_predictions)

    # Predict on corrupted data
    corrupted_predictions = model_fn(corrupted_data)
    corrupted_performance = metric_fn(clean_labels, corrupted_predictions)

    # Calculate degradation
    if clean_performance != 0:
        degradation_pct = ((clean_performance - corrupted_performance) / clean_performance) * 100
    else:
        degradation_pct = 0.0

    return {
        'clean_performance': float(clean_performance),
        'corrupted_performance': float(corrupted_performance),
        'degradation_pct': float(degradation_pct)
    }


def run_stress_test_suite(
    data: Optional[np.ndarray],
    predictions: np.ndarray,
    labels: np.ndarray,
    model_fn: Optional[Callable] = None,
    metric_fn: Optional[Callable] = None
) -> Dict[str, Any]:
    """
    Run full suite of stress tests.

    Args:
        data: Input features
        predictions: Model predictions (used if model_fn not provided)
        labels: True labels
        model_fn: Optional function that predicts from data
        metric_fn: Metric function to evaluate

    Returns:
        Dictionary of stress test results
    """
    if data is None:
        return {'results': [], 'summary': 'No data provided for stress testing'}

    if metric_fn is None:
        from sklearn.metrics import accuracy_score
        metric_fn = accuracy_score

    results = []

    # Test 1: Missing values corruption
    if model_fn:
        for fraction in [0.1, 0.2, 0.3]:
            corrupted = corrupt_missing_values(data, fraction=fraction)
            result = measure_degradation(model_fn, data, labels, corrupted, metric_fn)
            results.append({
                'test_name': f'missing_values_{int(fraction*100)}pct',
                **result,
                'config': {'fraction': fraction}
            })

    # Test 2: Feature shuffling
    if model_fn and data.ndim > 1:
        for col in range(min(3, data.shape[1])):  # Test first 3 features
            corrupted = corrupt_feature(data, col, corruption_type='shuffle')
            result = measure_degradation(model_fn, data, labels, corrupted, metric_fn)
            results.append({
                'test_name': f'feature_{col}_shuffle',
                **result,
                'config': {'feature': col, 'corruption': 'shuffle'}
            })

    # Test 3: Label noise (if we can re-evaluate)
    # This would require retraining, so we skip it in basic evaluation

    summary = {
        'n_tests': len(results),
        'max_degradation': max([r['degradation_pct'] for r in results]) if results else 0,
        'avg_degradation': np.mean([r['degradation_pct'] for r in results]) if results else 0
    }

    return {
        'results': results,
        'summary': summary
    }
