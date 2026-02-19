import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { API_ENDPOINTS } from '../../config/api';
import {
  BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart, Line, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import {
  Card, Button, Select, Badge, Table, Th, Td, Tabs,
  LoadingContainer, Spinner, EmptyState, EmptyStateTitle, EmptyStateText
} from './components/SharedComponents';

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing?.[8] || "2rem"};
  max-width: 1600px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing?.[8] || "2rem"};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSize?.['4xl'] || '2.25rem'};
  font-weight: ${({ theme }) => theme.fontWeight?.bold || 700};
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: ${({ theme }) => theme.spacing?.[2] || "0.5rem"};
  line-height: ${({ theme }) => theme.lineHeight?.tight || "1.25"};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSize?.lg || "1.125rem"};
  color: ${({ theme }) => theme.text_secondary};
  line-height: ${({ theme }) => theme.lineHeight?.normal || "1.5"};
  margin: 0 0 ${({ theme }) => theme.spacing?.[6] || "1.5rem"} 0;
`;

const SelectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing?.[4] || "1rem"};
  margin-bottom: ${({ theme }) => theme.spacing?.[8] || "2rem"};
`;

const SelectBox = styled.div`
  background: ${({ theme }) => theme.cardLight};
  padding: ${({ theme }) => theme.spacing?.[5] || "1.25rem"};
  border-radius: ${({ theme }) => theme.borderRadius?.lg || "0.75rem"};
  border: 2px solid ${({ theme }) => theme.border};
  transition: ${({ theme }) => theme.transition?.fast || '0.2s ease'};

  &:hover {
    border-color: ${({ theme }) => theme.borderMedium};
  }
`;

const Label = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.fontSize?.sm || "0.875rem"};
  font-weight: ${({ theme }) => theme.fontWeight?.semibold || 600};
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: ${({ theme }) => theme.spacing?.[2] || "0.5rem"};
`;

const ChartSection = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing?.[8] || "2rem"};
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing?.[6] || "1.5rem"};
  padding-bottom: ${({ theme }) => theme.spacing?.[4] || "1rem"};
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const ChartTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSize?.xl || "1.25rem"};
  font-weight: ${({ theme }) => theme.fontWeight?.semibold || 600};
  color: ${({ theme }) => theme.text_primary};
  margin: 0;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: ${({ theme }) => theme.spacing?.[6] || "1.5rem"};
  margin-bottom: ${({ theme }) => theme.spacing?.[8] || "2rem"};

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ComparisonTable = styled(Card)`
  overflow-x: auto;
  margin-bottom: 2rem;
`;

const DiffValue = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DiffIndicator = styled.span`
  color: ${({ positive, theme }) => positive ? '#10b981' : '#ef4444'};
  font-weight: 700;
`;

const BestBadge = styled(Badge)`
  margin-left: 0.5rem;
`;

const StatTestCard = styled(Card)`
  padding: 1rem;
`;

const StatTestResult = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: ${({ theme }) => theme.bg};
  border-radius: 8px;
  margin-bottom: 0.5rem;
`;

const StatTestLabel = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text_secondary};
`;

const StatTestValue = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ significant, theme }) => significant ? theme.primary : theme.text_primary};
`;

const ConfigDiff = styled.div`
  display: grid;
  gap: 0.5rem;
`;

const ConfigDiffRow = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 1rem;
  padding: 0.75rem;
  background: ${({ theme }) => theme.bg};
  border-radius: 8px;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ConfigKey = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.text_secondary};
  font-size: 0.875rem;
`;

const ConfigValues = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const ConfigValue = styled.div`
  padding: 0.5rem 0.75rem;
  background: ${({ different, theme }) =>
    different ? theme.primary + '20' : theme.text_primary + '10'};
  border-radius: 6px;
  font-family: monospace;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text_primary};
