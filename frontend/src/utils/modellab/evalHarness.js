/**
 * EvalHarness - Standardized Evaluation Library
 * Generates metrics, slices, and failure examples for ML runs
 */

const fs = require('fs');
const path = require('path');

// Calculate accuracy
const calculateAccuracy = (predictions, labels) => {
  if (predictions.length !== labels.length) {
    throw new Error('Predictions and labels must have same length');
  }

  let correct = 0;
  predictions.forEach((pred, idx) => {
    if (pred === labels[idx]) correct++;
  });

  return correct / predictions.length;
};

// Calculate precision, recall, F1 for binary/multiclass
const calculateClassificationMetrics = (predictions, labels, classes) => {
  const metrics = {};

  classes.forEach(cls => {
    const tp = predictions.filter((pred, idx) => pred === cls && labels[idx] === cls).length;
    const fp = predictions.filter((pred, idx) => pred === cls && labels[idx] !== cls).length;
    const fn = predictions.filter((pred, idx) => pred !== cls && labels[idx] === cls).length;

    const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
    const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
    const f1 = precision + recall > 0 ? 2 * (precision * recall) / (precision + recall) : 0;

    metrics[cls] = { precision, recall, f1, support: tp + fn };
  });

  return metrics;
};

// Calculate confusion matrix
const calculateConfusionMatrix = (predictions, labels, classes) => {
  const matrix = {};

  classes.forEach(actualClass => {
    matrix[actualClass] = {};
    classes.forEach(predictedClass => {
      matrix[actualClass][predictedClass] = 0;
    });
  });

  predictions.forEach((pred, idx) => {
    const actual = labels[idx];
    if (matrix[actual] && matrix[actual][pred] !== undefined) {
      matrix[actual][pred]++;
    }
  });

  return matrix;
};

// Bootstrap confidence intervals
const bootstrapConfidenceInterval = (data, metric, iterations = 1000, confidence = 0.95) => {
  const results = [];
  const n = data.length;

  for (let i = 0; i < iterations; i++) {
    // Sample with replacement
    const sample = [];
    for (let j = 0; j < n; j++) {
      const idx = Math.floor(Math.random() * n);
      sample.push(data[idx]);
    }

    // Calculate metric on sample
    results.push(metric(sample));
  }

  results.sort((a, b) => a - b);

  const lower = results[Math.floor((1 - confidence) / 2 * iterations)];
  const upper = results[Math.floor((1 + confidence) / 2 * iterations)];
  const mean = results.reduce((a, b) => a + b, 0) / results.length;

  return { mean, lower, upper, confidence };
};

// Generate slices based on data attributes
const generateSlices = (data, predictions, labels, sliceAttributes) => {
  const slices = {};

  sliceAttributes.forEach(attr => {
    const uniqueValues = [...new Set(data.map(item => item[attr]))];

    uniqueValues.forEach(value => {
      const indices = data
        .map((item, idx) => item[attr] === value ? idx : -1)
        .filter(idx => idx !== -1);

      if (indices.length === 0) return;

      const slicePreds = indices.map(idx => predictions[idx]);
      const sliceLabels = indices.map(idx => labels[idx]);

      const accuracy = calculateAccuracy(slicePreds, sliceLabels);

      const sliceKey = `${attr}=${value}`;
      slices[sliceKey] = {
        attribute: attr,
        value: value,
        count: indices.length,
        accuracy,
        percentage: (indices.length / data.length) * 100
      };
    });
  });

  return slices;
};

// Find failure examples
const findFailureExamples = (data, predictions, labels, limit = 50) => {
  const failures = [];

  predictions.forEach((pred, idx) => {
    if (pred !== labels[idx]) {
      failures.push({
        index: idx,
        predicted: pred,
        actual: labels[idx],
        data: data[idx],
        confidence: data[idx].confidence || null
      });
    }
  });

  // Sort by confidence if available (least confident first)
  failures.sort((a, b) => {
    if (a.confidence === null || b.confidence === null) return 0;
    return a.confidence - b.confidence;
  });

  return failures.slice(0, limit);
};

