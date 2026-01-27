"""
Classification Evaluator.

Complete evaluation pipeline for classification tasks.
"""

import numpy as np
from pathlib import Path
from typing import Dict, List, Any, Optional
from ..core.interfaces import BaseEvaluator
from ..metrics import classification as metrics
from ..plots import classification as plots
from ..slicing import slicer
from ..failures import selector


class ClassificationEvaluator(BaseEvaluator):
    """
    Complete evaluator for classification tasks.

    Implements:
    - Comprehensive metrics (accuracy, precision, recall, F1, ROC-AUC, etc.)
    - Bootstrap confidence intervals
    - Performance slicing (confidence deciles, features, missingness)
    - Failure example selection
    - Stress tests
    - Deterministic plots
    """

    def __init__(
        self,
        predictions: np.ndarray,
        labels: np.ndarray,
        data: Optional[np.ndarray] = None,
        output_dir: Optional[str] = None,
        config: Optional[Dict[str, Any]] = None,
        predictions_proba: Optional[np.ndarray] = None
    ):
        """
        Initialize classification evaluator.

        Args:
            predictions: Predicted class labels
            labels: True labels
            data: Input features (optional, for slicing)
            output_dir: Directory to save artifacts
            config: Configuration options
            predictions_proba: Predicted probabilities (optional, for probabilistic metrics)
        """
        super().__init__(predictions, labels, data, output_dir, config)
        self.predictions_proba = np.array(predictions_proba) if predictions_proba is not None else None

        # Ensure predictions are integers
        self.predictions = self.predictions.astype(int)
        self.labels = self.labels.astype(int)

    def compute_metrics(self) -> Dict[str, float]:
        """
        Compute all classification metrics.

        Returns:
            Dictionary of metrics
        """
        # Compute main metrics
        all_metrics = metrics.compute_all_metrics(
            self.labels,
            self.predictions,
            self.predictions_proba,
            average=self.config.get('average', 'weighted')
        )

        # Add per-class metrics if requested
        if self.config.get('compute_per_class', False):
            per_class = metrics.compute_per_class_metrics(
                self.labels,
                self.predictions,
                class_names=self.config.get('class_names')
            )
            all_metrics['per_class'] = per_class

        return all_metrics

    def compute_slices(self) -> List[Dict[str, Any]]:
        """
        Compute performance on data slices.

        Returns:
            List of slice results
        """
        # Create slices
        all_slices = slicer.create_all_slices(
            data=self.data,
            predictions_proba=self.predictions_proba,
            categorical_features=self.config.get('categorical_features'),
            feature_names=self.config.get('feature_names')
        )

        # Evaluate slices using accuracy
        from sklearn.metrics import accuracy_score

        slice_results = slicer.evaluate_slices(
            all_slices,
            self.labels,
            self.predictions,
            metric_fn=accuracy_score,
            min_samples=self.config.get('min_slice_samples', 10)
        )

        # Add slice-specific metrics
        for slice_result in slice_results:
            indices = np.array(slice_result['indices'])
            y_true_slice = self.labels[indices]
            y_pred_slice = self.predictions[indices]
            y_proba_slice = self.predictions_proba[indices] if self.predictions_proba is not None else None

            # Compute detailed metrics for each slice
            slice_metrics = metrics.compute_all_metrics(
                y_true_slice,
                y_pred_slice,
                y_proba_slice,
                average='weighted'
            )

            slice_result.update({
                'accuracy': slice_metrics['accuracy'],
                'precision': slice_metrics.get('precision', 0),
                'recall': slice_metrics.get('recall', 0),
                'f1_score': slice_metrics.get('f1_score', 0)
            })

            # Remove indices from output (can be large)
            del slice_result['indices']

        return slice_results

    def find_failure_examples(self) -> List[Dict[str, Any]]:
        """
        Identify failure examples for investigation.

        Returns:
            List of failure examples
        """
        n_per_type = self.config.get('n_failures_per_type', 10)

        failures = selector.select_all_failure_examples(
            y_true=self.labels,
            y_pred=self.predictions,
            y_proba=self.predictions_proba,
            slices=self.slices,
            data=self.data,
            n_per_type=n_per_type
        )

        # Categorize failures using taxonomy (if requested)
        if self.config.get('categorize_failures', False):
            from ..failures import taxonomy
            for failure in failures:
                category = taxonomy.categorize_failure(failure)
                failure['taxonomy_category'] = category.value

        return failures

    def generate_plots(self) -> List[str]:
        """
        Generate all evaluation plots.

        Returns:
            List of paths to generated plots
        """
        if not self.output_dir:
            return []

        from ..core.artifact_writer import ArtifactWriter
        writer = ArtifactWriter(self.output_dir)
        plots_dir = writer.get_plots_dir()

        plot_paths = []
        seed = self.config.get('seed', 42)

        # 1. Confusion matrix
        cm = metrics.compute_confusion_matrix(self.labels, self.predictions)
        cm_path = plots_dir / 'confusion_matrix.png'
        plots.plot_confusion_matrix(
            cm,
            class_names=self.config.get('class_names'),
            output_path=str(cm_path),
            seed=seed
        )
        plot_paths.append(str(cm_path))

        # 2. ROC curve (if probabilities available)
        if self.predictions_proba is not None:
            roc_path = plots_dir / 'roc_curve.png'
            plots.plot_roc_curve(
                self.labels,
                self.predictions_proba,
                output_path=str(roc_path),
                seed=seed
            )
            plot_paths.append(str(roc_path))

            # 3. PR curve
            pr_path = plots_dir / 'pr_curve.png'
            plots.plot_pr_curve(
                self.labels,
                self.predictions_proba,
                output_path=str(pr_path),
                seed=seed
            )
            plot_paths.append(str(pr_path))

            # 4. Calibration curve
            mean_probs, frac_pos = metrics.compute_calibration_curve(
                self.labels,
                self.predictions_proba,
                n_bins=10
            )
            calib_path = plots_dir / 'calibration_curve.png'
            plots.plot_calibration_curve(
                mean_probs,
                frac_pos,
                output_path=str(calib_path),
                seed=seed
            )
            plot_paths.append(str(calib_path))

            # 5. Confidence histogram
            conf_path = plots_dir / 'confidence_histogram.png'
            plots.plot_confidence_histogram(
                self.labels,
                self.predictions_proba,
                output_path=str(conf_path),
                seed=seed
            )
            plot_paths.append(str(conf_path))

        return plot_paths

    def _get_metric_function(self, metric_name: str):
        """
        Get the function to compute a specific metric.

        Args:
            metric_name: Name of the metric

        Returns:
            Function that takes (predictions, labels) and returns metric value
        """
        from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score

        metric_map = {
            'accuracy': accuracy_score,
            'f1_score': lambda y_true, y_pred: f1_score(y_true, y_pred, average='weighted', zero_division=0),
            'precision': lambda y_true, y_pred: precision_score(y_true, y_pred, average='weighted', zero_division=0),
            'recall': lambda y_true, y_pred: recall_score(y_true, y_pred, average='weighted', zero_division=0)
        }

        if metric_name not in metric_map:
            # Default to accuracy
            return accuracy_score

        return metric_map[metric_name]
