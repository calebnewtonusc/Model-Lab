"""
ModelLab Client - Core SDK functionality
"""

import os
import json
import time
import hashlib
import subprocess
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, Optional, List
from contextlib import contextmanager
import requests

from .config import get_config


class ModelLabClient:
    """Core client for ModelLab experiment tracking."""

    def __init__(self, api_url: Optional[str] = None):
        self.api_url = api_url or get_config()["api_url"]
        self.current_run_id: Optional[str] = None
        self.run_data: Dict[str, Any] = {}

    def start_run(
        self,
        name: str,
        description: str = "",
        dataset_id: Optional[str] = None,
        seed: Optional[int] = None,
    ) -> str:
        """Start a new experiment run."""
        # Get git info
        git_commit = self._get_git_commit()

        # Auto-detect seed from environment
        if seed is None:
            seed = int(os.environ.get("MODELLAB_SEED", 42))

        run_data = {
            "name": name,
            "description": description,
            "dataset_id": dataset_id,
            "config": {},
            "metrics": {},
            "seed": seed,
            "commit_hash": git_commit,
            "status": "running",
            "created_at": datetime.utcnow().isoformat(),
        }

        try:
            response = requests.post(
                f"{self.api_url}/api/modellab/runs",
                json=run_data,
                timeout=10,
            )
            response.raise_for_status()
            result = response.json()
            self.current_run_id = result["run"]["id"]
            self.run_data = run_data
            print(f"✓ Started run: {name} (ID: {self.current_run_id})")
            return self.current_run_id
        except Exception as e:
            print(f"✗ Failed to start run: {e}")
            # Fallback to local mode
            self.current_run_id = self._generate_run_id()
            self.run_data = run_data
            return self.current_run_id

    def end_run(self, status: str = "completed"):
        """End the current run."""
        if not self.current_run_id:
            print("✗ No active run to end")
            return

        try:
            response = requests.patch(
                f"{self.api_url}/api/modellab/runs/{self.current_run_id}",
                json={"status": status, "completed_at": datetime.utcnow().isoformat()},
                timeout=10,
            )
            response.raise_for_status()
            print(f"✓ Ended run: {self.current_run_id} (status: {status})")
        except Exception as e:
            print(f"✗ Failed to end run: {e}")

        self.current_run_id = None
        self.run_data = {}

    def log_param(self, key: str, value: Any):
        """Log a hyperparameter."""
        if not self.current_run_id:
            print(f"✗ No active run. Call start_run() first.")
            return

        self.run_data.setdefault("config", {})[key] = value

        try:
            response = requests.patch(
                f"{self.api_url}/api/modellab/runs/{self.current_run_id}",
                json={"config": self.run_data["config"]},
                timeout=10,
            )
            response.raise_for_status()
        except Exception as e:
            print(f"✗ Failed to log param {key}: {e}")

    def log_metric(self, key: str, value: float, step: Optional[int] = None):
        """Log a metric value."""
        if not self.current_run_id:
            print(f"✗ No active run. Call start_run() first.")
            return

        self.run_data.setdefault("metrics", {})[key] = value

        try:
            response = requests.patch(
                f"{self.api_url}/api/modellab/runs/{self.current_run_id}",
                json={"metrics": self.run_data["metrics"]},
                timeout=10,
            )
            response.raise_for_status()
        except Exception as e:
            print(f"✗ Failed to log metric {key}: {e}")

    def log_artifact(self, filepath: str, artifact_type: str = "model"):
        """Upload an artifact (model, plot, etc.)."""
        if not self.current_run_id:
            print(f"✗ No active run. Call start_run() first.")
            return

        path = Path(filepath)
        if not path.exists():
            print(f"✗ Artifact not found: {filepath}")
            return

        # Calculate checksum
        checksum = self._calculate_checksum(filepath)
        size = path.stat().st_size

        artifact_data = {
            "run_id": self.current_run_id,
            "name": path.name,
            "type": artifact_type,
            "size": size,
            "checksum": checksum,
            "path": str(path.absolute()),
            "created_at": datetime.utcnow().isoformat(),
        }

        try:
            # Upload artifact metadata
            response = requests.post(
                f"{self.api_url}/api/modellab/artifacts",
                json=artifact_data,
                timeout=10,
            )
            response.raise_for_status()

            # TODO: Upload actual file to storage
            print(f"✓ Logged artifact: {path.name} ({self._format_size(size)})")
        except Exception as e:
            print(f"✗ Failed to log artifact: {e}")

    def _get_git_commit(self) -> Optional[str]:
        """Get current git commit hash."""
        try:
            result = subprocess.run(
                ["git", "rev-parse", "HEAD"],
                capture_output=True,
                text=True,
                timeout=5,
            )
            if result.returncode == 0:
                return result.stdout.strip()[:7]
        except:
            pass
        return None

    def _calculate_checksum(self, filepath: str) -> str:
        """Calculate SHA-256 checksum of file."""
        sha256_hash = hashlib.sha256()
        with open(filepath, "rb") as f:
            for byte_block in iter(lambda: f.read(4096), b""):
                sha256_hash.update(byte_block)
        return sha256_hash.hexdigest()

    def _generate_run_id(self) -> str:
        """Generate a unique run ID."""
        timestamp = int(time.time() * 1000)
        return f"run_{timestamp}"

    def _format_size(self, size: int) -> str:
        """Format file size in human-readable format."""
        for unit in ["B", "KB", "MB", "GB"]:
            if size < 1024.0:
                return f"{size:.1f} {unit}"
            size /= 1024.0
        return f"{size:.1f} TB"


# Global client instance
_client: Optional[ModelLabClient] = None


def init(api_url: str = "http://localhost:3000"):
    """Initialize ModelLab client."""
    global _client
    _client = ModelLabClient(api_url)
    return _client


def _get_client() -> ModelLabClient:
    """Get or create global client."""
    global _client
    if _client is None:
        _client = ModelLabClient()
    return _client


def start_run(name: str, **kwargs) -> str:
    """Start a new experiment run."""
    return _get_client().start_run(name, **kwargs)


def end_run(status: str = "completed"):
    """End the current run."""
    _get_client().end_run(status)


def log_param(key: str, value: Any):
    """Log a hyperparameter."""
    _get_client().log_param(key, value)


def log_metric(key: str, value: float, step: Optional[int] = None):
    """Log a metric value."""
    _get_client().log_metric(key, value, step)


def log_artifact(filepath: str, artifact_type: str = "model"):
    """Upload an artifact."""
    _get_client().log_artifact(filepath, artifact_type)


@contextmanager
def run(name: str, **kwargs):
    """Context manager for experiment runs.

    Usage:
        with modellab.run("experiment-1"):
            modellab.log_param("lr", 0.001)
            modellab.log_metric("loss", 0.5)
    """
    run_id = start_run(name, **kwargs)
    try:
        yield run_id
        end_run("completed")
    except Exception as e:
        end_run("failed")
        raise
