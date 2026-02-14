#!/usr/bin/env python3
"""
Test script for ModelLab Python SDK
Demonstrates basic experiment tracking functionality
"""

import sys
import os

# Add parent directory to path for local testing
sys.path.insert(0, os.path.dirname(__file__))

import modellab
import random
import time

def simulate_training():
    """Simulate a machine learning training run"""
    print("[rocket.fill] Starting ModelLab SDK test...\n")

    # Configure ModelLab (point to local server)
    modellab.configure(api_url="http://localhost:3001")
    print("✓ Configured ModelLab API\n")

    # Example 1: Using context manager (recommended)
    print("[chart.bar.fill] Example 1: Training with context manager")
    with modellab.run("test-experiment-context-manager"):
        # Log hyperparameters
        modellab.log_param("learning_rate", 0.001)
        modellab.log_param("batch_size", 32)
        modellab.log_param("optimizer", "adam")
        print("  ✓ Logged hyperparameters")

        # Simulate training epochs
        for epoch in range(3):
            loss = 1.0 / (epoch + 1) + random.random() * 0.1
            accuracy = 0.5 + (epoch * 0.15) + random.random() * 0.05

            modellab.log_metric(f"loss_epoch_{epoch}", loss)
            modellab.log_metric(f"accuracy_epoch_{epoch}", accuracy)
            print(f"  ✓ Epoch {epoch}: loss={loss:.4f}, acc={accuracy:.4f}")

            time.sleep(0.5)

        # Create and log a test artifact
        artifact_path = "/tmp/test_model.txt"
        with open(artifact_path, "w") as f:
            f.write("Model weights placeholder\n")
            f.write(f"Final accuracy: {accuracy:.4f}\n")

        modellab.log_artifact(artifact_path)
        print(f"  ✓ Logged artifact: {artifact_path}")

    print("✓ Experiment completed!\n")

    # Example 2: Manual start/stop (for complex workflows)
    print("[chart.bar.fill] Example 2: Training with manual control")
    run_id = modellab.start_run("test-experiment-manual")
    print(f"  ✓ Started run: {run_id}")

    try:
        modellab.log_param("model_type", "resnet50")
        modellab.log_param("dropout", 0.2)
        print("  ✓ Logged parameters")

        modellab.log_metric("final_accuracy", 0.87)
        modellab.log_metric("final_loss", 0.23)
        print("  ✓ Logged metrics")

        modellab.end_run("completed")
        print("  ✓ Run completed successfully")

    except Exception as e:
        modellab.end_run("failed")
        print(f"  ✗ Run failed: {e}")
        raise

    print("\n[checkmark.circle] All tests passed!")
    print("\n📈 View your experiments at: http://localhost:3000")
    print("   Or at: https://modellab.studio (once deployed)\n")

if __name__ == "__main__":
    try:
        simulate_training()
    except KeyboardInterrupt:
        print("\n\n[exclamationmark.triangle]  Test interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n[xmark.circle] Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
