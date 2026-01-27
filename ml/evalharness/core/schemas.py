"""
Data schemas for evaluation outputs using Pydantic.
"""

from typing import Dict, List, Any, Optional
from pydantic import BaseModel, Field


class MetricResult(BaseModel):
    """Individual metric result."""
    name: str
    value: float
    confidence_interval: Optional[Dict[str, float]] = None


class SliceResult(BaseModel):
    """Performance on a data slice."""
    slice_name: str
    slice_description: str
    sample_count: int
    metrics: Dict[str, float]


class FailureExample(BaseModel):
    """A failure case with metadata."""
    index: int
    true_label: Any
    predicted_label: Any
    confidence: Optional[float] = None
    features: Optional[Dict[str, Any]] = None
    failure_type: str  # e.g., "high_confidence_wrong", "low_confidence_correct"
    taxonomy_category: Optional[str] = None  # One of 6 categories


class StressTestResult(BaseModel):
    """Result from a robustness stress test."""
    test_name: str
    clean_performance: float
    corrupted_performance: float
    degradation_pct: float
    config: Dict[str, Any]


class EvaluationReport(BaseModel):
    """
    Complete evaluation report.

    This is the main output of the evaluation harness, containing all
    metrics, slices, failures, and plots.
    """
    metrics: Dict[str, float]
    confidence_intervals: Dict[str, Dict[str, float]] = Field(default_factory=dict)
    slices: List[Dict[str, Any]] = Field(default_factory=list)
    failure_examples: List[Dict[str, Any]] = Field(default_factory=list)
    plots: List[str] = Field(default_factory=list)
    stress_tests: Dict[str, Any] = Field(default_factory=dict)
    config: Dict[str, Any] = Field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        """Convert report to dictionary."""
        return self.model_dump()

    def get_takeaway(self) -> str:
        """
        Generate 5-sentence takeaway summary.

        Returns:
            Exactly 5 sentences summarizing the evaluation.
        """
        sentences = []

        # Sentence 1: Primary metric
        if 'accuracy' in self.metrics:
            primary_metric = f"accuracy of {self.metrics['accuracy']:.1%}"
        elif 'f1_score' in self.metrics:
            primary_metric = f"F1 score of {self.metrics['f1_score']:.3f}"
        elif 'rmse' in self.metrics:
            primary_metric = f"RMSE of {self.metrics['rmse']:.3f}"
        else:
            primary_metric = "evaluation complete"

        sentences.append(f"The model achieved {primary_metric}.")

        # Sentence 2: Best/worst slices
        if self.slices:
            best_slice = max(self.slices, key=lambda s: s.get('accuracy', s.get('f1_score', 0)))
            worst_slice = min(self.slices, key=lambda s: s.get('accuracy', s.get('f1_score', 0)))
            sentences.append(
                f"Performance varied across slices, with best results on {best_slice['slice_name']} "
                f"and worst on {worst_slice['slice_name']}."
            )
        else:
            sentences.append("No significant performance variation across data slices was detected.")

        # Sentence 3: Failure examples
        if self.failure_examples:
            high_conf_wrong = [f for f in self.failure_examples if f.get('failure_type') == 'high_confidence_wrong']
            if high_conf_wrong:
                sentences.append(
                    f"Found {len(high_conf_wrong)} high-confidence errors that warrant investigation."
                )
            else:
                sentences.append("Most errors occurred with low confidence predictions.")
        else:
            sentences.append("The model showed consistent prediction quality.")

        # Sentence 4: Stress tests
        if self.stress_tests and self.stress_tests.get('results'):
            max_degradation = max(
                r.get('degradation_pct', 0)
                for r in self.stress_tests.get('results', [])
            )
            if max_degradation > 10:
                sentences.append(
                    f"Stress tests revealed up to {max_degradation:.1f}% performance degradation under data corruption."
                )
            else:
                sentences.append("The model demonstrated strong robustness to data corruption.")
        else:
            sentences.append("Robustness stress tests were not performed.")

        # Sentence 5: Recommendation
        if self.metrics.get('accuracy', 0) > 0.95:
            sentences.append("The model is production-ready with strong performance across metrics.")
        elif self.metrics.get('accuracy', 0) > 0.85:
            sentences.append("The model shows good performance but may benefit from targeted improvements on weak slices.")
        else:
            sentences.append("Further model development is recommended to improve overall performance.")

        return " ".join(sentences)

    def get_summary_dict(self) -> Dict[str, Any]:
        """Get a condensed summary of the report."""
        return {
            "primary_metrics": {
                k: v for k, v in self.metrics.items()
                if k in ['accuracy', 'f1_score', 'precision', 'recall', 'roc_auc', 'rmse', 'mae', 'r2']
            },
            "n_slices": len(self.slices),
            "n_failures": len(self.failure_examples),
            "n_plots": len(self.plots),
            "stress_tests_run": bool(self.stress_tests),
            "takeaway": self.get_takeaway()
        }
