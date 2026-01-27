"""
Failure taxonomy categorization.

Six-category taxonomy for ML failures:
1. Data failures
2. Objective/metric failures
3. Model/representation failures
4. Optimization failures
5. Systems/infra failures
6. Human/UX failures
"""

from enum import Enum
from typing import Dict, Any


class FailureCategory(Enum):
    """Six categories of ML failures."""
    DATA = "data"
    OBJECTIVE = "objective"
    MODEL = "model"
    OPTIMIZATION = "optimization"
    SYSTEMS = "systems"
    HUMAN = "human"


TAXONOMY_DESCRIPTIONS = {
    FailureCategory.DATA: {
        "name": "Data Failures",
        "description": "Issues with training/test data quality, coverage, or distribution",
        "examples": [
            "Training data not representative of deployment",
            "Label noise or errors",
            "Missing features or corrupted data",
            "Distribution shift between train and test"
        ]
    },
    FailureCategory.OBJECTIVE: {
        "name": "Objective/Metric Failures",
        "description": "Mismatch between optimization objective and real-world goals",
        "examples": [
            "Optimizing accuracy when recall matters more",
            "Ignoring fairness constraints",
            "Not accounting for cost-sensitive errors",
            "Goodhart's law: metric becomes target"
        ]
    },
    FailureCategory.MODEL: {
        "name": "Model/Representation Failures",
        "description": "Model architecture or feature representation inadequacies",
        "examples": [
            "Model too simple to capture patterns",
            "Feature engineering missing key signals",
            "Inductive bias mismatch with problem",
            "Poor generalization to edge cases"
        ]
    },
    FailureCategory.OPTIMIZATION: {
        "name": "Optimization Failures",
        "description": "Issues with training process or hyperparameters",
        "examples": [
            "Getting stuck in local minima",
            "Poor hyperparameter choices",
            "Overfitting to training data",
            "Insufficient training time or data"
        ]
    },
    FailureCategory.SYSTEMS: {
        "name": "Systems/Infrastructure Failures",
        "description": "Deployment, scaling, or operational issues",
        "examples": [
            "Model drift over time",
            "Latency too high for production",
            "Batch vs online prediction mismatch",
            "Resource constraints in deployment"
        ]
    },
    FailureCategory.HUMAN: {
        "name": "Human/UX Failures",
        "description": "Issues with human-model interaction or trust",
        "examples": [
            "Users don't trust model predictions",
            "Lack of interpretability for decisions",
            "Poor calibration misleads users",
            "Model used beyond intended scope"
        ]
    }
}


def categorize_failure(failure: Dict[str, Any]) -> FailureCategory:
    """
    Attempt to categorize a failure example.

    This is a heuristic categorization and may not always be accurate.
    Manual review is recommended for critical failures.

    Args:
        failure: Failure example dictionary

    Returns:
        Predicted failure category
    """
    # This is a simplified heuristic categorization
    # In practice, this would use more sophisticated analysis

    failure_type = failure.get('failure_type', '')

    # High confidence wrong often indicates data or representation issues
    if failure_type == 'high_confidence_wrong':
        return FailureCategory.MODEL

    # Low confidence correct might indicate optimization issues
    elif failure_type == 'low_confidence_correct':
        return FailureCategory.OPTIMIZATION

    # Worst slice errors often point to data coverage issues
    elif failure_type == 'worst_slice_error':
        return FailureCategory.DATA

    # Default
    return FailureCategory.MODEL


def get_category_description(category: FailureCategory) -> Dict[str, Any]:
    """
    Get description and examples for a failure category.

    Args:
        category: Failure category

    Returns:
        Dictionary with name, description, and examples
    """
    return TAXONOMY_DESCRIPTIONS[category]
