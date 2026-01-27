"""
Tabular Regression Template
Baseline-first workflow: MeanPredictor → LinearRegression → XGBoost
"""

import sys
import os
import argparse
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.dummy import DummyRegressor
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

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

    # Handle categorical features
    for col in X.columns:
        if X[col].dtype == 'object':
            X[col] = pd.Categorical(X[col]).codes

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=seed
    )

    return X_train, X_test, y_train, y_test


def evaluate_regression(model, X_train, X_test, y_train, y_test):
    """Evaluate regression model."""
    train_pred = model.predict(X_train)
    test_pred = model.predict(X_test)

    train_mae = mean_absolute_error(y_train, train_pred)
    train_rmse = np.sqrt(mean_squared_error(y_train, train_pred))
    train_r2 = r2_score(y_train, train_pred)

    test_mae = mean_absolute_error(y_test, test_pred)
    test_rmse = np.sqrt(mean_squared_error(y_test, test_pred))
    test_r2 = r2_score(y_test, test_pred)

    return {
        'train_mae': train_mae,
        'train_rmse': train_rmse,
        'train_r2': train_r2,
        'test_mae': test_mae,
        'test_rmse': test_rmse,
        'test_r2': test_r2
    }


def run_baseline_mean(X_train, X_test, y_train, y_test, seed=42):
    """Run mean predictor baseline."""
    print("\n" + "="*60)
    print("BASELINE 1: Mean Predictor")
    print("="*60)

    model = DummyRegressor(strategy='mean')
    model.fit(X_train, y_train)

    metrics = evaluate_regression(model, X_train, X_test, y_train, y_test)

    print(f"Train MAE:  {metrics['train_mae']:.4f}")
    print(f"Train RMSE: {metrics['train_rmse']:.4f}")
    print(f"Train R²:   {metrics['train_r2']:.4f}")
    print(f"Test MAE:   {metrics['test_mae']:.4f}")
    print(f"Test RMSE:  {metrics['test_rmse']:.4f}")
    print(f"Test R²:    {metrics['test_r2']:.4f}")

    return {
        'model_name': 'MeanPredictor',
        **metrics,
        'model': model
    }


def run_baseline_linear(X_train, X_test, y_train, y_test, seed=42):
    """Run linear regression baseline."""
    print("\n" + "="*60)
    print("BASELINE 2: LinearRegression")
    print("="*60)

    model = LinearRegression()
    model.fit(X_train, y_train)

    metrics = evaluate_regression(model, X_train, X_test, y_train, y_test)

    print(f"Train MAE:  {metrics['train_mae']:.4f}")
    print(f"Train RMSE: {metrics['train_rmse']:.4f}")
    print(f"Train R²:   {metrics['train_r2']:.4f}")
    print(f"Test MAE:   {metrics['test_mae']:.4f}")
    print(f"Test RMSE:  {metrics['test_rmse']:.4f}")
    print(f"Test R²:    {metrics['test_r2']:.4f}")

    return {
        'model_name': 'LinearRegression',
        **metrics,
        'model': model
    }


def run_improved_model(X_train, X_test, y_train, y_test, seed=42):
    """Run improved model (XGBoost or RandomForest)."""
    print("\n" + "="*60)
    print("IMPROVED MODEL: XGBoost" if HAS_XGBOOST else "IMPROVED MODEL: RandomForest")
    print("="*60)

    if HAS_XGBOOST:
        model = xgb.XGBRegressor(
            n_estimators=100,
            max_depth=6,
            learning_rate=0.1,
            random_state=seed
        )
    else:
        model = RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            random_state=seed
        )

    model.fit(X_train, y_train)

    metrics = evaluate_regression(model, X_train, X_test, y_train, y_test)

    print(f"Train MAE:  {metrics['train_mae']:.4f}")
    print(f"Train RMSE: {metrics['train_rmse']:.4f}")
    print(f"Train R²:   {metrics['train_r2']:.4f}")
    print(f"Test MAE:   {metrics['test_mae']:.4f}")
    print(f"Test RMSE:  {metrics['test_rmse']:.4f}")
    print(f"Test R²:    {metrics['test_r2']:.4f}")

    return {
        'model_name': 'XGBoost' if HAS_XGBOOST else 'RandomForest',
        **metrics,
        'model': model
    }


def run_full_pipeline(data_path, target_column, project_id=None, seed=42):
    """Run complete baseline-first pipeline."""
    print("\n" + "="*80)
    print("MODELLAB BASELINE-FIRST WORKFLOW")
    print("Tabular Regression")
    print("="*80)

    # Configure ModelLab if available
    if HAS_MODELLAB and project_id:
        configure(api_url='http://localhost:3001/api/modellab')

    # Load and prepare data
    print(f"\nLoading data from: {data_path}")
    df = load_data(data_path)
    print(f"Dataset shape: {df.shape}")
    print(f"Target column: {target_column}")
    print(f"Target range: [{df[target_column].min():.2f}, {df[target_column].max():.2f}]")

    X_train, X_test, y_train, y_test = prepare_data(df, target_column, seed=seed)
    print(f"\nTrain set: {X_train.shape[0]} samples")
    print(f"Test set:  {X_test.shape[0]} samples")

    results = []

    # Run all three models
    result_mean = run_baseline_mean(X_train, X_test, y_train, y_test, seed)
    results.append(result_mean)

    result_linear = run_baseline_linear(X_train, X_test, y_train, y_test, seed)
    results.append(result_linear)

    result_improved = run_improved_model(X_train, X_test, y_train, y_test, seed)
    results.append(result_improved)

    # Print comparison
    print("\n" + "="*80)
    print("RESULTS COMPARISON")
    print("="*80)
    print(f"{'Model':<25} {'Test MAE':<15} {'Test RMSE':<15} {'Test R²':<15}")
    print("-"*80)
    for result in results:
        print(f"{result['model_name']:<25} {result['test_mae']:<15.4f} {result['test_rmse']:<15.4f} {result['test_r2']:<15.4f}")

    # Find best model (lowest test MAE)
    best_result = min(results, key=lambda x: x['test_mae'])
    print(f"\nBest Model: {best_result['model_name']} (Test MAE: {best_result['test_mae']:.4f})")

    # Log to ModelLab if available
    if HAS_MODELLAB and project_id:
        for result in results:
            with start_run(
                name=f"{result['model_name']}_regression",
                project_id=project_id,
                seed=seed
            ) as run:
                log_params({
                    'model_type': result['model_name'],
                    'seed': seed,
                    'dataset': data_path
                })
                log_metrics({
                    'train_mae': result['train_mae'],
                    'train_rmse': result['train_rmse'],
                    'train_r2': result['train_r2'],
                    'test_mae': result['test_mae'],
                    'test_rmse': result['test_rmse'],
                    'test_r2': result['test_r2']
                })
                print(f"\n✓ Logged {result['model_name']} to ModelLab (run_id: {run.id})")

    return results


def main():
    parser = argparse.ArgumentParser(description='Run baseline-first regression workflow')
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
