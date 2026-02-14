# ModelLab Python SDK

Track ML experiments with one line of code.

## Installation

**Note:** This package is **not published to PyPI**. Install locally from source:

```bash
cd python-sdk
pip install -e .
```

The package name is `modellab-client` but it must be installed in editable mode from the source directory.

## Quick Start

### Context Manager (Recommended)

```python
import modellab

# Track a complete experiment
with modellab.run("my-experiment"):
    # Log hyperparameters
    modellab.log_param("learning_rate", 0.001)
    modellab.log_param("batch_size", 32)
    modellab.log_param("optimizer", "adam")

    # Training loop
    for epoch in range(100):
        loss = train_one_epoch()
        acc = evaluate()

        # Log metrics
        modellab.log_metric("loss", loss)
        modellab.log_metric("accuracy", acc)

    # Save artifacts
    modellab.log_artifact("model.pt", "model")
    modellab.log_artifact("plot.png", "visualization")
```

### Manual Control

```python
import modellab

# Initialize (optional, uses http://localhost:3000 by default)
modellab.init(api_url="https://modellab.studio")

# Start run
run_id = modellab.start_run(
    name="experiment-1",
    description="Testing new architecture",
    dataset_id="dataset-123",
    seed=42
)

# Log during training
modellab.log_param("lr", 0.001)
modellab.log_metric("loss", 0.5)

# End run
modellab.end_run("completed")  # or "failed"
```

## PyTorch Example

```python
import torch
import torch.nn as nn
import modellab

# Model definition
model = nn.Sequential(
    nn.Linear(784, 128),
    nn.ReLU(),
    nn.Linear(128, 10)
)

optimizer = torch.optim.Adam(model.parameters(), lr=0.001)

# Track experiment
with modellab.run("pytorch-mnist"):
    # Log hyperparameters
    modellab.log_param("lr", 0.001)
    modellab.log_param("hidden_size", 128)
    modellab.log_param("optimizer", "adam")

    # Training loop
    for epoch in range(10):
        for batch_idx, (data, target) in enumerate(train_loader):
            optimizer.zero_grad()
            output = model(data)
            loss = nn.functional.cross_entropy(output, target)
            loss.backward()
            optimizer.step()

            # Log every 100 batches
            if batch_idx % 100 == 0:
                modellab.log_metric("train_loss", loss.item(), step=epoch)

        # Evaluate
        acc = evaluate(model, test_loader)
        modellab.log_metric("test_accuracy", acc, step=epoch)

    # Save model
    torch.save(model.state_dict(), "model.pt")
    modellab.log_artifact("model.pt", "model")
```

## TensorFlow/Keras Example

```python
import tensorflow as tf
import modellab

# Build model
model = tf.keras.Sequential([
    tf.keras.layers.Dense(128, activation='relu'),
    tf.keras.layers.Dense(10, activation='softmax')
])

model.compile(optimizer='adam', loss='sparse_categorical_crossentropy')

# Track experiment
with modellab.run("tensorflow-mnist"):
    modellab.log_param("optimizer", "adam")
    modellab.log_param("hidden_size", 128)

    # Custom callback for logging
    class ModelLabCallback(tf.keras.callbacks.Callback):
        def on_epoch_end(self, epoch, logs=None):
            modellab.log_metric("loss", logs["loss"], step=epoch)
            modellab.log_metric("accuracy", logs["accuracy"], step=epoch)

    # Train
    model.fit(x_train, y_train, epochs=10, callbacks=[ModelLabCallback()])

    # Save
    model.save("model.h5")
    modellab.log_artifact("model.h5", "model")
```

## Configuration

### Environment Variables

```bash
# Set API URL
export MODELLAB_API_URL="https://modellab.studio"

# Set default seed
export MODELLAB_SEED=42
```

### Programmatic Configuration

```python
import modellab

modellab.configure(api_url="https://modellab.studio")
```

## API Reference

### `modellab.run(name, **kwargs)`
Context manager for tracking experiments.

**Parameters:**
- `name` (str): Experiment name
- `description` (str, optional): Experiment description
- `dataset_id` (str, optional): Dataset ID to track
- `seed` (int, optional): Random seed (default: 42)

**Example:**
```python
with modellab.run("my-experiment", seed=123):
    # Your training code
    pass
```

### `modellab.log_param(key, value)`
Log a hyperparameter.

**Parameters:**
- `key` (str): Parameter name
- `value` (any): Parameter value

**Example:**
```python
modellab.log_param("learning_rate", 0.001)
modellab.log_param("batch_size", 32)
```

### `modellab.log_metric(key, value, step=None)`
Log a metric value.

**Parameters:**
- `key` (str): Metric name
- `value` (float): Metric value
- `step` (int, optional): Training step/epoch

**Example:**
```python
for epoch in range(100):
    loss = train()
    modellab.log_metric("loss", loss, step=epoch)
```

### `modellab.log_artifact(filepath, artifact_type="model")`
Log artifact metadata (file path and checksum).

⚠️ **Note:** Currently only logs metadata to the API. Actual file upload is not implemented in the SDK. Files must be uploaded separately via the web UI or direct API calls.

**Parameters:**
- `filepath` (str): Path to file
- `artifact_type` (str): Type of artifact (model, plot, data, etc.)

**Example:**
```python
modellab.log_artifact("model.pt", "model")
modellab.log_artifact("confusion_matrix.png", "plot")
```

## Features

- ✅ **One-line integration** - Start tracking with `with modellab.run()`
- ✅ **Automatic git tracking** - Captures commit hash for reproducibility
- ✅ **Artifact checksums** - SHA-256 verification for all files
- ✅ **Offline mode** - Works without network connection
- ✅ **Framework agnostic** - Works with PyTorch, TensorFlow, JAX, scikit-learn
- ✅ **Minimal overhead** - Fast, non-blocking API calls

## License

MIT License - See LICENSE file for details
