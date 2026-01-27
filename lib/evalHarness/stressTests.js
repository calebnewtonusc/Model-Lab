/**
 * Stress Tests for Model Robustness
 * Tests how model performance degrades under data corruption
 */

/**
 * Corrupt data by adding missing values
 * @param {Array} data - Original data array
 * @param {number} fraction - Fraction of values to corrupt (0-1)
 * @returns {Array} Corrupted data
 */
const corruptMissingValues = (data, fraction = 0.1) => {
  const corrupted = JSON.parse(JSON.stringify(data)); // Deep clone
  const totalFields = data.length * Object.keys(data[0] || {}).length;
  const numToCorrupt = Math.floor(totalFields * fraction);

  for (let i = 0; i < numToCorrupt; i++) {
    const rowIdx = Math.floor(Math.random() * data.length);
    const keys = Object.keys(corrupted[rowIdx]);
    if (keys.length > 0) {
      const fieldIdx = Math.floor(Math.random() * keys.length);
      corrupted[rowIdx][keys[fieldIdx]] = null;
    }
  }

  return corrupted;
};

/**
 * Inject label noise by randomly flipping labels
 * @param {Array} labels - Original labels
 * @param {number} fraction - Fraction of labels to flip (0-1)
 * @returns {Array} Labels with noise
 */
const injectLabelNoise = (labels, fraction = 0.05) => {
  const corrupted = [...labels];
  const uniqueLabels = [...new Set(labels)];

  if (uniqueLabels.length < 2) {
    return corrupted; // Can't flip with only one class
  }

  const numToFlip = Math.floor(labels.length * fraction);

  for (let i = 0; i < numToFlip; i++) {
    const idx = Math.floor(Math.random() * labels.length);
    const currentLabel = corrupted[idx];
    const otherLabels = uniqueLabels.filter(l => l !== currentLabel);
    corrupted[idx] = otherLabels[Math.floor(Math.random() * otherLabels.length)];
  }

  return corrupted;
};

/**
 * Corrupt a specific feature by shuffling or adding noise
 * @param {Array} data - Original data
 * @param {string} columnName - Name of column to corrupt
 * @param {string} corruptionType - 'shuffle' or 'noise'
 * @returns {Array} Data with corrupted feature
 */
const corruptFeature = (data, columnName, corruptionType = 'shuffle') => {
  const corrupted = JSON.parse(JSON.stringify(data));

  if (corruptionType === 'shuffle') {
    // Extract column values
    const values = data.map(row => row[columnName]);

    // Fisher-Yates shuffle
    for (let i = values.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [values[i], values[j]] = [values[j], values[i]];
    }

    // Replace with shuffled values
    corrupted.forEach((row, idx) => {
      row[columnName] = values[idx];
    });

  } else if (corruptionType === 'noise') {
    // Add Gaussian noise (for numeric features)
    const values = data.map(row => row[columnName]).filter(v => typeof v === 'number');
    if (values.length === 0) return corrupted;

    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    const std = Math.sqrt(variance);

    corrupted.forEach(row => {
      if (typeof row[columnName] === 'number') {
        const noise = (Math.random() - 0.5) * 2 * std * 0.1; // 10% of std
        row[columnName] += noise;
      }
    });
  }

  return corrupted;
};

/**
 * Run stress test suite and measure performance degradation
 * @param {Function} modelFn - Function that takes data and returns predictions
 * @param {Function} metricFn - Function that takes (predictions, labels) and returns metric
 * @param {Array} data - Original data
 * @param {Array} labels - True labels
 * @param {Object} config - Configuration options
 * @returns {Object} Stress test results
 */
const runStressTestSuite = (modelFn, metricFn, data, labels, config = {}) => {
  const {
    testMissingValues = true,
    testLabelNoise = false, // Requires retraining, usually skip
    testFeatureCorruption = true,
    missingValuesFractions = [0.1, 0.2, 0.3],
    featuresToTest = null // null = test first 3 features
  } = config;

  const results = [];

  // Baseline performance
  const baselinePredictions = modelFn(data);
  const baselinePerformance = metricFn(baselinePredictions, labels);

  // Test 1: Missing values
  if (testMissingValues) {
    missingValuesFractions.forEach(fraction => {
      const corruptedData = corruptMissingValues(data, fraction);
      const predictions = modelFn(corruptedData);
      const performance = metricFn(predictions, labels);
      const degradation = ((baselinePerformance - performance) / baselinePerformance) * 100;

      results.push({
        testName: `missing_values_${Math.round(fraction * 100)}pct`,
        cleanPerformance: baselinePerformance,
        corruptedPerformance: performance,
        degradationPct: degradation,
        config: { fraction }
      });
    });
  }

  // Test 2: Feature corruption
  if (testFeatureCorruption) {
    const features = featuresToTest || Object.keys(data[0] || {}).slice(0, 3);

    features.forEach(feature => {
      if (!data[0] || data[0][feature] === undefined) return;

      // Shuffle test
      const shuffledData = corruptFeature(data, feature, 'shuffle');
      const shufflePredictions = modelFn(shuffledData);
      const shufflePerformance = metricFn(shufflePredictions, labels);
      const shuffleDegradation = ((baselinePerformance - shufflePerformance) / baselinePerformance) * 100;

      results.push({
        testName: `feature_${feature}_shuffle`,
        cleanPerformance: baselinePerformance,
        corruptedPerformance: shufflePerformance,
        degradationPct: shuffleDegradation,
        config: { feature, corruption: 'shuffle' }
      });

      // Noise test (if numeric)
      if (typeof data[0][feature] === 'number') {
        const noisyData = corruptFeature(data, feature, 'noise');
        const noisePredictions = modelFn(noisyData);
        const noisePerformance = metricFn(noisePredictions, labels);
        const noiseDegradation = ((baselinePerformance - noisePerformance) / baselinePerformance) * 100;

        results.push({
          testName: `feature_${feature}_noise`,
          cleanPerformance: baselinePerformance,
          corruptedPerformance: noisePerformance,
          degradationPct: noiseDegradation,
          config: { feature, corruption: 'noise' }
        });
      }
    });
  }

  // Summary statistics
  const summary = {
    nTests: results.length,
    maxDegradation: Math.max(...results.map(r => r.degradationPct)),
    avgDegradation: results.reduce((sum, r) => sum + r.degradationPct, 0) / results.length,
    baselinePerformance
  };

  return {
    results,
    summary
  };
};

module.exports = {
  corruptMissingValues,
  injectLabelNoise,
  corruptFeature,
  runStressTestSuite
};
