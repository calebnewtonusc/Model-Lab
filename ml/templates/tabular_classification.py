"""
Tabular Classification Template
Baseline-first workflow: DummyClassifier → LogisticRegression → XGBoost
"""

import sys
import os
import argparse
import json
from datetime import datetime
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.dummy import DummyClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
try:
    import xgboost as xgb
    HAS_XGBOOST = True
except ImportError:
    HAS_XGBOOST = False

# Add parent directories to path for imports
sys.path.append(os.path.join(os.path.dirname(__file__), '../..'))
sys.path.append(os.path.join(os.path.dirname(__file__), '../../python-sdk'))

try:
    from modellab import configure, start_run, log_metrics, log_params
    HAS_MODELLAB = True
except ImportError:
    HAS_MODELLAB = False
    print("Warning: ModelLab SDK not found. Running without tracking.")


def load_data(data_path):
    """Load dataset from file."""
    if data_path.endswith('.csv'):
        df = pd.read_csv(data_path)
    elif data_path.endswith('.json'):
        df = pd.read_json(data_path)
    else:
        raise ValueError(f"Unsupported file format: {data_path}")

    return df


def prepare_data(df, target_column, test_size=0.2, seed=42):
    """Split data into train/test sets."""
    X = df.drop(columns=[target_column])
    y = df[target_column]

    # Handle categorical features (simple label encoding)
    for col in X.columns:
        if X[col].dtype == 'object':
            X[col] = pd.Categorical(X[col]).codes

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=seed, stratify=y
    )

    return X_train, X_test, y_train, y_test


def run_baseline_dummy(X_train, X_test, y_train, y_test, seed=42):
    """Run dummy classifier baseline (most frequent)."""
    print("\n" + "="*60)
    print("BASELINE 1: DummyClassifier (Most Frequent)")
    print("="*60)

    model = DummyClassifier(strategy='most_frequent', random_state=seed)
    model.fit(X_train, y_train)

    train_acc = model.score(X_train, y_train)
    test_acc = model.score(X_test, y_test)

    print(f"Train Accuracy: {train_acc:.4f}")
    print(f"Test Accuracy:  {test_acc:.4f}")

    return {
        'model_name': 'DummyClassifier',
        'train_accuracy': train_acc,
        'test_accuracy': test_acc,
        'model': model
    }


def run_baseline_logistic(X_train, X_test, y_train, y_test, seed=42):
    """Run logistic regression baseline."""
    print("\n" + "="*60)
    print("BASELINE 2: LogisticRegression")
    print("="*60)

    model = LogisticRegression(max_iter=1000, random_state=seed)
    model.fit(X_train, y_train)

    train_acc = model.score(X_train, y_train)
    test_acc = model.score(X_test, y_test)

    print(f"Train Accuracy: {train_acc:.4f}")
    print(f"Test Accuracy:  {test_acc:.4f}")

    return {
        'model_name': 'LogisticRegression',
        'train_accuracy': train_acc,
        'test_accuracy': test_acc,
        'model': model
    }


def run_improved_model(X_train, X_test, y_train, y_test, seed=42):
    """Run improved model (XGBoost or RandomForest)."""
    print("\n" + "="*60)
    print("IMPROVED MODEL: XGBoost" if HAS_XGBOOST else "IMPROVED MODEL: RandomForest")
    print("="*60)

    if HAS_XGBOOST:
        model = xgb.XGBClassifier(
            n_estimators=100,
            max_depth=6,
            learning_rate=0.1,
            random_state=seed,
            use_label_encoder=False,
            eval_metric='logloss'
        )
    else:
        model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            random_state=seed
        )

    model.fit(X_train, y_train)

    train_acc = model.score(X_train, y_train)
    test_acc = model.score(X_test, y_test)

    print(f"Train Accuracy: {train_acc:.4f}")
    print(f"Test Accuracy:  {test_acc:.4f}")

    return {
        'model_name': 'XGBoost' if HAS_XGBOOST else 'RandomForest',
        'train_accuracy': train_acc,
        'test_accuracy': test_acc,
        'model': model
    }


def run_full_pipeline(data_path, target_column, project_id=None, seed=42):
    """Run complete baseline-first pipeline."""
    print("\n" + "="*80)
    print("MODELLAB BASELINE-FIRST WORKFLOW")
    print("Tabular Classification")
    print("="*80)

    # Configure ModelLab if available
    if HAS_MODELLAB and project_id:
        configure(api_url='http://localhost:3001/api/modellab')

    # Load and prepare data
    print(f"\nLoading data from: {data_path}")
    df = load_data(data_path)
    print(f"Dataset shape: {df.shape}")
    print(f"Target column: {target_column}")
    print(f"Classes: {df[target_column].unique()}")

    X_train, X_test, y_train, y_test = prepare_data(df, target_column, seed=seed)
    print(f"\nTrain set: {X_train.shape[0]} samples")
    print(f"Test set:  {X_test.shape[0]} samples")

    results = []

    # Run all three models
    result_dummy = run_baseline_dummy(X_train, X_test, y_train, y_test, seed)
    results.append(result_dummy)

    result_logistic = run_baseline_logistic(X_train, X_test, y_train, y_test, seed)
    results.append(result_logistic)

    result_improved = run_improved_model(X_train, X_test, y_train, y_test, seed)
    results.append(result_improved)

    # Print comparison
    print("\n" + "="*80)
    print("RESULTS COMPARISON")
    print("="*80)
    print(f"{'Model':<25} {'Train Accuracy':<20} {'Test Accuracy':<20}")
    print("-"*80)
    for result in results:
        print(f"{result['model_name']:<25} {result['train_accuracy']:<20.4f} {result['test_accuracy']:<20.4f}")

    # Find best model
    best_result = max(results, key=lambda x: x['test_accuracy'])
    print(f"\nBest Model: {best_result['model_name']} (Test Accuracy: {best_result['test_accuracy']:.4f})")

    # Log to ModelLab if available
    if HAS_MODELLAB and project_id:
        for result in results:
            with start_run(
                name=f"{result['model_name']}_classification",
                project_id=project_id,
                seed=seed
            ) as run:
                log_params({
                    'model_type': result['model_name'],
                    'seed': seed,
                    'dataset': data_path
                })
                log_metrics({
                    'train_accuracy': result['train_accuracy'],
                    'test_accuracy': result['test_accuracy']
                })
                print(f"\n✓ Logged {result['model_name']} to ModelLab (run_id: {run.id})")

    return results


def main():
    parser = argparse.ArgumentParser(description='Run baseline-first classification workflow')
    parser.add_argument('data_path', help='Path to dataset file (CSV or JSON)')
    parser.add_argument('--target', '-t', required=True, help='Target column name')
    parser.add_argument('--project-id', '-p', help='ModelLab project ID')
    parser.add_argument('--seed', '-s', type=int, default=42, help='Random seed')

    args = parser.parse_args()

    if not os.path.exists(args.data_path):
        print(f"Error: File not found: {args.data_path}")
        sys.exit(1)

    run_full_pipeline(args.data_path, args.target, args.project_id, args.seed)


if __name__ == '__main__':
    main()
