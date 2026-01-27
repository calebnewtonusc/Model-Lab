"""
Setup script for ModelLab EvalHarness.

Install with:
    pip install -e .

Or for development:
    pip install -e ".[dev]"
"""

from setuptools import setup, find_packages
import os

# Read long description from README if it exists
readme_path = os.path.join(os.path.dirname(__file__), 'README.md')
long_description = ""
if os.path.exists(readme_path):
    with open(readme_path, 'r', encoding='utf-8') as f:
        long_description = f.read()

setup(
    name="modellab-evalharness",
    version="1.0.0",
    author="Caleb Newton",
    author_email="calebnewton@usc.edu",
    description="Comprehensive evaluation framework for ML models with standardized outputs",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/calebnewtonusc/ModelLab",
    packages=['evalharness', 'evalharness.core', 'evalharness.metrics', 'evalharness.plots',
              'evalharness.slicing', 'evalharness.failures', 'evalharness.stress',
              'evalharness.ci', 'evalharness.evaluators', 'evalharness.bench'],
    package_dir={'evalharness': '.'},
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "Intended Audience :: Science/Research",
        "Topic :: Scientific/Engineering :: Artificial Intelligence",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
    ],
    python_requires=">=3.8",
    install_requires=[
        "numpy>=1.20.0",
        "pandas>=1.3.0",
        "scikit-learn>=1.0.0",
        "matplotlib>=3.4.0",
        "seaborn>=0.11.0",
        "pydantic>=1.9.0",
    ],
    extras_require={
        "dev": [
            "pytest>=7.0.0",
            "pytest-cov>=3.0.0",
            "black>=22.0.0",
            "flake8>=4.0.0",
            "mypy>=0.950",
        ],
    },
    entry_points={
        "console_scripts": [
            "evalharness=evalharness.__main__:main",
        ],
    },
    include_package_data=True,
    zip_safe=False,
)