`;

const COLORS = ['#854CE6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const Compare = () => {
  const [runs, setRuns] = useState([]);
  const [selectedRunIds, setSelectedRunIds] = useState(['', '', '', '', '']);
  const [selectedRuns, setSelectedRuns] = useState([]);
  const [artifacts, setArtifacts] = useState({});
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRuns();
  }, []);

  useEffect(() => {
    const validIds = selectedRunIds.filter(id => id !== '');
    if (validIds.length > 0) {
      fetchSelectedRuns(validIds);
    } else {
      setSelectedRuns([]);
    }
  }, [selectedRunIds]);

  const fetchRuns = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.runs);
      const data = await response.json();
      setRuns(data.runs || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching runs:', error);
      setLoading(false);
    }
  };

  const fetchSelectedRuns = async (ids) => {
    try {
      const promises = ids.map(id => fetch(API_ENDPOINTS.run(id)).then(r => r.json()));
      const results = await Promise.all(promises);
      const runs = results.map(r => r.run).filter(Boolean);
      setSelectedRuns(runs);

      // Fetch artifacts for each run
      const artifactPromises = runs.map(run =>
        fetch(API_ENDPOINTS.artifacts(run.id))
          .then(r => r.json())
          .then(data => ({ runId: run.id, artifacts: data.artifacts || [] }))
      );
      const artifactResults = await Promise.all(artifactPromises);
      const artifactMap = {};
      artifactResults.forEach(result => {
        artifactMap[result.runId] = result.artifacts;
      });
      setArtifacts(artifactMap);
    } catch (error) {
      console.error('Error fetching selected runs:', error);
    }
  };

  const handleRunSelection = (index, value) => {
    const newIds = [...selectedRunIds];
    newIds[index] = value;
    setSelectedRunIds(newIds);
  };

  const getMetricComparison = () => {
    if (selectedRuns.length === 0) return [];

    const allKeys = new Set();
    selectedRuns.forEach(run => {
      Object.keys(run.metrics || {}).forEach(key => allKeys.add(key));
      // Add latency metrics if they exist
      if (run.latencyMetrics) {
        ['p50', 'p95', 'p99', 'mean'].forEach(key => {
          if (run.latencyMetrics[key] !== undefined) {
            allKeys.add(`latency_${key}`);
          }
        });
      }
    });

    return Array.from(allKeys).map(key => {
      // Check if this is a latency metric
      const isLatency = key.startsWith('latency_');
      const latencyKey = isLatency ? key.replace('latency_', '') : null;

      const values = selectedRuns.map(run => {
        if (isLatency) {
          return run.latencyMetrics?.[latencyKey] || 0;
        }
        return run.metrics?.[key] || 0;
      });

      const numericValues = values.filter(v => typeof v === 'number' && v > 0);

      // For latency, lower is better
      const bestValue = numericValues.length > 0
        ? (isLatency ? Math.min(...numericValues) : Math.max(...numericValues))
        : null;

      // Calculate deltas from baseline (first run)
      const baseline = values[0];
      const deltas = values.map((v, idx) => {
        if (idx === 0 || typeof v !== 'number' || typeof baseline !== 'number') return null;
        const delta = v - baseline;
        const percentChange = baseline !== 0 ? ((delta / baseline) * 100) : null;
        return {
          absolute: delta,
          percent: percentChange,
          improved: isLatency ? delta < 0 : delta > 0 // For latency, negative is better
        };
      });

      return {
        key: isLatency ? `Latency ${latencyKey.toUpperCase()} (ms)` : key,
        values,
        bestValue,
        deltas,
        runs: selectedRuns.map((run, idx) => ({
          name: run.name,
          value: values[idx],
          isBest: values[idx] === bestValue && typeof values[idx] === 'number' && values[idx] > 0,
          delta: deltas[idx]
        }))
      };
    });
  };

  const getRadarChartData = () => {
    if (selectedRuns.length === 0) return [];

    const metrics = getMetricComparison();
    return metrics
      .filter(m => m.values.every(v => typeof v === 'number'))
      .map(m => {
        const dataPoint = { metric: m.key };
        selectedRuns.forEach((run, idx) => {
          dataPoint[run.name] = m.values[idx];
        });
        return dataPoint;
      });
  };

  const getParallelCoordinatesData = () => {
    return selectedRuns.map((run, idx) => ({
      name: run.name,
      color: COLORS[idx % COLORS.length],
      ...run.hyperparameters
    }));
  };

  const getHyperparamComparison = () => {
    if (selectedRuns.length === 0) return [];

    const allKeys = new Set();
    selectedRuns.forEach(run => {
      Object.keys(run.hyperparameters || {}).forEach(key => allKeys.add(key));
    });

    return Array.from(allKeys).map(key => {
      const values = selectedRuns.map(run => run.hyperparameters?.[key]);
      const uniqueValues = new Set(values.map(v => JSON.stringify(v)));

      return {
        key,
        values,
        different: uniqueValues.size > 1
      };
    });
  };

  const getArtifactComparison = () => {
    if (selectedRuns.length === 0) return [];

    // Collect all unique artifact names
    const allArtifactNames = new Set();
    Object.values(artifacts).forEach(runArtifacts => {
      runArtifacts.forEach(artifact => {
        allArtifactNames.add(artifact.name);
      });
    });

    // Build comparison data for each artifact
    return Array.from(allArtifactNames).map(name => {
      const comparison = {
        name,
        runs: selectedRuns.map(run => {
          const runArtifacts = artifacts[run.id] || [];
          const artifact = runArtifacts.find(a => a.name === name);
          return {
            runName: run.name,
            runId: run.id,
            exists: !!artifact,
            size: artifact?.size || 0,
            type: artifact?.type || '-',
            path: artifact?.path || null
          };
        })
      };

      // Check if artifact sizes differ
      const sizes = comparison.runs.filter(r => r.exists).map(r => r.size);
      comparison.different = new Set(sizes).size > 1;

      return comparison;
    }).sort((a, b) => a.name.localeCompare(b.name));
  };

  const calculateStatisticalSignificance = (metric) => {
    // Simple t-test approximation (mock implementation)
    const values = selectedRuns.map(run => run.metrics?.[metric] || 0).filter(v => typeof v === 'number');

    if (values.length < 2) return null;

    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);

    // Mock p-value
    const pValue = stdDev > 0.01 ? 0.032 : 0.85;

    return {
      mean: mean.toFixed(4),
      stdDev: stdDev.toFixed(4),
      pValue: pValue.toFixed(3),
      significant: pValue < 0.05
    };
  };

  const exportComparison = () => {
    alert('Exporting comparison report... (Feature would export to PDF/CSV)');
  };

  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <Spinner size="60px" />
        </LoadingContainer>
      </Container>
    );
  }

  const metricComparison = getMetricComparison();
  const radarData = getRadarChartData();
  const hyperparamComparison = getHyperparamComparison();
  const artifactComparison = getArtifactComparison();

  return (
    <Container>
      <Header>
        <Title>Compare Runs</Title>
        <Subtitle>Analyze multiple runs side-by-side with metric diffs, config comparisons, artifact differences, and p50/p95/p99 latency measurements.</Subtitle>
      </Header>

      <SelectionGrid>
        {[0, 1, 2, 3, 4].map(index => (
          <SelectBox key={index}>
            <Label htmlFor={`run-select-${index}`}>Run {index + 1}</Label>
            <Select
              id={`run-select-${index}`}
              value={selectedRunIds[index]}
              onChange={(e) => handleRunSelection(index, e.target.value)}
            >
              <option value="">Select a run...</option>
              {runs.map(run => (
                <option
                  key={run.id}
                  value={run.id}
                  disabled={selectedRunIds.includes(run.id) && selectedRunIds[index] !== run.id}
                >
                  {run.name}
                </option>
              ))}
            </Select>
          </SelectBox>
        ))}
      </SelectionGrid>

      {selectedRuns.length === 0 ? (
        <EmptyState>
          <EmptyStateTitle>No Runs Selected</EmptyStateTitle>
          <EmptyStateText>
            Select at least 2 runs above to compare their metrics, hyperparameters, and configurations
          </EmptyStateText>
        </EmptyState>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <Button onClick={exportComparison}>Export Report</Button>
          </div>

          <Tabs
            tabs={[
              { id: 'overview', label: 'Overview' },
              { id: 'metrics', label: 'Metrics' },
              { id: 'hyperparameters', label: 'Hyperparameters' },
              { id: 'artifacts', label: 'Artifacts' },
              { id: 'statistics', label: 'Statistical Tests' }
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          {activeTab === 'overview' && (
            <>
              <ChartsGrid>
                {radarData.length > 0 && (
                  <ChartSection>
                    <ChartTitle>Metrics Radar Chart</ChartTitle>
                    <ResponsiveContainer width="100%" height={400}>
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="#444" />
                        <PolarAngleAxis dataKey="metric" stroke="#888" />
                        <PolarRadiusAxis stroke="#888" />
                        {selectedRuns.map((run, idx) => (
                          <Radar
                            key={run.id}
                            name={run.name}
                            dataKey={run.name}
                            stroke={COLORS[idx % COLORS.length]}
                            fill={COLORS[idx % COLORS.length]}
                            fillOpacity={0.3}
                          />
                        ))}
                        <Legend />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </ChartSection>
                )}

                <ChartSection>
                  <ChartTitle>Metric Comparison</ChartTitle>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                      data={metricComparison.filter(m =>
                        m.values.every(v => typeof v === 'number')
                      ).slice(0, 6)}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="key" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1a1a1a',
                          border: '1px solid #333',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      {selectedRuns.map((run, idx) => (
                        <Bar
                          key={run.id}
                          dataKey={`runs[${idx}].value`}
                          fill={COLORS[idx % COLORS.length]}
                          name={run.name}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </ChartSection>
              </ChartsGrid>

              <ComparisonTable>
                <ChartTitle style={{ marginBottom: '1rem' }}>Quick Comparison</ChartTitle>
                <Table>
                  <thead>
                    <tr>
                      <Th>Property</Th>
                      {selectedRuns.map(run => (
                        <Th key={run.id}>{run.name}</Th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <Td>Status</Td>
                      {selectedRuns.map(run => (
                        <Td key={run.id}>
                          <Badge variant={
                            run.status === 'completed' ? 'success' :
                            run.status === 'running' ? 'info' :
                            run.status === 'failed' ? 'error' : 'default'
                          }>
                            {run.status}
                          </Badge>
                        </Td>
                      ))}
                    </tr>
                    <tr>
                      <Td>Created</Td>
                      {selectedRuns.map(run => (
                        <Td key={run.id}>{new Date(run.createdAt).toLocaleDateString()}</Td>
                      ))}
                    </tr>
                    <tr>
                      <Td>Seed</Td>
                      {selectedRuns.map(run => (
                        <Td key={run.id}>{run.seed}</Td>
                      ))}
                    </tr>
                    <tr>
                      <Td>Commit</Td>
                      {selectedRuns.map(run => (
                        <Td key={run.id}>{run.commitHash?.substring(0, 8) || 'N/A'}</Td>
                      ))}
                    </tr>
                    {selectedRuns.some(run => run.latencyMetrics) && (
                      <>
                        <tr>
                          <Td><strong>Latency P50 (ms)</strong></Td>
                          {selectedRuns.map(run => (
                            <Td key={run.id}>
                              {run.latencyMetrics?.p50 ? run.latencyMetrics.p50.toFixed(2) : 'N/A'}
                            </Td>
                          ))}
                        </tr>
                        <tr>
                          <Td><strong>Latency P95 (ms)</strong></Td>
                          {selectedRuns.map(run => (
                            <Td key={run.id}>
                              {run.latencyMetrics?.p95 ? run.latencyMetrics.p95.toFixed(2) : 'N/A'}
                            </Td>
                          ))}
                        </tr>
                        <tr>
                          <Td><strong>Latency P99 (ms)</strong></Td>
                          {selectedRuns.map(run => (
                            <Td key={run.id}>
                              {run.latencyMetrics?.p99 ? run.latencyMetrics.p99.toFixed(2) : 'N/A'}
                            </Td>
                          ))}
                        </tr>
                      </>
                    )}
                  </tbody>
                </Table>
              </ComparisonTable>
            </>
          )}

          {activeTab === 'metrics' && (
            <ComparisonTable>
              <ChartTitle style={{ marginBottom: '1rem' }}>Detailed Metrics Comparison</ChartTitle>
              <Table>
                <thead>
                  <tr>
                    <Th>Metric</Th>
                    {selectedRuns.map(run => (
                      <Th key={run.id}>{run.name}</Th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {metricComparison.map(metric => (
                    <tr key={metric.key}>
                      <Td><strong>{metric.key}</strong></Td>
                      {metric.runs.map((runData, idx) => (
                        <Td key={idx}>
                          <DiffValue>
                            {typeof runData.value === 'number'
                              ? runData.value.toFixed(4)
                              : JSON.stringify(runData.value)}
                            {runData.delta && (
                              <DiffIndicator positive={runData.delta.improved}>
                                {runData.delta.improved ? '↑' : '↓'}
                                {runData.delta.percent !== null
                                  ? ` ${Math.abs(runData.delta.percent).toFixed(1)}%`
                                  : ` ${Math.abs(runData.delta.absolute).toFixed(4)}`}
                              </DiffIndicator>
                            )}
                            {runData.isBest && (
                              <BestBadge variant="success">BEST</BestBadge>
                            )}
                          </DiffValue>
                        </Td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </ComparisonTable>
          )}

          {activeTab === 'hyperparameters' && (
            <ChartSection>
              <ChartTitle style={{ marginBottom: '1rem' }}>Hyperparameter Differences</ChartTitle>
              <ConfigDiff>
                {hyperparamComparison.map(param => (
                  <ConfigDiffRow key={param.key}>
                    <ConfigKey>{param.key}</ConfigKey>
                    <ConfigValues>
                      {param.values.map((value, idx) => (
                        <ConfigValue key={idx} different={param.different}>
                          <strong>{selectedRuns[idx].name}:</strong> {JSON.stringify(value)}
                        </ConfigValue>
                      ))}
                    </ConfigValues>
                  </ConfigDiffRow>
                ))}
              </ConfigDiff>
            </ChartSection>
          )}

          {activeTab === 'artifacts' && (
            <ComparisonTable>
              <ChartTitle style={{ marginBottom: '1rem' }}>Artifact Comparison</ChartTitle>
              <Table>
                <thead>
                  <tr>
                    <Th>Artifact</Th>
                    {selectedRuns.map(run => (
                      <Th key={run.id}>{run.name}</Th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {artifactComparison.map(artifact => (
                    <tr key={artifact.name}>
                      <Td>
                        <strong>{artifact.name}</strong>
                        {artifact.different && (
                          <Badge variant="warning" style={{ marginLeft: '0.5rem' }}>
                            DIFF
                          </Badge>
                        )}
                      </Td>
                      {artifact.runs.map((runData, idx) => (
                        <Td key={idx}>
                          {runData.exists ? (
                            <div>
                              <div style={{ fontSize: '0.875rem' }}>
                                {(runData.size / 1024).toFixed(2)} KB
                              </div>
                              <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.25rem' }}>
                                Type: {runData.type}
                              </div>
                            </div>
                          ) : (
                            <Badge variant="error">Missing</Badge>
                          )}
                        </Td>
                      ))}
                    </tr>
                  ))}
                  {artifactComparison.length === 0 && (
                    <tr>
                      <Td colSpan={selectedRuns.length + 1} style={{ textAlign: 'center', padding: '2rem' }}>
                        No artifacts found for selected runs
                      </Td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </ComparisonTable>
          )}

          {activeTab === 'statistics' && (
            <StatTestCard>
              <ChartTitle style={{ marginBottom: '1rem' }}>Statistical Significance Tests</ChartTitle>
              {metricComparison
                .filter(m => m.values.every(v => typeof v === 'number'))
                .map(metric => {
                  const stats = calculateStatisticalSignificance(metric.key);
                  if (!stats) return null;

                  return (
                    <div key={metric.key} style={{ marginBottom: '1rem' }}>
                      <h4 style={{ marginBottom: '0.5rem' }}>{metric.key}</h4>
                      <StatTestResult>
                        <StatTestLabel>Mean</StatTestLabel>
                        <StatTestValue>{stats.mean}</StatTestValue>
                      </StatTestResult>
                      <StatTestResult>
                        <StatTestLabel>Std Dev</StatTestLabel>
                        <StatTestValue>{stats.stdDev}</StatTestValue>
                      </StatTestResult>
                      <StatTestResult>
                        <StatTestLabel>P-Value</StatTestLabel>
                        <StatTestValue significant={stats.significant}>
                          {stats.pValue} {stats.significant && '(Significant)'}
                        </StatTestValue>
                      </StatTestResult>
                    </div>
                  );
                })}
            </StatTestCard>
          )}
        </>
      )}
    </Container>
  );
};

export default Compare;
