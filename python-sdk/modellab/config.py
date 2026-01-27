"""
ModelLab Configuration
"""

import os
from typing import Dict

_config: Dict[str, str] = {
    "api_url": os.environ.get("MODELLAB_API_URL", "http://localhost:3000"),
}


def configure(api_url: str):
    """Configure ModelLab settings."""
    global _config
    _config["api_url"] = api_url


def get_config() -> Dict[str, str]:
    """Get current configuration."""
    return _config.copy()
