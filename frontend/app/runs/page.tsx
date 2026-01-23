export default function Runs() {
  const runs = [
    {
      id: 1,
      name: 'baseline-logistic',
      dataset: 'iris-v1',
      model: 'LogisticRegression',
      accuracy: 0.96,
      created: '2026-01-20 14:30',
      status: 'completed',
      seed: 42,
      commitHash: 'a1b2c3d'
    },
    {
      id: 2,
      name: 'xgboost-tuned',
      dataset: 'iris-v1',
      model: 'XGBoost',
      accuracy: 0.98,
      created: '2026-01-20 15:45',
      status: 'completed',
      seed: 42,
      commitHash: 'a1b2c3d'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Experiment Runs</h1>
        <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90">
          New Run
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {runs.map((run) => (
          <div key={run.id} className="bg-white shadow rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{run.name}</h3>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Dataset:</span> {run.dataset}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Model:</span> {run.model}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Accuracy:</span> {(run.accuracy * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-600 font-mono">
                    <span className="font-medium">Seed:</span> {run.seed} |
                    <span className="font-medium"> Commit:</span> {run.commitHash}
                  </p>
                </div>
              </div>
              <div className="ml-4 flex flex-col items-end space-y-2">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  run.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {run.status}
                </span>
                <p className="text-xs text-gray-500">{run.created}</p>
                <div className="flex space-x-2">
                  <button className="text-sm text-primary hover:underline">
                    View Details
                  </button>
                  <button className="text-sm text-gray-600 hover:underline">
                    Compare
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {runs.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No runs yet. Start your first experiment to track results.</p>
        </div>
      )}
    </div>
  )
}
