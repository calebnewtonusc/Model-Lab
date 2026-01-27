"""Task-specific evaluator implementations."""

from .classification import ClassificationEvaluator

try:
    from .regression import RegressionEvaluator
except ImportError:
    RegressionEvaluator = None

__all__ = ['ClassificationEvaluator', 'RegressionEvaluator']
