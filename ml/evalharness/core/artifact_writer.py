"""
Writes evaluation outputs in standardized format.

Standard directory structure:
    artifacts/<run_id>/eval/
    ├── eval_summary.json
    ├── metrics.json
    ├── confidence_intervals.json
    ├── slices.json
    ├── failure_examples.json
    ├── takeaway.txt (exactly 5 sentences)
    ├── plots/
    │   ├── confusion_matrix.png
    │   ├── roc_curve.png
    │   └── calibration_curve.png
    └── repro.md
"""

import json
import os
from pathlib import Path
from typing import Any, Dict
from .schemas import EvaluationReport


class ArtifactWriter:
    """Writes evaluation artifacts to disk in standardized format."""

    def __init__(self, output_dir: str):
        """
        Initialize artifact writer.

        Args:
            output_dir: Base directory for writing artifacts
        """
        self.output_dir = Path(output_dir)
        self.eval_dir = self.output_dir / 'eval'
        self.plots_dir = self.eval_dir / 'plots'

        # Create directories
        self.eval_dir.mkdir(parents=True, exist_ok=True)
        self.plots_dir.mkdir(parents=True, exist_ok=True)

    def write_report(self, report: EvaluationReport):
        """
        Write complete evaluation report to disk.

        Args:
            report: EvaluationReport object to write
        """
        # Write metrics.json
        self._write_json('metrics.json', report.metrics)

        # Write confidence_intervals.json
        if report.confidence_intervals:
            self._write_json('confidence_intervals.json', report.confidence_intervals)

        # Write slices.json
        if report.slices:
            self._write_json('slices.json', report.slices)

        # Write failure_examples.json
        if report.failure_examples:
            self._write_json('failure_examples.json', report.failure_examples)

        # Write takeaway.txt (exactly 5 sentences)
        takeaway = report.get_takeaway()
        self._write_text('takeaway.txt', takeaway)

        # Write eval_summary.json (complete report)
        self._write_json('eval_summary.json', report.to_dict())

        # Note: plots are written directly by plot generators
        # Note: repro.md is generated separately by repro pack system

    def _write_json(self, filename: str, data: Any):
        """Write JSON file."""
        filepath = self.eval_dir / filename
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2, default=str)

    def _write_text(self, filename: str, content: str):
        """Write text file."""
        filepath = self.eval_dir / filename
        with open(filepath, 'w') as f:
            f.write(content)

    def get_plots_dir(self) -> Path:
        """Get the plots directory path."""
        return self.plots_dir

    def get_eval_dir(self) -> Path:
        """Get the eval directory path."""
        return self.eval_dir
