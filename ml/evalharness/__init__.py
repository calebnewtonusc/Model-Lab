"""
ModelLab EvalHarness
A comprehensive evaluation framework for ML models with standardized outputs.
"""

from .core.interfaces import BaseEvaluator
from .metrics import classification, regression
from .plots import classification as classification_plots
from .slicing import slicer
from .failures import selector
from .ci import bootstrap
from .stress import corruption

__version__ = "1.0.0"

__all__ = [
    'BaseEvaluator',
    'classification',
    'regression',
    'classification_plots',
    'slicer',
    'selector',
    'bootstrap',
    'corruption'
]


def evaluate(task_type, predictions, labels, data=None, output_dir=None, config=None):
    """
    Main entry point for evaluation.

    Args:
        task_type: Type of ML task ('classification', 'regression', 'ranking')
        predictions: Model predictions (array-like)
        labels: Ground truth labels (array-like)
        data: Input features (optional, needed for slicing)
        output_dir: Directory to save evaluation artifacts
        config: Configuration dict for evaluation options

    Returns:
        EvaluationReport object with all metrics, plots, and analysis
    """
    if config is None:
        config = {}

    if task_type == 'classification':
        from .evaluators.classification import ClassificationEvaluator
        evaluator = ClassificationEvaluator(predictions, labels, data, output_dir, config)
        return evaluator.evaluate()
    elif task_type == 'regression':
        from .evaluators.regression import RegressionEvaluator
        evaluator = RegressionEvaluator(predictions, labels, data, output_dir, config)
        return evaluator.evaluate()
    elif task_type == 'ranking':
        from .evaluators.ranking import RankingEvaluator
        evaluator = RankingEvaluator(predictions, labels, data, output_dir, config)
        return evaluator.evaluate()
    else:
        raise ValueError(f"Unknown task_type: {task_type}. Must be 'classification', 'regression', or 'ranking'.")
