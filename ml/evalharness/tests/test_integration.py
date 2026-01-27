"""
Integration tests for EvalHarness
Tests the complete end-to-end workflow
"""

import pytest
import numpy as np
import tempfile
import shutil
import os
from evalharness import evaluate
from evalharness.core.schemas import EvaluationConfig


class TestEvalHarnessIntegration:
    """Test complete evaluation pipeline"""

    @pytest.fixture
    def binary_classification_data(self):
        """Create sample binary classification data"""
        np.random.seed(42)

        n_samples = 100
        n_features = 5

        # Generate features
        X = np.random.randn(n_samples, n_features)

        # Generate labels
        y_true = np.random.randint(0, 2, n_samples)

        # Generate predictions (80% accurate)
        y_pred = y_true.copy()
        errors = np.random.choice(n_samples, size=20, replace=False)
        y_pred[errors] = 1 - y_pred[errors]

        # Generate probabilities
        y_proba = np.zeros((n_samples, 2))
        for i in range(n_samples):
            if y_pred[i] == 0:
                y_proba[i] = [0.7 + np.random.rand() * 0.3, 0.0]
                y_proba[i, 1] = 1 - y_proba[i, 0]
            else:
                y_proba[i] = [0.0, 0.7 + np.random.rand() * 0.3]
                y_proba[i, 0] = 1 - y_proba[i, 1]

        return X, y_true, y_pred, y_proba

    def test_full_evaluation_pipeline(self, binary_classification_data):
        """Test complete evaluation from start to finish"""
        X, y_true, y_pred, y_proba = binary_classification_data

        # Create temporary output directory
        with tempfile.TemporaryDirectory() as tmpdir:
            # Run evaluation
            report = evaluate(
                task_type='classification',
                predictions=y_pred,
                labels=y_true,
                probabilities=y_proba,
                data=X,
                output_dir=tmpdir,
                config={
                    'compute_slices': True,
                    'run_stress_tests': False,
                    'bootstrap_iterations': 100,
                    'n_failure_examples': 5
                }
            )

            # Check report structure
            assert report is not None
            assert report.metrics is not None
            assert report.confidence_intervals is not None
            assert report.slices is not None
            assert report.failure_examples is not None

            # Check basic metrics
            assert 'accuracy' in report.metrics
            assert 0.7 <= report.metrics['accuracy'] <= 0.9  # Should be around 80%

            # Check output files were created
            assert os.path.exists(os.path.join(tmpdir, 'metrics.json'))
            assert os.path.exists(os.path.join(tmpdir, 'confidence_intervals.json'))
            assert os.path.exists(os.path.join(tmpdir, 'slices.json'))
            assert os.path.exists(os.path.join(tmpdir, 'failure_examples.json'))
            assert os.path.exists(os.path.join(tmpdir, 'takeaway.txt'))
            assert os.path.exists(os.path.join(tmpdir, 'eval_summary.json'))

            # Check plots directory
            plots_dir = os.path.join(tmpdir, 'plots')
            assert os.path.exists(plots_dir)
            assert os.path.exists(os.path.join(plots_dir, 'confusion_matrix.png'))
            assert os.path.exists(os.path.join(plots_dir, 'roc_curve.png'))

    def test_evaluation_with_stress_tests(self, binary_classification_data):
        """Test evaluation with stress testing enabled"""
        X, y_true, y_pred, y_proba = binary_classification_data

        with tempfile.TemporaryDirectory() as tmpdir:
            report = evaluate(
                task_type='classification',
                predictions=y_pred,
                labels=y_true,
                probabilities=y_proba,
                data=X,
                output_dir=tmpdir,
                config={
                    'compute_slices': False,
                    'run_stress_tests': True,
                    'bootstrap_iterations': 50
                }
            )

            # Check stress tests were run
            assert report.stress_tests is not None
            assert 'results' in report.stress_tests
            assert len(report.stress_tests['results']) > 0

            # Check stress test results structure
            for test in report.stress_tests['results']:
                assert 'test_name' in test
                assert 'degradation_pct' in test

    def test_minimal_evaluation(self, binary_classification_data):
        """Test evaluation with minimal configuration"""
        X, y_true, y_pred, y_proba = binary_classification_data

        with tempfile.TemporaryDirectory() as tmpdir:
            report = evaluate(
                task_type='classification',
                predictions=y_pred,
                labels=y_true,
                probabilities=y_proba,
                data=X,
                output_dir=tmpdir,
                config={
                    'compute_slices': False,
                    'run_stress_tests': False,
                    'bootstrap_iterations': 0  # Skip CIs for speed
                }
            )

            # Should still have basic metrics
            assert report.metrics is not None
            assert 'accuracy' in report.metrics

            # Should have minimal output files
            assert os.path.exists(os.path.join(tmpdir, 'metrics.json'))
            assert os.path.exists(os.path.join(tmpdir, 'eval_summary.json'))

    def test_regression_evaluation(self):
        """Test regression evaluation"""
        np.random.seed(42)

        n_samples = 100
        n_features = 5

        # Generate data
        X = np.random.randn(n_samples, n_features)
        y_true = np.random.randn(n_samples) * 10 + 50

        # Generate predictions (with some error)
        y_pred = y_true + np.random.randn(n_samples) * 2

        with tempfile.TemporaryDirectory() as tmpdir:
            report = evaluate(
                task_type='regression',
                predictions=y_pred,
                labels=y_true,
                data=X,
                output_dir=tmpdir,
                config={
                    'compute_slices': False,
                    'run_stress_tests': False,
                    'bootstrap_iterations': 50
                }
            )

            # Check regression metrics
            assert 'mae' in report.metrics
            assert 'rmse' in report.metrics
            assert 'r2' in report.metrics

            # R² should be high since predictions are close to true values
            assert report.metrics['r2'] > 0.7

            # Output files should exist
            assert os.path.exists(os.path.join(tmpdir, 'metrics.json'))
            assert os.path.exists(os.path.join(tmpdir, 'plots', 'predicted_vs_actual.png'))

    def test_deterministic_plots(self, binary_classification_data):
        """Test that plots are deterministic with same seed"""
        X, y_true, y_pred, y_proba = binary_classification_data

        # Run twice with same seed
        outputs = []
        for _ in range(2):
            with tempfile.TemporaryDirectory() as tmpdir:
                report = evaluate(
                    task_type='classification',
                    predictions=y_pred,
                    labels=y_true,
                    probabilities=y_proba,
                    data=X,
                    output_dir=tmpdir,
                    config={
                        'compute_slices': False,
                        'run_stress_tests': False,
                        'seed': 42
                    }
                )

                # Read confusion matrix plot
                cm_path = os.path.join(tmpdir, 'plots', 'confusion_matrix.png')
                with open(cm_path, 'rb') as f:
                    outputs.append(f.read())

        # Plots should be identical
        assert outputs[0] == outputs[1]


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
