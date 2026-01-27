import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Container = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.text_secondary};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.card};
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.text_primary + '12'};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text_secondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const ChartCard = styled.div`
  background: ${({ theme }) => theme.card};
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.text_primary + '12'};
`;

const ChartTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 1.5rem;
`;

const RecentRunsSection = styled.div`
  background: ${({ theme }) => theme.card};
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.text_primary + '12'};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 0.75rem;
  border-bottom: 2px solid ${({ theme }) => theme.text_primary + '12'};
  color: ${({ theme }) => theme.text_secondary};
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Td = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid ${({ theme }) => theme.text_primary + '08'};
  color: ${({ theme }) => theme.text_primary};
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ status, theme }) => {
    switch (status) {
      case 'completed': return theme.primary + '20';
      case 'running': return '#3b82f6' + '20';
      case 'failed': return '#ef4444' + '20';
      default: return theme.text_secondary + '20';
    }
  }};
  color: ${({ status, theme }) => {
    switch (status) {
      case 'completed': return theme.primary;
      case 'running': return '#3b82f6';
      case 'failed': return '#ef4444';
      default: return theme.text_secondary;
    }
  }};
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }) => theme.text_secondary};
  font-size: 1.125rem;
`;

const COLORS = ['#854CE6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRuns: 0,
    totalDatasets: 0,
    completedRuns: 0,
    avgAccuracy: 0
  });
  const [recentRuns, setRecentRuns] = useState([]);
  const [runsOverTime, setRunsOverTime] = useState([]);
  const [statusDistribution, setStatusDistribution] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch runs
      const runsResponse = await fetch('/api/modellab/runs');
      const runsData = await runsResponse.json();
      const runs = runsData.runs || [];

      // Fetch datasets
      const datasetsResponse = await fetch('/api/modellab/datasets');
      const datasetsData = await datasetsResponse.json();
      const datasets = datasetsData.datasets || [];

      // Calculate stats
      const completedRuns = runs.filter(r => r.status === 'completed');
      const avgAccuracy = completedRuns.length > 0
        ? completedRuns.reduce((sum, r) => sum + (r.metrics?.accuracy || 0), 0) / completedRuns.length
        : 0;

      setStats({
        totalRuns: runs.length,
        totalDatasets: datasets.length,
        completedRuns: completedRuns.length,
        avgAccuracy: (avgAccuracy * 100).toFixed(1)
      });

      // Recent runs (last 10)
      const sortedRuns = [...runs].sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setRecentRuns(sortedRuns.slice(0, 10));

      // Runs over time (last 7 days)
      const now = new Date();
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(now);
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split('T')[0];
      });

      const runsByDate = last7Days.map(date => {
        const count = runs.filter(r =>
          r.createdAt.split('T')[0] === date
        ).length;
        return {
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          runs: count
        };
      });
      setRunsOverTime(runsByDate);

      // Status distribution
      const statusCounts = {
        completed: runs.filter(r => r.status === 'completed').length,
        running: runs.filter(r => r.status === 'running').length,
        failed: runs.filter(r => r.status === 'failed').length,
        pending: runs.filter(r => r.status === 'pending').length
      };

      const distribution = Object.entries(statusCounts)
        .filter(([_, count]) => count > 0)
        .map(([status, count]) => ({
          name: status.charAt(0).toUpperCase() + status.slice(1),
          value: count
        }));
      setStatusDistribution(distribution);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingText>Loading dashboard...</LoadingText>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>ModelLab Dashboard</Title>
        <Subtitle>Track your ML experiments, datasets, and model performance</Subtitle>
      </Header>

      <StatsGrid>
        <StatCard>
          <StatValue>{stats.totalRuns}</StatValue>
          <StatLabel>Total Runs</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.totalDatasets}</StatValue>
          <StatLabel>Datasets</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.completedRuns}</StatValue>
          <StatLabel>Completed Runs</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.avgAccuracy}%</StatValue>
          <StatLabel>Avg Accuracy</StatLabel>
        </StatCard>
      </StatsGrid>

      <ChartsGrid>
        <ChartCard>
          <ChartTitle>Runs Over Time</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={runsOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="date" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="runs" stroke="#854CE6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard>
          <ChartTitle>Run Status Distribution</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </ChartsGrid>

      <RecentRunsSection>
        <ChartTitle>Recent Runs</ChartTitle>
        <Table>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Status</Th>
              <Th>Accuracy</Th>
              <Th>Dataset</Th>
              <Th>Created</Th>
            </tr>
          </thead>
          <tbody>
            {recentRuns.map(run => (
              <tr key={run.id}>
                <Td>{run.name}</Td>
                <Td>
                  <StatusBadge status={run.status}>
                    {run.status}
                  </StatusBadge>
                </Td>
                <Td>
                  {run.metrics?.accuracy
                    ? (run.metrics.accuracy * 100).toFixed(2) + '%'
                    : '-'}
                </Td>
                <Td>{run.datasetId ? 'Linked' : 'None'}</Td>
                <Td>{new Date(run.createdAt).toLocaleDateString()}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </RecentRunsSection>
    </Container>
  );
};

export default Dashboard;
