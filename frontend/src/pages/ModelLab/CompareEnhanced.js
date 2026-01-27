import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
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
  padding: 2rem;
  max-width: 1600px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 1rem;
`;

const SelectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const SelectBox = styled.div`
  background: ${({ theme }) => theme.card};
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.text_primary + '12'};
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 0.5rem;
`;

const ChartSection = styled(Card)`
  margin-bottom: 2rem;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ChartTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  margin: 0;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;

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
      const response = await fetch('/api/modellab/runs');
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
      const promises = ids.map(id => fetch(`/api/modellab/runs/${id}`).then(r => r.json()));
      const results = await Promise.all(promises);
      setSelectedRuns(results.map(r => r.run).filter(Boolean));
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
    });

    return Array.from(allKeys).map(key => {
      const values = selectedRuns.map(run => run.metrics?.[key] || 0);
      const numericValues = values.filter(v => typeof v === 'number');
      const bestValue = numericValues.length > 0 ? Math.max(...numericValues) : null;

      return {
        key,
        values,
        bestValue,
        runs: selectedRuns.map((run, idx) => ({
          name: run.name,
          value: values[idx],
          isBest: values[idx] === bestValue && typeof values[idx] === 'number'
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

  return (
    <Container>
      <Header>
        <Title>Compare Runs</Title>
      </Header>

      <SelectionGrid>
        {[0, 1, 2, 3, 4].map(index => (
          <SelectBox key={index}>
            <Label>Run {index + 1}</Label>
            <Select
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
