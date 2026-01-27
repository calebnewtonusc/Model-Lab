/**
 * Reproduction Pack Generator
 * Creates complete packages for reproducing experimental results
 */

const db = require('./database');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

/**
 * Generate reproduction package for a run
 * @param {string} runId - Run ID
 * @returns {Object} Repro pack data
 */
function generateReproPack(runId) {
  const run = db.getRun(runId);
  if (!run) {
    throw new Error(`Run ${runId} not found`);
  }

  const dataset = run.dataset_id ? db.getDataset(run.dataset_id) : null;
  const artifacts = db.getArtifactsByRunId(runId);

  // Build environment info
  const environment = {
    node_version: process.version,
    platform: process.platform,
    arch: process.arch,
    timestamp: new Date().toISOString(),
  };

  // Build reproduction command
  const reproduceCommand = buildReproduceCommand(run, dataset);

  // Build install command
  const installCommand = buildInstallCommand(run);

  // Get dataset checksum
  const datasetChecksum = dataset ? dataset.checksum : null;

  // Get artifact paths
  const artifactPaths = artifacts.map(a => a.path);

  return {
    run: {
      id: run.id,
      name: run.name,
      description: run.description,
      status: run.status,
      created_at: run.created_at,
      completed_at: run.completed_at,
      seed: run.seed,
      commit_hash: run.commit_hash,
      config: run.config,
      hyperparameters: run.hyperparameters,
      metrics: run.metrics,
    },
    dataset: dataset ? {
      id: dataset.id,
      name: dataset.name,
      file_path: dataset.filePath,
      file_type: dataset.fileType,
      checksum: dataset.checksum,
      version: dataset.version,
      row_count: dataset.rowCount,
      file_size: dataset.fileSize,
    } : null,
    environment,
    reproduceCommand,
    installCommand,
    datasetChecksum,
    artifactPaths,
  };
}

/**
 * Build command to reproduce the run
 */
function buildReproduceCommand(run, dataset) {
  const parts = [];

  // Base command (example - would be customized per project)
  parts.push('python train.py');

  // Add dataset
  if (dataset) {
    parts.push(`--dataset "${dataset.filePath}"`);
  }

  // Add hyperparameters
  if (run.hyperparameters) {
    for (const [key, value] of Object.entries(run.hyperparameters)) {
      parts.push(`--${key} ${value}`);
    }
  }

  // Add seed
  if (run.seed !== null && run.seed !== undefined) {
    parts.push(`--seed ${run.seed}`);
  }

  // Add run name
  parts.push(`--run-name "${run.name}"`);

  return parts.join(' \\\n  ');
}

/**
 * Build command to install dependencies
 */
function buildInstallCommand(run) {
  // Default Python dependencies
  const deps = [
    'pip install numpy pandas scikit-learn matplotlib seaborn',
    'pip install modellab-client',
  ];

  // Add custom dependencies from config if available
  if (run.config && run.config.dependencies) {
    deps.push(...run.config.dependencies);
  }

  return deps.join('\n');
}

/**
 * Generate reproduce.md markdown file
 */
function generateReproduceMd(reproPack) {
  const { run, dataset, environment, reproduceCommand, installCommand, datasetChecksum } = reproPack;

  const md = `# Reproduction Guide: ${run.name}

## Overview

This package contains everything needed to reproduce the experimental results for run \`${run.id}\`.

- **Run Name**: ${run.name}
- **Status**: ${run.status}
- **Created**: ${new Date(run.created_at).toLocaleString()}
${run.completed_at ? `- **Completed**: ${new Date(run.completed_at).toLocaleString()}` : ''}
- **Seed**: ${run.seed || 'Not specified'}
${run.commit_hash ? `- **Commit Hash**: \`${run.commit_hash}\`` : ''}

## Performance Metrics

\`\`\`json
${JSON.stringify(run.metrics, null, 2)}
\`\`\`

## Dataset

${dataset ? `
- **Name**: ${dataset.name}
- **File**: \`${path.basename(dataset.file_path)}\`
- **Type**: ${dataset.file_type}
- **Rows**: ${dataset.row_count}
- **Size**: ${(dataset.file_size / 1024 / 1024).toFixed(2)} MB
- **Checksum**: \`${datasetChecksum}\`
- **Version**: ${dataset.version}
` : 'No dataset associated with this run.'}

## Hyperparameters

\`\`\`json
${JSON.stringify(run.hyperparameters || {}, null, 2)}
\`\`\`

## Full Configuration

\`\`\`json
${JSON.stringify(run.config || {}, null, 2)}
\`\`\`

## Environment

- **Node.js**: ${environment.node_version}
- **Platform**: ${environment.platform}
- **Architecture**: ${environment.arch}
- **Generated**: ${new Date(environment.timestamp).toLocaleString()}

## Reproduction Steps

### 1. Install Dependencies

\`\`\`bash
${installCommand}
\`\`\`

### 2. Verify Dataset

Ensure the dataset file is present and matches the checksum:

\`\`\`bash
sha256sum ${dataset ? path.basename(dataset.file_path) : 'dataset.csv'}
# Expected: ${datasetChecksum || 'N/A'}
\`\`\`

### 3. Run Training

\`\`\`bash
${reproduceCommand}
\`\`\`

### 4. Verify Results

Compare the output metrics with the expected values above. Small variations (<1%) are normal due to numerical precision.

## Artifacts

This run generated the following artifacts:

${reproPack.artifactPaths.length > 0 ? reproPack.artifactPaths.map(p => `- \`${path.basename(p)}\``).join('\n') : '- No artifacts generated'}

## Notes

- This reproduction package was generated automatically by ModelLab
- For questions or issues, refer to the ModelLab documentation
- Ensure you're using the same versions of key dependencies for best reproducibility

## Generated by

[ModelLab](https://github.com/calebnewtonusc/ModelLab) - ML Experiment Tracking Platform
`;

  return md;
}

/**
 * Export repro pack as ZIP file
 * @param {string} runId - Run ID
 * @param {string} outputPath - Output ZIP file path
 * @returns {Promise<string>} Path to created ZIP file
 */
async function exportReproPackZip(runId, outputPath) {
  const reproPack = generateReproPack(runId);

  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath);
    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximum compression
    });

    output.on('close', () => {
      resolve(outputPath);
    });

    archive.on('error', (err) => {
      reject(err);
    });

    archive.pipe(output);

    // Add reproduce.md
    const reproduceMd = generateReproduceMd(reproPack);
    archive.append(reproduceMd, { name: 'reproduce.md' });

    // Add run_config.json
    archive.append(JSON.stringify(reproPack.run, null, 2), { name: 'run_config.json' });

    // Add dataset_info.json
    if (reproPack.dataset) {
      archive.append(JSON.stringify(reproPack.dataset, null, 2), { name: 'dataset_info.json' });
    }

    // Add environment.json
    archive.append(JSON.stringify(reproPack.environment, null, 2), { name: 'environment.json' });

    // Optionally add artifacts
    // (In production, you might want to make this configurable or ask the user)
    // for (const artifactPath of reproPack.artifactPaths) {
    //   if (fs.existsSync(artifactPath)) {
    //     archive.file(artifactPath, { name: path.join('artifacts', path.basename(artifactPath)) });
    //   }
    // }

    archive.finalize();
  });
}

module.exports = {
  generateReproPack,
  generateReproduceMd,
  exportReproPackZip,
};
