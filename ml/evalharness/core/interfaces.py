"""
Base interfaces for evaluation framework.
"""

from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional
import numpy as np


class BaseEvaluator(ABC):
    """
    Abstract base class for all evaluators.

    All task-specific evaluators (Classification, Regression, Ranking) inherit from this.
    """

    def __init__(
        self,
        predictions: np.ndarray,
        labels: np.ndarray,
        data: Optional[np.ndarray] = None,
        output_dir: Optional[str] = None,
        config: Optional[Dict[str, Any]] = None
    ):
        """
        Initialize evaluator.

        Args:
            predictions: Model predictions
            labels: Ground truth labels
            data: Input features (optional, for slicing)
            output_dir: Directory to save evaluation artifacts
            config: Configuration options
        """
        self.predictions = np.array(predictions)
        self.labels = np.array(labels)
        self.data = np.array(data) if data is not None else None
        self.output_dir = output_dir
        self.config = config or {}

        # Validate inputs
        self._validate_inputs()

        # Results storage
        self.metrics = {}
        self.slices = []
        self.failure_examples = []
        self.plots = []

    def _validate_inputs(self):
        """Validate input arrays have consistent shapes."""
        if len(self.predictions) != len(self.labels):
            raise ValueError(
                f"Predictions ({len(self.predictions)}) and labels ({len(self.labels)}) must have same length"
            )

        if self.data is not None:
            if len(self.data) != len(self.labels):
                raise ValueError(
                    f"Data ({len(self.data)}) and labels ({len(self.labels)}) must have same length"
                )

    @abstractmethod
    def compute_metrics(self) -> Dict[str, float]:
        """
        Compute task-specific metrics.

        Returns:
            Dictionary of metric names to values
        """
        pass

    @abstractmethod
    def compute_slices(self) -> List[Dict[str, Any]]:
        """
        Compute performance on data slices.

        Returns:
            List of slice results with metrics per slice
        """
        pass

    @abstractmethod
    def find_failure_examples(self) -> List[Dict[str, Any]]:
        """
        Identify and categorize failure examples.

        Returns:
            List of failure examples with metadata
        """
        pass

    @abstractmethod
    def generate_plots(self) -> List[str]:
        """
        Generate task-specific visualizations.

        Returns:
            List of paths to generated plot files
        """
        pass

    def run_stress_tests(self) -> Dict[str, Any]:
        """
        Run stress tests to measure robustness.

        Optional: can be overridden by subclasses.

        Returns:
            Dictionary of stress test results
        """
        if not self.config.get('run_stress_tests', False):
            return {}

        from ..stress import corruption
        return corruption.run_stress_test_suite(
            self.data,
            self.predictions,
            self.labels
        )

    def compute_confidence_intervals(self) -> Dict[str, Dict[str, float]]:
        """
        Compute bootstrap confidence intervals for key metrics.

        Returns:
            Dictionary of metric names to CI results
        """
        if not self.config.get('compute_cis', True):
            return {}

        from ..ci import bootstrap

        # Compute CIs for primary metric(s)
        cis = {}
        primary_metrics = self.config.get('ci_metrics', ['accuracy'])

        for metric_name in primary_metrics:
            if metric_name in self.metrics:
                # Bootstrap on the metric
                cis[metric_name] = bootstrap.bootstrap_confidence_interval(
                    data=(self.predictions, self.labels),
                    metric_fn=self._get_metric_function(metric_name),
                    n_iterations=self.config.get('n_bootstrap', 1000),
                    confidence=self.config.get('confidence_level', 0.95),
                    seed=self.config.get('seed', 42)
                )

        return cis

    @abstractmethod
    def _get_metric_function(self, metric_name: str):
        """
        Get the function to compute a specific metric.

        Args:
            metric_name: Name of the metric

        Returns:
            Function that takes (predictions, labels) and returns metric value
        """
        pass

    def evaluate(self) -> 'EvaluationReport':
        """
        Run complete evaluation pipeline.

        Returns:
            EvaluationReport with all results
        """
        # 1. Compute metrics
        self.metrics = self.compute_metrics()

        # 2. Compute confidence intervals
        confidence_intervals = self.compute_confidence_intervals()

        # 3. Compute slices
        self.slices = self.compute_slices()

        # 4. Find failure examples
        self.failure_examples = self.find_failure_examples()

        # 5. Generate plots
        self.plots = self.generate_plots()

        # 6. Run stress tests (if configured)
        stress_results = self.run_stress_tests()

        # 7. Create report
        from .schemas import EvaluationReport
        report = EvaluationReport(
            metrics=self.metrics,
            confidence_intervals=confidence_intervals,
            slices=self.slices,
            failure_examples=self.failure_examples,
            plots=self.plots,
            stress_tests=stress_results,
            config=self.config
        )

        # 8. Write artifacts to disk
        if self.output_dir:
            from .artifact_writer import ArtifactWriter
            writer = ArtifactWriter(self.output_dir)
            writer.write_report(report)

        return report
