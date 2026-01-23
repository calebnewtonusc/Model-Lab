export default function Compare() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Compare Runs</h1>

      <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Select Runs to Compare</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Run A
            </label>
            <select className="w-full border border-gray-300 rounded-lg p-2">
              <option>Select a run...</option>
              <option>baseline-logistic (96% accuracy)</option>
              <option>xgboost-tuned (98% accuracy)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Run B
            </label>
            <select className="w-full border border-gray-300 rounded-lg p-2">
              <option>Select a run...</option>
              <option>baseline-logistic (96% accuracy)</option>
              <option>xgboost-tuned (98% accuracy)</option>
            </select>
          </div>
        </div>
        <button className="mt-4 bg-primary text-white px-6 py-2 rounded-lg hover:bg-opacity-90">
          Compare
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">Comparison Features</h3>
        <ul className="list-disc list-inside space-y-1 text-blue-800 text-sm">
          <li>Side-by-side metric comparison with statistical significance</li>
          <li>Config diff showing hyperparameter changes</li>
          <li>Artifact comparison (plots, confusion matrices)</li>
          <li>Slice performance breakdown</li>
          <li>Failure case analysis</li>
          <li>Latency comparison (p50/p95)</li>
        </ul>
      </div>

      <div className="text-center py-8 text-gray-500">
        Select two runs above to see detailed comparison
      </div>
    </div>
  )
}
