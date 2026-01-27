"""
Regression metrics computation.

Provides comprehensive regression metrics including:
- MAE, RMSE, R²
- Median Absolute Error
- MAPE, SMAPE
"""

import numpy as np
from typing import Dict
from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score,
    median_absolute_error,
    mean_absolute_percentage_error,
    explained_variance_score
)


def compute_all_metrics(y_true: np.ndarray, y_pred: np.ndarray) -> Dict[str, float]:
    """
    Compute all regression metrics.

    Args:
        y_true: True values
        y_pred: Predicted values

    Returns:
        Dictionary of all computed metrics
    """
    metrics = {}

    # Basic metrics
    metrics['mae'] = mean_absolute_error(y_true, y_pred)
    metrics['mse'] = mean_squared_error(y_true, y_pred)
    metrics['rmse'] = np.sqrt(metrics['mse'])
    metrics['r2'] = r2_score(y_true, y_pred)

    # Additional metrics
    metrics['median_absolute_error'] = median_absolute_error(y_true, y_pred)
    metrics['explained_variance'] = explained_variance_score(y_true, y_pred)

    # Percentage errors (avoid division by zero)
    try:
        metrics['mape'] = mean_absolute_percentage_error(y_true, y_pred)
    except:
        metrics['mape'] = float('inf')

    # SMAPE (Symmetric MAPE)
    metrics['smape'] = compute_smape(y_true, y_pred)

    # Max error
    metrics['max_error'] = float(np.max(np.abs(y_true - y_pred)))

    return metrics


def compute_smape(y_true: np.ndarray, y_pred: np.ndarray) -> float:
    """
    Compute Symmetric Mean Absolute Percentage Error (SMAPE).

    SMAPE is less sensitive to extreme values than MAPE.

    Args:
        y_true: True values
        y_pred: Predicted values

    Returns:
        SMAPE value (0-100%)
    """
    numerator = np.abs(y_true - y_pred)
    denominator = (np.abs(y_true) + np.abs(y_pred)) / 2

    # Avoid division by zero
    mask = denominator != 0
    if not np.any(mask):
        return 0.0

    smape = np.mean(numerator[mask] / denominator[mask]) * 100
    return float(smape)


def compute_residuals(y_true: np.ndarray, y_pred: np.ndarray) -> np.ndarray:
    """
    Compute residuals (errors).

    Args:
        y_true: True values
        y_pred: Predicted values

    Returns:
        Array of residuals
    """
    return y_true - y_pred


def compute_percentage_errors(y_true: np.ndarray, y_pred: np.ndarray) -> np.ndarray:
    """
    Compute percentage errors for each sample.

    Args:
        y_true: True values
        y_pred: Predicted values

    Returns:
        Array of percentage errors
    """
    # Avoid division by zero
    mask = y_true != 0
    percentage_errors = np.zeros_like(y_true)
    percentage_errors[mask] = np.abs((y_true[mask] - y_pred[mask]) / y_true[mask]) * 100
    percentage_errors[~mask] = float('inf')

    return percentage_errors
