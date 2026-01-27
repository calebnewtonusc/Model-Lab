/**
 * Latency Profiling for Model Inference
 * Measures p50, p95, p99 latencies with warmup runs
 */

// Measure single inference latency
const measureLatency = async (inferenceFunction, input) => {
  const start = performance.now();
  await inferenceFunction(input);
  const end = performance.now();
  return end - start;
};

// Calculate percentile from sorted array
const calculatePercentile = (sortedArray, percentile) => {
  const index = Math.ceil((percentile / 100) * sortedArray.length) - 1;
  return sortedArray[Math.max(0, index)];
};

// Profile model latency
const profileLatency = async (inferenceFunction, testInputs, config = {}) => {
  const {
    warmupRuns = 10,
    measurementRuns = 100,
    concurrentRequests = 1
  } = config;

  console.log(`Starting latency profiling with ${warmupRuns} warmup runs and ${measurementRuns} measurement runs...`);

  // Warmup phase
  console.log('Warming up...');
  for (let i = 0; i < warmupRuns; i++) {
    const input = testInputs[i % testInputs.length];
    await inferenceFunction(input);
  }

  // Measurement phase
  console.log('Measuring latencies...');
  const latencies = [];

  for (let i = 0; i < measurementRuns; i++) {
    const input = testInputs[i % testInputs.length];
    const latency = await measureLatency(inferenceFunction, input);
    latencies.push(latency);
  }

  // Sort for percentile calculation
  const sortedLatencies = [...latencies].sort((a, b) => a - b);

  // Calculate statistics
  const p50 = calculatePercentile(sortedLatencies, 50);
  const p95 = calculatePercentile(sortedLatencies, 95);
  const p99 = calculatePercentile(sortedLatencies, 99);
  const mean = latencies.reduce((a, b) => a + b, 0) / latencies.length;
  const min = Math.min(...latencies);
  const max = Math.max(...latencies);

  // Calculate standard deviation
  const variance = latencies.reduce((sum, latency) =>
    sum + Math.pow(latency - mean, 2), 0) / latencies.length;
  const stdDev = Math.sqrt(variance);

  const result = {
    timestamp: new Date().toISOString(),
    config: {
      warmupRuns,
      measurementRuns,
      concurrentRequests,
      inputCount: testInputs.length
    },
    latencies: {
      p50,
      p95,
      p99,
      mean,
      min,
      max,
      stdDev
    },
    rawLatencies: sortedLatencies,
    throughput: {
      requestsPerSecond: 1000 / mean,
      averageLatencyMs: mean
    }
  };

  console.log('Latency profiling complete!');
  console.log(`P50: ${p50.toFixed(2)}ms`);
  console.log(`P95: ${p95.toFixed(2)}ms`);
  console.log(`P99: ${p99.toFixed(2)}ms`);
  console.log(`Mean: ${mean.toFixed(2)}ms`);

  return result;
};

// Profile with concurrent requests
const profileConcurrentLatency = async (inferenceFunction, testInputs, config = {}) => {
  const {
    warmupRuns = 10,
    measurementRuns = 100,
    concurrency = 10
  } = config;

  console.log(`Starting concurrent latency profiling with concurrency=${concurrency}...`);

  // Warmup phase
  console.log('Warming up...');
  for (let i = 0; i < warmupRuns; i++) {
    const input = testInputs[i % testInputs.length];
    await inferenceFunction(input);
  }

  // Measurement phase with concurrent requests
  console.log('Measuring concurrent latencies...');
  const latencies = [];

  const batches = Math.ceil(measurementRuns / concurrency);
  for (let batch = 0; batch < batches; batch++) {
    const promises = [];

    for (let i = 0; i < concurrency && (batch * concurrency + i) < measurementRuns; i++) {
      const inputIdx = (batch * concurrency + i) % testInputs.length;
      const input = testInputs[inputIdx];

      const promise = measureLatency(inferenceFunction, input);
      promises.push(promise);
    }

    const batchLatencies = await Promise.all(promises);
    latencies.push(...batchLatencies);
  }

  // Calculate statistics
  const sortedLatencies = [...latencies].sort((a, b) => a - b);
  const p50 = calculatePercentile(sortedLatencies, 50);
  const p95 = calculatePercentile(sortedLatencies, 95);
  const p99 = calculatePercentile(sortedLatencies, 99);
  const mean = latencies.reduce((a, b) => a + b, 0) / latencies.length;
  const min = Math.min(...latencies);
  const max = Math.max(...latencies);

  const result = {
    timestamp: new Date().toISOString(),
    config: {
      warmupRuns,
      measurementRuns,
      concurrency,
      inputCount: testInputs.length
    },
    latencies: {
      p50,
      p95,
      p99,
      mean,
      min,
      max
    },
    rawLatencies: sortedLatencies,
    throughput: {
      requestsPerSecond: (1000 / mean) * concurrency,
      averageLatencyMs: mean
    }
  };

  console.log('Concurrent latency profiling complete!');
  console.log(`P50: ${p50.toFixed(2)}ms`);
  console.log(`P95: ${p95.toFixed(2)}ms`);
  console.log(`P99: ${p99.toFixed(2)}ms`);

  return result;
};

// Generate latency visualization data
const generateLatencyVisualization = (latencies) => {
  // Create histogram buckets
  const min = Math.min(...latencies);
  const max = Math.max(...latencies);
  const bucketCount = 20;
  const bucketSize = (max - min) / bucketCount;

  const histogram = [];
  for (let i = 0; i < bucketCount; i++) {
    const bucketMin = min + (i * bucketSize);
    const bucketMax = bucketMin + bucketSize;
    const count = latencies.filter(l => l >= bucketMin && l < bucketMax).length;

    histogram.push({
      range: `${bucketMin.toFixed(1)}-${bucketMax.toFixed(1)}`,
      rangeMin: bucketMin,
      rangeMax: bucketMax,
      count,
      percentage: (count / latencies.length) * 100
    });
  }

  // Create percentile curve data
  const percentileCurve = [];
  for (let p = 0; p <= 100; p += 5) {
    const sortedLatencies = [...latencies].sort((a, b) => a - b);
    percentileCurve.push({
      percentile: p,
      latency: calculatePercentile(sortedLatencies, p)
    });
  }

  return {
    histogram,
    percentileCurve
  };
};

module.exports = {
  measureLatency,
  calculatePercentile,
  profileLatency,
  profileConcurrentLatency,
  generateLatencyVisualization
};
