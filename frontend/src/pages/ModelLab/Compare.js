import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

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
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  background: ${({ theme }) => theme.bg};
  border: 1px solid ${({ theme }) => theme.text_primary + '20'};
  border-radius: 8px;
  color: ${({ theme }) => theme.text_primary};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const ComparisonGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const RunPanel = styled.div`
  background: ${({ theme }) => theme.card};
  padding: 1.5rem;
  border-radius: 12px;
  border: 2px solid ${({ isSelected, theme }) =>
    isSelected ? theme.primary : theme.text_primary + '12'};
`;

const RunName = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 1rem;
`;

const Section = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const MetaGrid = styled.div`
  display: grid;
  gap: 0.5rem;
`;

const MetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  background: ${({ theme }) => theme.bg};
  border-radius: 4px;
`;

const MetaKey = styled.span`
  color: ${({ theme }) => theme.text_secondary};
  font-size: 0.875rem;
`;

const MetaValue = styled.span`
  color: ${({ theme }) => theme.text_primary};
  font-weight: 600;
  font-size: 0.875rem;
`;

const ConfigDisplay = styled.pre`
  background: ${({ theme }) => theme.bg};
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.text_primary};
  line-height: 1.5;
  max-height: 300px;
`;

const DiffSection = styled.div`
  background: ${({ theme }) => theme.card};
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.text_primary + '12'};
  margin-bottom: 2rem;
`;

const DiffGrid = styled.div`
  display: grid;
  gap: 1rem;
`;

const DiffRow = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr 1fr;
  gap: 1rem;
  padding: 0.75rem;
  background: ${({ theme }) => theme.bg};
  border-radius: 8px;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const DiffKey = styled.div`
  color: ${({ theme }) => theme.text_secondary};
  font-weight: 600;
  font-size: 0.875rem;
`;

const DiffValue = styled.div`
  color: ${({ theme }) => theme.text_primary};
  font-family: monospace;
  font-size: 0.875rem;
  background: ${({ better, theme }) =>
    better === true ? theme.primary + '20' :
    better === false ? '#ef4444' + '20' :
    'transparent'};
  padding: 0.5rem;
  border-radius: 4px;
`;

const DiffIndicator = styled.span`
  color: ${({ positive, theme }) =>
    positive ? theme.primary : '#ef4444'};
  font-weight: 700;
  margin-left: 0.5rem;
`;

const ChartSection = styled.div`
  background: ${({ theme }) => theme.card};
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.text_primary + '12'};
  margin-bottom: 2rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${({ theme }) => theme.text_secondary};
`;

