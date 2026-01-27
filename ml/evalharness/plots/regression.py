"""
Regression visualization functions.

All plots are deterministic (same seed → same plot).
"""

import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from typing import Optional


# Set style for consistent, professional plots
sns.set_style("whitegrid")


def plot_residuals(
    y_true: np.ndarray,
    y_pred: np.ndarray,
    output_path: Optional[str] = None,
    seed: int = 42
) -> str:
    """
    Plot residuals vs predicted values.

    Args:
        y_true: True values
        y_pred: Predicted values
        output_path: Path to save plot
        seed: Random seed for reproducibility

    Returns:
        Path to saved plot
    """
    np.random.seed(seed)

    residuals = y_true - y_pred

    fig, ax = plt.subplots(figsize=(10, 8))

    ax.scatter(y_pred, residuals, alpha=0.5, s=30)
    ax.axhline(y=0, color='r', linestyle='--', linewidth=2, label='Zero residual')

    ax.set_xlabel('Predicted Values')
    ax.set_ylabel('Residuals')
    ax.set_title('Residual Plot')
    ax.legend()
    ax.grid(True, alpha=0.3)

    plt.tight_layout()

    if output_path:
        plt.savefig(output_path, dpi=300, bbox_inches='tight')
        plt.close()
        return output_path
    else:
        plt.show()
        return ""


def plot_predicted_vs_actual(
    y_true: np.ndarray,
    y_pred: np.ndarray,
    output_path: Optional[str] = None,
    seed: int = 42
) -> str:
    """
    Plot predicted vs actual values.

    Args:
        y_true: True values
        y_pred: Predicted values
        output_path: Path to save plot
        seed: Random seed for reproducibility

    Returns:
        Path to saved plot
    """
    np.random.seed(seed)

    fig, ax = plt.subplots(figsize=(10, 8))

    ax.scatter(y_true, y_pred, alpha=0.5, s=30, label='Predictions')

    # Plot perfect prediction line
    min_val = min(np.min(y_true), np.min(y_pred))
    max_val = max(np.max(y_true), np.max(y_pred))
    ax.plot([min_val, max_val], [min_val, max_val], 'r--', linewidth=2, label='Perfect prediction')

    ax.set_xlabel('True Values')
    ax.set_ylabel('Predicted Values')
    ax.set_title('Predicted vs Actual')
    ax.legend()
    ax.grid(True, alpha=0.3)

    plt.tight_layout()

    if output_path:
        plt.savefig(output_path, dpi=300, bbox_inches='tight')
        plt.close()
        return output_path
    else:
        plt.show()
        return ""


def plot_error_distribution(
    y_true: np.ndarray,
    y_pred: np.ndarray,
    output_path: Optional[str] = None,
    seed: int = 42
) -> str:
    """
    Plot distribution of errors.

    Args:
        y_true: True values
        y_pred: Predicted values
        output_path: Path to save plot
        seed: Random seed for reproducibility

    Returns:
        Path to saved plot
    """
    np.random.seed(seed)

    residuals = y_true - y_pred

    fig, ax = plt.subplots(figsize=(10, 8))

    ax.hist(residuals, bins=50, edgecolor='black', alpha=0.7)
    ax.axvline(x=0, color='r', linestyle='--', linewidth=2, label='Zero error')

    ax.set_xlabel('Residuals')
    ax.set_ylabel('Frequency')
    ax.set_title('Error Distribution')
    ax.legend()
    ax.grid(True, alpha=0.3)

    plt.tight_layout()

    if output_path:
        plt.savefig(output_path, dpi=300, bbox_inches='tight')
        plt.close()
        return output_path
    else:
        plt.show()
        return ""
