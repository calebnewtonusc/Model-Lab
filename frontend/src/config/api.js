/**
 * API Configuration
 * Centralized configuration for API endpoints with environment-based URLs
 */

// Get API base URL from environment variable or default to relative path
const getApiBaseUrl = () => {
  // In production, use environment variable if set
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // In development or if not set, use relative path (same domain)
  return '';
};

const API_BASE_URL = getApiBaseUrl();

// API endpoints
export const API_ENDPOINTS = {
  // Health
  health: `${API_BASE_URL}/api/health`,
  docs: `${API_BASE_URL}/api/docs`,

  // Projects
  projects: `${API_BASE_URL}/api/modellab/projects`,
  project: (id) => `${API_BASE_URL}/api/modellab/projects/${id}`,
  projectDatasets: (id) => `${API_BASE_URL}/api/modellab/projects/${id}/datasets`,
  projectRuns: (id) => `${API_BASE_URL}/api/modellab/projects/${id}/runs`,

  // Datasets
  datasets: `${API_BASE_URL}/api/modellab/datasets`,
  dataset: (id) => `${API_BASE_URL}/api/modellab/datasets/${id}`,
  datasetPreview: (id) => `${API_BASE_URL}/api/modellab/datasets/${id}/preview`,

  // Runs
  runs: `${API_BASE_URL}/api/modellab/runs`,
  run: (id) => `${API_BASE_URL}/api/modellab/runs/${id}`,
  runEvaluate: (id) => `${API_BASE_URL}/api/modellab/runs/${id}/evaluate`,
  runRepro: (id) => `${API_BASE_URL}/api/modellab/runs/${id}/repro`,
  runReproDownload: (id) => `${API_BASE_URL}/api/modellab/runs/${id}/repro/download`,
  runLatency: (id) => `${API_BASE_URL}/api/modellab/runs/${id}/latency`,

  // Artifacts
  artifacts: (runId) => `${API_BASE_URL}/api/modellab/artifacts/${runId}`,
  artifactUpload: (runId) => `${API_BASE_URL}/api/modellab/artifacts/${runId}`,
  artifactDownload: (runId, path) => `${API_BASE_URL}/api/modellab/artifacts/${runId}/download/${path}`,
};

// Helper function to build full URL
const buildUrl = (path) => {
  if (path.startsWith('http')) {
    return path;
  }
  return `${API_BASE_URL}${path}`;
};

// Fetch wrapper with error handling
const apiFetch = async (url, options = {}) => {
  try {
    const response = await fetch(buildUrl(url), {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API fetch error:', error);
    throw error;
  }
};

// Export config info for debugging
const getApiConfig = () => ({
  baseUrl: API_BASE_URL,
  environment: process.env.REACT_APP_ENVIRONMENT || 'development',
  apiUrlConfigured: !!process.env.REACT_APP_API_URL,
});

// Log API configuration in development
if (process.env.NODE_ENV === 'development') {
  console.log('API Configuration:', getApiConfig());
}