const Compare = () => {
  const [runs, setRuns] = useState([]);
  const [run1Id, setRun1Id] = useState('');
  const [run2Id, setRun2Id] = useState('');
  const [run1, setRun1] = useState(null);
  const [run2, setRun2] = useState(null);

  useEffect(() => {
    fetchRuns();
  }, []);

  useEffect(() => {
    if (run1Id) {
      fetchRun(run1Id, setRun1);
    }
  }, [run1Id]);

  useEffect(() => {
    if (run2Id) {
      fetchRun(run2Id, setRun2);
    }
  }, [run2Id]);

  const fetchRuns = async () => {
    try {
      const response = await fetch('/api/modellab/runs');
      const data = await response.json();
      setRuns(data.runs || []);
    } catch (error) {
      console.error('Error fetching runs:', error);
    }
  };

  const fetchRun = async (id, setter) => {
    try {
      const response = await fetch(`/api/modellab/runs/${id}`);
      const data = await response.json();
      setter(data.run);
    } catch (error) {
      console.error('Error fetching run:', error);
    }
  };

  const calculateDiff = (val1, val2) => {
    if (typeof val1 !== 'number' || typeof val2 !== 'number') return null;
    const diff = val2 - val1;
    const percent = val1 !== 0 ? (diff / val1) * 100 : 0;
    return { diff, percent };
  };

  const formatDiff = (diff) => {
    if (!diff) return '';
    const sign = diff.diff > 0 ? '+' : '';
    return `${sign}${diff.diff.toFixed(4)} (${sign}${diff.percent.toFixed(2)}%)`;
  };

  const getMetricComparison = () => {
    if (!run1 || !run2) return [];

    const allKeys = new Set([
      ...Object.keys(run1.metrics || {}),
      ...Object.keys(run2.metrics || {})
    ]);

    return Array.from(allKeys).map(key => {
      const val1 = run1.metrics?.[key];
      const val2 = run2.metrics?.[key];
      const diff = calculateDiff(val1, val2);

      return {
        key,
        val1,
        val2,
        diff,
        better: diff ? (diff.diff > 0 ? 1 : -1) : 0
      };
    });
  };

  const getHyperparameterComparison = () => {
    if (!run1 || !run2) return [];

    const allKeys = new Set([
      ...Object.keys(run1.hyperparameters || {}),
      ...Object.keys(run2.hyperparameters || {})
    ]);

    return Array.from(allKeys).map(key => ({
      key,
      val1: run1.hyperparameters?.[key],
      val2: run2.hyperparameters?.[key],
      isDifferent: JSON.stringify(run1.hyperparameters?.[key]) !==
                   JSON.stringify(run2.hyperparameters?.[key])
    }));
  };

  const getRadarChartData = () => {
    if (!run1 || !run2) return [];

    const metrics = getMetricComparison();
    return metrics
      .filter(m => typeof m.val1 === 'number' && typeof m.val2 === 'number')
      .map(m => ({
        metric: m.key,
        run1: m.val1,
        run2: m.val2
      }));
  };

  if (!run1 && !run2) {
    return (
      <Container>
        <Header>
          <Title>Compare Runs</Title>
        </Header>

        <SelectionGrid>
          <SelectBox>
            <Label>Run 1</Label>
            <Select value={run1Id} onChange={(e) => setRun1Id(e.target.value)}>
              <option value="">Select a run...</option>
              {runs.map(run => (
                <option key={run.id} value={run.id}>{run.name}</option>
              ))}
            </Select>
          </SelectBox>

          <SelectBox>
            <Label>Run 2</Label>
            <Select value={run2Id} onChange={(e) => setRun2Id(e.target.value)}>
              <option value="">Select a run...</option>
              {runs.map(run => (
                <option key={run.id} value={run.id}>{run.name}</option>
              ))}
            </Select>
          </SelectBox>
        </SelectionGrid>

        <EmptyState>
          Select two runs to compare their metrics, hyperparameters, and configurations
        </EmptyState>
      </Container>
    );
  }

  const metricComparison = getMetricComparison();
  const hyperparamComparison = getHyperparameterComparison();
  const radarData = getRadarChartData();

  return (
    <Container>
      <Header>
        <Title>Compare Runs</Title>
      </Header>

      <SelectionGrid>
        <SelectBox>
          <Label>Run 1</Label>
          <Select value={run1Id} onChange={(e) => setRun1Id(e.target.value)}>
            <option value="">Select a run...</option>
            {runs.map(run => (
              <option key={run.id} value={run.id}>{run.name}</option>
            ))}
          </Select>
        </SelectBox>

        <SelectBox>
          <Label>Run 2</Label>
          <Select value={run2Id} onChange={(e) => setRun2Id(e.target.value)}>
            <option value="">Select a run...</option>
            {runs.map(run => (
              <option key={run.id} value={run.id}>{run.name}</option>
            ))}
          </Select>
        </SelectBox>
      </SelectionGrid>

      {radarData.length > 0 && (
        <ChartSection>
          <SectionTitle>Metrics Comparison</SectionTitle>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#444" />
              <PolarAngleAxis dataKey="metric" stroke="#888" />
              <PolarRadiusAxis stroke="#888" />
              <Radar name={run1?.name} dataKey="run1" stroke="#854CE6" fill="#854CE6" fillOpacity={0.3} />
              <Radar name={run2?.name} dataKey="run2" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </ChartSection>
      )}

      <DiffSection>
        <SectionTitle>Metrics Diff</SectionTitle>
        <DiffGrid>
          {metricComparison.map(m => (
            <DiffRow key={m.key}>
              <DiffKey>{m.key}</DiffKey>
              <DiffValue>
                {typeof m.val1 === 'number' ? m.val1.toFixed(4) : JSON.stringify(m.val1)}
              </DiffValue>
              <DiffValue better={m.better > 0}>
                {typeof m.val2 === 'number' ? m.val2.toFixed(4) : JSON.stringify(m.val2)}
                {m.diff && (
                  <DiffIndicator positive={m.diff.diff > 0}>
                    {formatDiff(m.diff)}
                  </DiffIndicator>
                )}
              </DiffValue>
            </DiffRow>
          ))}
        </DiffGrid>
      </DiffSection>

      <DiffSection>
        <SectionTitle>Hyperparameters Diff</SectionTitle>
        <DiffGrid>
          {hyperparamComparison.map(h => (
            <DiffRow key={h.key}>
              <DiffKey>{h.key}</DiffKey>
              <DiffValue>
                {JSON.stringify(h.val1)}
              </DiffValue>
              <DiffValue better={h.isDifferent ? false : null}>
                {JSON.stringify(h.val2)}
                {h.isDifferent && <DiffIndicator positive={false}> DIFFERENT</DiffIndicator>}
              </DiffValue>
            </DiffRow>
          ))}
        </DiffGrid>
      </DiffSection>

      <ComparisonGrid>
        {run1 && (
          <RunPanel isSelected={true}>
            <RunName>{run1.name}</RunName>

            <Section>
              <SectionTitle>Metadata</SectionTitle>
              <MetaGrid>
                <MetaRow>
                  <MetaKey>Status</MetaKey>
                  <MetaValue>{run1.status}</MetaValue>
                </MetaRow>
                <MetaRow>
                  <MetaKey>Seed</MetaKey>
                  <MetaValue>{run1.seed}</MetaValue>
                </MetaRow>
                <MetaRow>
                  <MetaKey>Commit</MetaKey>
                  <MetaValue>{run1.commitHash?.substring(0, 8)}</MetaValue>
                </MetaRow>
                <MetaRow>
                  <MetaKey>Created</MetaKey>
                  <MetaValue>{new Date(run1.createdAt).toLocaleString()}</MetaValue>
                </MetaRow>
              </MetaGrid>
            </Section>

            <Section>
              <SectionTitle>Full Config</SectionTitle>
              <ConfigDisplay>
                {JSON.stringify(run1.config || {}, null, 2)}
              </ConfigDisplay>
            </Section>
          </RunPanel>
        )}

        {run2 && (
          <RunPanel isSelected={true}>
            <RunName>{run2.name}</RunName>

            <Section>
              <SectionTitle>Metadata</SectionTitle>
              <MetaGrid>
                <MetaRow>
                  <MetaKey>Status</MetaKey>
                  <MetaValue>{run2.status}</MetaValue>
                </MetaRow>
                <MetaRow>
                  <MetaKey>Seed</MetaKey>
                  <MetaValue>{run2.seed}</MetaValue>
                </MetaRow>
                <MetaRow>
                  <MetaKey>Commit</MetaKey>
                  <MetaValue>{run2.commitHash?.substring(0, 8)}</MetaValue>
                </MetaRow>
                <MetaRow>
                  <MetaKey>Created</MetaKey>
                  <MetaValue>{new Date(run2.createdAt).toLocaleString()}</MetaValue>
                </MetaRow>
              </MetaGrid>
            </Section>

            <Section>
              <SectionTitle>Full Config</SectionTitle>
              <ConfigDisplay>
                {JSON.stringify(run2.config || {}, null, 2)}
              </ConfigDisplay>
            </Section>
          </RunPanel>
        )}
      </ComparisonGrid>
    </Container>
  );
};

export default Compare;
