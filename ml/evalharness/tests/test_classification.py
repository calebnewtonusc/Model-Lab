"""
Tests for Classification Evaluator
"""

import pytest
import numpy as np
from evalharness.evaluators.classification import ClassificationEvaluator
from evalharness.core.schemas import EvaluationConfig


@pytest.fixture
def perfect_predictions():
    """Perfect classification predictions"""
    np.random.seed(42)
    y_true = np.array([0, 0, 0, 0, 0, 1, 1, 1, 1, 1])
    y_pred = y_true.copy()
    y_proba = np.zeros((10, 2))
    y_proba[y_true == 0, 0] = 1.0
    y_proba[y_true == 1, 1] = 1.0
    return y_true, y_pred, y_proba


@pytest.fixture
def imperfect_predictions():
    """Imperfect classification predictions with some errors"""
    np.random.seed(42)
    y_true = np.array([0, 0, 0, 0, 0, 1, 1, 1, 1, 1])
    y_pred = np.array([0, 0, 0, 1, 0, 1, 1, 0, 1, 1])  # 2 errors
    y_proba = np.array([
        [0.9, 0.1], [0.8, 0.2], [0.7, 0.3], [0.4, 0.6], [0.6, 0.4],
        [0.2, 0.8], [0.1, 0.9], [0.6, 0.4], [0.3, 0.7], [0.2, 0.8]
    ])
    return y_true, y_pred, y_proba


@pytest.fixture
def sample_data():
    """Sample feature data"""
    np.random.seed(42)
    return np.random.randn(10, 3)