// Calculate regression metrics
const calculateRegressionMetrics = (predictions, targets) => {
  if (predictions.length !== targets.length) {
    throw new Error('Predictions and targets must have same length');
  }

  const n = predictions.length;

  // Mean Absolute Error
  const mae = predictions.reduce((sum, pred, idx) =>
    sum + Math.abs(pred - targets[idx]), 0) / n;

  // Mean Squared Error
  const mse = predictions.reduce((sum, pred, idx) =>
    sum + Math.pow(pred - targets[idx], 2), 0) / n;

  // Root Mean Squared Error
  const rmse = Math.sqrt(mse);

  // R-squared
  const meanTarget = targets.reduce((a, b) => a + b, 0) / n;
  const ssTotal = targets.reduce((sum, target) =>
    sum + Math.pow(target - meanTarget, 2), 0);
  const ssRes = predictions.reduce((sum, pred, idx) =>
    sum + Math.pow(targets[idx] - pred, 2), 0);
  const r2 = 1 - (ssRes / ssTotal);

  return { mae, mse, rmse, r2 };
};

// Generate complete evaluation report
const generateEvaluationReport = (runId, data, predictions, labels, config = {}) => {
  const {
    taskType = 'classification', // or 'regression'
    classes = null,
    sliceAttributes = [],
    includeFailureExamples = true,
    bootstrapIterations = 1000
  } = config;

  const timestamp = new Date().toISOString();
  const report = {
    runId,
    timestamp,
    taskType,
    sampleCount: data.length
  };

  // Generate metrics based on task type
  if (taskType === 'classification') {
    const accuracy = calculateAccuracy(predictions, labels);
    const inferredClasses = classes || [...new Set([...predictions, ...labels])];
    const classMetrics = calculateClassificationMetrics(predictions, labels, inferredClasses);
    const confusionMatrix = calculateConfusionMatrix(predictions, labels, inferredClasses);

    // Calculate macro averages
    const macroMetrics = {
      precision: Object.values(classMetrics).reduce((sum, m) => sum + m.precision, 0) / inferredClasses.length,
      recall: Object.values(classMetrics).reduce((sum, m) => sum + m.recall, 0) / inferredClasses.length,
      f1: Object.values(classMetrics).reduce((sum, m) => sum + m.f1, 0) / inferredClasses.length
    };

    report.metrics = {
      accuracy,
      classMetrics,
      macroMetrics,
      confusionMatrix
    };

    // Bootstrap confidence intervals for accuracy
    report.confidenceIntervals = {
      accuracy: bootstrapConfidenceInterval(
        predictions.map((pred, idx) => pred === labels[idx] ? 1 : 0),
        (sample) => sample.reduce((a, b) => a + b, 0) / sample.length,
        bootstrapIterations
      )
    };

  } else if (taskType === 'regression') {
    const metrics = calculateRegressionMetrics(predictions, labels);
    report.metrics = metrics;

    // Bootstrap confidence intervals for MAE
    report.confidenceIntervals = {
      mae: bootstrapConfidenceInterval(
        predictions.map((pred, idx) => Math.abs(pred - labels[idx])),
        (sample) => sample.reduce((a, b) => a + b, 0) / sample.length,
        bootstrapIterations
      )
    };
  }

  // Generate slices
  if (sliceAttributes.length > 0) {
    report.slices = generateSlices(data, predictions, labels, sliceAttributes);
  }

  // Generate failure examples
  if (includeFailureExamples && taskType === 'classification') {
    report.failureExamples = findFailureExamples(data, predictions, labels);
  }

  return report;
};

// Save evaluation report to files
const saveEvaluationReport = (report, outputDir) => {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Save metrics.json
  const metricsPath = path.join(outputDir, 'metrics.json');
  fs.writeFileSync(metricsPath, JSON.stringify({
    timestamp: report.timestamp,
    taskType: report.taskType,
    sampleCount: report.sampleCount,
    metrics: report.metrics,
    confidenceIntervals: report.confidenceIntervals
  }, null, 2));

  // Save slices.json
  if (report.slices) {
    const slicesPath = path.join(outputDir, 'slices.json');
    fs.writeFileSync(slicesPath, JSON.stringify({
      timestamp: report.timestamp,
      slices: report.slices
    }, null, 2));
  }

  // Save failure_examples.json
  if (report.failureExamples) {
    const failuresPath = path.join(outputDir, 'failure_examples.json');
    fs.writeFileSync(failuresPath, JSON.stringify({
      timestamp: report.timestamp,
      count: report.failureExamples.length,
      examples: report.failureExamples
    }, null, 2));
  }

  return {
    metricsPath,
    slicesPath: report.slices ? path.join(outputDir, 'slices.json') : null,
    failuresPath: report.failureExamples ? path.join(outputDir, 'failure_examples.json') : null
  };
};

module.exports = {
  calculateAccuracy,
  calculateClassificationMetrics,
  calculateConfusionMatrix,
  calculateRegressionMetrics,
  bootstrapConfidenceInterval,
  generateSlices,
  findFailureExamples,
  generateEvaluationReport,
  saveEvaluationReport
};
