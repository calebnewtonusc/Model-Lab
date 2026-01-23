export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-lg p-8">
        <h1 className="text-4xl font-bold mb-4">ML Experiment Command Center</h1>
        <p className="text-xl opacity-90 mb-6">
          Reproducible ML experimentation with dataset versioning, run tracking, and honest evaluation
        </p>
        <div className="flex space-x-4">
          <button className="bg-white text-primary px-6 py-2 rounded-lg font-medium hover:bg-opacity-90">
            Upload Dataset
          </button>
          <button className="border-2 border-white text-white px-6 py-2 rounded-lg font-medium hover:bg-white hover:bg-opacity-10">
            Start New Run
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Total Datasets</h3>
          <p className="text-3xl font-bold text-gray-900">0</p>
          <p className="text-sm text-gray-600 mt-2">No datasets uploaded yet</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Total Runs</h3>
          <p className="text-3xl font-bold text-gray-900">0</p>
          <p className="text-sm text-gray-600 mt-2">Start your first experiment</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Best Model</h3>
          <p className="text-3xl font-bold text-gray-900">-</p>
          <p className="text-sm text-gray-600 mt-2">Train models to compare</p>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h2 className="text-2xl font-bold mb-4">Core Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900">Dataset Versioning</h3>
              <p className="text-sm text-gray-500">Upload CSVs with checksums and schema snapshots</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900">Run Tracking</h3>
              <p className="text-sm text-gray-500">Track seed, commit hash, and dataset version</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900">EvalHarness</h3>
              <p className="text-sm text-gray-500">Standardized metrics, slices, and failure analysis</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900">Compare Mode</h3>
              <p className="text-sm text-gray-500">Diff metrics, configs, and artifacts between runs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Start */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-2 text-blue-900">Getting Started</h2>
        <ol className="list-decimal list-inside space-y-2 text-blue-800">
          <li>Upload your first dataset with schema and checksums</li>
          <li>Configure a baseline model to establish a performance floor</li>
          <li>Run your improved model and compare against the baseline</li>
          <li>Analyze failure cases and slice performance</li>
          <li>Export reproducibility packs for any experiment</li>
        </ol>
      </div>
    </div>
  )
}