class TestClassificationEvaluator:

    def test_perfect_accuracy(self, perfect_predictions, sample_data):
        """Test perfect predictions give 1.0 accuracy"""
        y_true, y_pred, y_proba = perfect_predictions

        evaluator = ClassificationEvaluator()
        config = EvaluationConfig(compute_slices=False, run_stress_tests=False)

        report = evaluator.evaluate(
            predictions=y_pred,
            labels=y_true,
            probabilities=y_proba,
            data=sample_data,
            config=config
        )

        assert report.metrics['accuracy'] == 1.0
        assert report.metrics['precision'] == 1.0
        assert report.metrics['recall'] == 1.0
        assert report.metrics['f1'] == 1.0

    def test_imperfect_accuracy(self, imperfect_predictions, sample_data):
        """Test imperfect predictions give correct accuracy"""
        y_true, y_pred, y_proba = imperfect_predictions

        evaluator = ClassificationEvaluator()
        config = EvaluationConfig(compute_slices=False, run_stress_tests=False)

        report = evaluator.evaluate(
            predictions=y_pred,
            labels=y_true,
            probabilities=y_proba,
            data=sample_data,
            config=config
        )

        # 8 correct out of 10 = 0.8 accuracy
        assert report.metrics['accuracy'] == 0.8
        assert 0 <= report.metrics['precision'] <= 1
        assert 0 <= report.metrics['recall'] <= 1

    def test_confusion_matrix(self, imperfect_predictions, sample_data):
        """Test confusion matrix computation"""
        y_true, y_pred, y_proba = imperfect_predictions

        evaluator = ClassificationEvaluator()
        config = EvaluationConfig(compute_slices=False, run_stress_tests=False)

        report = evaluator.evaluate(
            predictions=y_pred,
            labels=y_true,
            probabilities=y_proba,
            data=sample_data,
            config=config
        )

        assert 'confusion_matrix' in report.metrics
        cm = report.metrics['confusion_matrix']

        # Should be 2x2 for binary classification
        assert len(cm) == 2
        assert len(cm[0]) == 2

        # Total should equal number of samples
        total = sum(sum(row) for row in cm)
        assert total == len(y_true)

    def test_roc_auc_computation(self, imperfect_predictions, sample_data):
        """Test ROC-AUC computation"""
        y_true, y_pred, y_proba = imperfect_predictions

        evaluator = ClassificationEvaluator()
        config = EvaluationConfig(compute_slices=False, run_stress_tests=False)

        report = evaluator.evaluate(
            predictions=y_pred,
            labels=y_true,
            probabilities=y_proba,
            data=sample_data,
            config=config
        )

        assert 'roc_auc' in report.metrics
        assert 0 <= report.metrics['roc_auc'] <= 1

    def test_confidence_intervals(self, imperfect_predictions, sample_data):
        """Test bootstrap confidence intervals"""
        y_true, y_pred, y_proba = imperfect_predictions

        evaluator = ClassificationEvaluator()
        config = EvaluationConfig(
            compute_slices=False,
            run_stress_tests=False,
            bootstrap_iterations=100  # Fewer iterations for speed
        )

        report = evaluator.evaluate(
            predictions=y_pred,
            labels=y_true,
            probabilities=y_proba,
            data=sample_data,
            config=config
        )

        assert report.confidence_intervals is not None
        assert 'accuracy' in report.confidence_intervals

        ci = report.confidence_intervals['accuracy']
        assert 'lower' in ci
        assert 'upper' in ci
        assert 'mean' in ci
        assert ci['lower'] <= ci['mean'] <= ci['upper']

    def test_slicing(self, imperfect_predictions, sample_data):
        """Test performance slicing by confidence"""
        y_true, y_pred, y_proba = imperfect_predictions

        evaluator = ClassificationEvaluator()
        config = EvaluationConfig(
            compute_slices=True,
            run_stress_tests=False
        )

        report = evaluator.evaluate(
            predictions=y_pred,
            labels=y_true,
            probabilities=y_proba,
            data=sample_data,
            config=config
        )

        assert report.slices is not None
        assert len(report.slices) > 0

        # Check that slices have required fields
        for slice_name, slice_metrics in report.slices.items():
            assert 'accuracy' in slice_metrics
            assert 'count' in slice_metrics

    def test_failure_examples(self, imperfect_predictions, sample_data):
        """Test failure example selection"""
        y_true, y_pred, y_proba = imperfect_predictions

        evaluator = ClassificationEvaluator()
        config = EvaluationConfig(
            compute_slices=False,
            run_stress_tests=False,
            n_failure_examples=5
        )

        report = evaluator.evaluate(
            predictions=y_pred,
            labels=y_true,
            probabilities=y_proba,
            data=sample_data,
            config=config
        )

        assert report.failure_examples is not None
        assert len(report.failure_examples) > 0

        # Check that failure examples have required fields
        for example in report.failure_examples:
            assert 'idx' in example
            assert 'true_label' in example
            assert 'predicted_label' in example
            assert 'confidence' in example

    def test_stress_tests(self, imperfect_predictions, sample_data):
        """Test stress testing functionality"""
        y_true, y_pred, y_proba = imperfect_predictions

        evaluator = ClassificationEvaluator()
        config = EvaluationConfig(
            compute_slices=False,
            run_stress_tests=True
        )

        report = evaluator.evaluate(
            predictions=y_pred,
            labels=y_true,
            probabilities=y_proba,
            data=sample_data,
            config=config
        )

        assert report.stress_tests is not None
        assert len(report.stress_tests['results']) > 0

        # Check stress test structure
        for test in report.stress_tests['results']:
            assert 'test_name' in test
            assert 'clean_performance' in test
            assert 'corrupted_performance' in test
            assert 'degradation_pct' in test

    def test_takeaway_generation(self, imperfect_predictions, sample_data):
        """Test takeaway text generation"""
        y_true, y_pred, y_proba = imperfect_predictions

        evaluator = ClassificationEvaluator()
        config = EvaluationConfig(compute_slices=False, run_stress_tests=False)

        report = evaluator.evaluate(
            predictions=y_pred,
            labels=y_true,
            probabilities=y_proba,
            data=sample_data,
            config=config
        )

        takeaway = report.get_takeaway()
        assert takeaway is not None
        assert len(takeaway) > 0

        # Check that it's approximately 5 sentences
        sentences = [s for s in takeaway.split('.') if s.strip()]
        assert 4 <= len(sentences) <= 6

    def test_multiclass(self):
        """Test multiclass classification (3+ classes)"""
        np.random.seed(42)

        # 3-class problem
        y_true = np.array([0, 0, 0, 1, 1, 1, 2, 2, 2])
        y_pred = np.array([0, 0, 1, 1, 1, 2, 2, 2, 2])  # Some errors
        y_proba = np.random.dirichlet([1, 1, 1], 9)  # Random probabilities that sum to 1
        data = np.random.randn(9, 3)

        evaluator = ClassificationEvaluator()
        config = EvaluationConfig(compute_slices=False, run_stress_tests=False)

        report = evaluator.evaluate(
            predictions=y_pred,
            labels=y_true,
            probabilities=y_proba,
            data=data,
            config=config
        )

        # Should handle multiclass
        assert report.metrics['accuracy'] is not None
        assert 'confusion_matrix' in report.metrics

        # Confusion matrix should be 3x3
        cm = report.metrics['confusion_matrix']
        assert len(cm) == 3
        assert len(cm[0]) == 3


class TestClassificationMetrics:
    """Test individual metric functions"""

    def test_accuracy_edge_cases(self):
        """Test accuracy with edge cases"""
        # All correct
        assert 1.0 == compute_accuracy([0, 1, 0, 1], [0, 1, 0, 1])

        # All wrong
        assert 0.0 == compute_accuracy([0, 0, 0, 0], [1, 1, 1, 1])

        # Half correct
        assert 0.5 == compute_accuracy([0, 0, 1, 1], [0, 1, 1, 0])


def compute_accuracy(y_true, y_pred):
    """Helper to compute accuracy"""
    return np.mean(np.array(y_true) == np.array(y_pred))


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
