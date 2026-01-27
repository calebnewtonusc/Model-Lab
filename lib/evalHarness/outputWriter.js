/**
 * Standardized Output Writer for EvalHarness
 * Writes evaluation results in the standard ModelLab format
 */

const fs = require('fs');
const path = require('path');

/**
 * Write complete evaluation report to standard directory structure
 * @param {string} runId - Run ID
 * @param {Object} report - Evaluation report object
 * @param {string} baseDir - Base artifacts directory
 */
const writeEvaluationReport = (runId, report, baseDir) => {
  // Create directory structure: artifacts/<runId>/eval/
  const evalDir = path.join(baseDir, runId, 'eval');
  const plotsDir = path.join(evalDir, 'plots');

  if (!fs.existsSync(plotsDir)) {
    fs.mkdirSync(plotsDir, { recursive: true });
  }

  // Write metrics.json
  writeMetricsJson(report.metrics, evalDir);

  // Write confidence_intervals.json
  if (report.confidenceIntervals) {
    writeConfidenceIntervalsJson(report.confidenceIntervals, evalDir);
  }

  // Write slices.json
  if (report.slices) {
    writeSlicesJson(report.slices, evalDir);
  }

  // Write failure_examples.json
  if (report.failureExamples) {
    writeFailureExamplesJson(report.failureExamples, evalDir);
  }

  // Write takeaway.txt (exactly 5 sentences)
  writeTakeaway(report, evalDir);

  // Write eval_summary.json (complete report)
  writeEvalSummaryJson(report, evalDir);

  return evalDir;
};

/**
 * Write metrics.json
 */
const writeMetricsJson = (metrics, outputDir) => {
  const filepath = path.join(outputDir, 'metrics.json');
  fs.writeFileSync(filepath, JSON.stringify(metrics, null, 2));
  return filepath;
};

/**
 * Write confidence_intervals.json
 */
const writeConfidenceIntervalsJson = (cis, outputDir) => {
  const filepath = path.join(outputDir, 'confidence_intervals.json');
  fs.writeFileSync(filepath, JSON.stringify(cis, null, 2));
  return filepath;
};

/**
 * Write slices.json
 */
const writeSlicesJson = (slices, outputDir) => {
  const filepath = path.join(outputDir, 'slices.json');
  fs.writeFileSync(filepath, JSON.stringify(slices, null, 2));
  return filepath;
};

/**
 * Write failure_examples.json
 */
const writeFailureExamplesJson = (failures, outputDir) => {
  const filepath = path.join(outputDir, 'failure_examples.json');
  fs.writeFileSync(filepath, JSON.stringify({
    count: failures.length,
    examples: failures
  }, null, 2));
  return filepath;
};

/**
 * Generate and write takeaway.txt (exactly 5 sentences)
 */
const writeTakeaway = (report, outputDir) => {
  const sentences = [];

  // Sentence 1: Primary metric
  if (report.metrics.accuracy !== undefined) {
    const acc = (report.metrics.accuracy * 100).toFixed(1);
    sentences.push(`The model achieved an accuracy of ${acc}%.`);
  } else if (report.metrics.rmse !== undefined) {
    sentences.push(`The model achieved an RMSE of ${report.metrics.rmse.toFixed(3)}.`);
  } else {
    sentences.push('The evaluation completed successfully.');
  }

  // Sentence 2: Confidence intervals
  if (report.confidenceIntervals && report.confidenceIntervals.accuracy) {
    const ci = report.confidenceIntervals.accuracy;
    const lower = (ci.lower * 100).toFixed(1);
    const upper = (ci.upper * 100).toFixed(1);
    sentences.push(`With ${(ci.confidence * 100)}% confidence, the true accuracy is between ${lower}% and ${upper}%.`);
  } else {
    sentences.push('Statistical confidence intervals were computed for key metrics.');
  }

  // Sentence 3: Slices
  if (report.slices && Object.keys(report.slices).length > 0) {
    const sliceNames = Object.keys(report.slices);
    const sliceAccuracies = Object.values(report.slices).map(s => s.accuracy);
    const bestSlice = sliceNames[sliceAccuracies.indexOf(Math.max(...sliceAccuracies))];
    const worstSlice = sliceNames[sliceAccuracies.indexOf(Math.min(...sliceAccuracies))];
    sentences.push(`Performance varied across slices, with best results on ${bestSlice} and worst on ${worstSlice}.`);
  } else {
    sentences.push('No significant performance variation was observed across data subgroups.');
  }

  // Sentence 4: Failures
  if (report.failureExamples && report.failureExamples.length > 0) {
    const highConfFailures = report.failureExamples.filter(f => f.confidence && f.confidence > 0.8).length;
    if (highConfFailures > 0) {
      sentences.push(`Found ${highConfFailures} high-confidence errors that warrant investigation.`);
    } else {
      sentences.push('Most errors occurred with low confidence, indicating appropriate uncertainty.');
    }
  } else {
    sentences.push('The model demonstrated consistent prediction quality.');
  }

  // Sentence 5: Recommendation
  if (report.metrics.accuracy !== undefined) {
    if (report.metrics.accuracy > 0.95) {
      sentences.push('The model is production-ready with strong performance across all metrics.');
    } else if (report.metrics.accuracy > 0.85) {
      sentences.push('The model shows good performance but may benefit from targeted improvements on weak slices.');
    } else {
      sentences.push('Further model development is recommended to improve overall performance.');
    }
  } else {
    sentences.push('Review the detailed metrics to determine if the model meets production requirements.');
  }

  const takeaway = sentences.slice(0, 5).join(' ');
  const filepath = path.join(outputDir, 'takeaway.txt');
  fs.writeFileSync(filepath, takeaway);
  return filepath;
};

/**
 * Write eval_summary.json (complete report)
 */
const writeEvalSummaryJson = (report, outputDir) => {
  const filepath = path.join(outputDir, 'eval_summary.json');
  fs.writeFileSync(filepath, JSON.stringify(report, null, 2));
  return filepath;
};

module.exports = {
  writeEvaluationReport,
  writeMetricsJson,
  writeConfidenceIntervalsJson,
  writeSlicesJson,
  writeFailureExamplesJson,
  writeTakeaway,
  writeEvalSummaryJson
};
