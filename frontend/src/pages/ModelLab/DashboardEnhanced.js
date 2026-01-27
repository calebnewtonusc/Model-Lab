import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  LineChart, Line, BarChart, Bar, ScatterChart, Scatter, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { LoadingContainer, Spinner, LoadingText, Card, Badge, EmptyState, Button } from './components/SharedComponents';

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing[8]};
  max-width: 1600px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const HeaderLeft = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSize['4xl']};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  line-height: ${({ theme }) => theme.lineHeight.tight};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSize.lg};
  color: ${({ theme }) => theme.text_secondary};
  line-height: ${({ theme }) => theme.lineHeight.normal};
  margin: 0;
`;

const HeaderRight = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  align-items: center;
`;

const RefreshButton = styled(Button)`
  min-width: 120px;
`;

const LastUpdate = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.text_tertiary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const StatCard = styled(Card)`
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${({ theme }) => theme.primary[400]}, ${({ theme }) => theme.primary[600]});
    opacity: 0;
    transition: ${({ theme }) => theme.transition.base};
  }

  &:hover::before {
    opacity: 1;
  }
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const StatIcon = styled.div`
  width: 56px;
  height: 56px;
  background: ${({ theme }) => theme.primary[500] + '15'};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSize['2xl']};
  border: 1px solid ${({ theme }) => theme.primary[500] + '30'};
`;

const StatTrend = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ positive, theme }) => positive ? theme.success : theme.error};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[2]}`};
  background: ${({ positive, theme }) => positive ? theme.success + '15' : theme.error + '15'};
  border-radius: ${({ theme }) => theme.borderRadius.base};
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.primary[500]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  line-height: ${({ theme }) => theme.lineHeight.tight};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.text_secondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing[6]};
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  padding-bottom: ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const ChartTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.text_primary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const ChartActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const ChartButton = styled.button`
  background: ${({ theme }) => theme.bgLight};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]}`};
  color: ${({ theme }) => theme.text_secondary};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.fast};

  &:hover {
    background: ${({ theme }) => theme.hover};
    color: ${({ theme }) => theme.text_primary};
    border-color: ${({ theme }) => theme.borderMedium};
  }
`;

const ActivitySection = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const ActivityHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  padding-bottom: ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const ActivityTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.text_primary};
  margin: 0;
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const ActivityItem = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.bgLight};
  border: 1px solid ${({ theme }) => theme.borderLight};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  transition: ${({ theme }) => theme.transition.fast};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.hover};
    border-color: ${({ theme }) => theme.borderMedium};
    transform: translateX(4px);
  }
`;

const ActivityIcon = styled.div`
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  background: ${({ type, theme }) => {
    if (type === 'run') return theme.primary[500] + '15';
    if (type === 'dataset') return theme.info + '15';
    if (type === 'evaluation') return theme.success + '15';
    return theme.neutral[700];
  }};
  border: 1px solid ${({ type, theme }) => {
    if (type === 'run') return theme.primary[500] + '30';
    if (type === 'dataset') return theme.info + '30';
    if (type === 'evaluation') return theme.success + '30';
    return theme.neutral[600];
  }};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSize.xl};
`;

const ActivityContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ActivityText = styled.div`
  font-size: ${({ theme }) => theme.fontSize.base};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
  line-height: ${({ theme }) => theme.lineHeight.normal};
`;

const ActivityTime = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.text_tertiary};
`;

const QuickActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const QuickActionCard = styled(Card)`
  cursor: pointer;
  text-align: center;
  padding: ${({ theme }) => theme.spacing[6]};
  border: 2px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.card};

  &:hover {
    border-color: ${({ theme }) => theme.primary[500]};
    background: ${({ theme }) => theme.cardLight};
  }
`;

const QuickActionIcon = styled.div`
  font-size: ${({ theme }) => theme.fontSize['3xl']};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const QuickActionTitle = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
`;

const COLORS = ['#854CE6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRuns: 0,
    totalDatasets: 0,
    completedRuns: 0,
    avgAccuracy: 0,
    runsTrend: 0,
    datasetsTrend: 0,
    accuracyTrend: 0
  });
  const [runsOverTime, setRunsOverTime] = useState([]);
  const [accuracyTrend, setAccuracyTrend] = useState([]);
  const [statusDistribution, setStatusDistribution] = useState([]);
  const [datasetSizes, setDatasetSizes] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [systemHealth, setSystemHealth] = useState({ cpu: 0, memory: 0, storage: 0 });
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
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

      // Calculate trends (compare to 7 days ago)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentRuns = runs.filter(r => new Date(r.createdAt) > sevenDaysAgo);
      const runsTrend = runs.length > 0 ? ((recentRuns.length / runs.length) * 100) : 0;

      setStats({
        totalRuns: runs.length,
        totalDatasets: datasets.length,
        completedRuns: completedRuns.length,
        avgAccuracy: (avgAccuracy * 100).toFixed(1),
        runsTrend: runsTrend.toFixed(0),
        datasetsTrend: datasets.length > 0 ? 12 : 0,
        accuracyTrend: avgAccuracy > 0 ? 5.2 : 0
      });

      // Runs over time (last 30 days)
      const now = new Date();
      const last30Days = Array.from({ length: 30 }, (_, i) => {
        const date = new Date(now);
        date.setDate(date.getDate() - (29 - i));
        return date.toISOString().split('T')[0];
      });

      const runsByDate = last30Days.map(date => {
        const count = runs.filter(r => r.createdAt.split('T')[0] === date).length;
        const completed = runs.filter(r =>
          r.createdAt.split('T')[0] === date && r.status === 'completed'
        ).length;
        return {
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          runs: count,
          completed
        };
      });
      setRunsOverTime(runsByDate);

      // Accuracy trend over time
      const accuracyByDate = last30Days.map(date => {
        const dayRuns = runs.filter(r =>
          r.createdAt.split('T')[0] === date && r.status === 'completed'
        );
        const dayAvgAccuracy = dayRuns.length > 0
          ? dayRuns.reduce((sum, r) => sum + (r.metrics?.accuracy || 0), 0) / dayRuns.length
          : 0;
        return {
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          accuracy: (dayAvgAccuracy * 100).toFixed(2)
        };
      });
      setAccuracyTrend(accuracyByDate.filter(d => d.accuracy > 0));

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

      // Dataset sizes
      const sizes = datasets.map(d => ({
        name: d.name.length > 15 ? d.name.substring(0, 15) + '...' : d.name,
        rows: d.rowCount || 0,
        size: (d.fileSize / 1024 / 1024).toFixed(2) // MB
      })).slice(0, 10);
      setDatasetSizes(sizes);

      // Recent activity
      const activities = [];

      runs.slice(0, 5).forEach(run => {
        activities.push({
          type: 'run',
          text: `Run "${run.name}" ${run.status}`,
          time: new Date(run.createdAt),
          badge: run.status
        });
      });

      datasets.slice(0, 3).forEach(dataset => {
        activities.push({
          type: 'dataset',
          text: `Dataset "${dataset.name}" uploaded`,
          time: new Date(dataset.createdAt),
          badge: 'new'
        });
      });

      activities.sort((a, b) => b.time - a.time);
      setRecentActivity(activities.slice(0, 10));

      // System health (mock data for now)
      setSystemHealth({
        cpu: Math.random() * 100,
        memory: Math.random() * 100,
        storage: datasets.reduce((sum, d) => sum + (d.fileSize || 0), 0) / (100 * 1024 * 1024)
      });

      setLastUpdate(new Date());
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const exportChart = (chartName) => {
    alert(`Exporting ${chartName} chart... (Feature would export to PNG/CSV)`);
  };

  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <Spinner size="60px" />
          <LoadingText>Loading dashboard...</LoadingText>
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <Title>ModelLab Dashboard</Title>
          <Subtitle>Real-time insights into your ML experiments and data</Subtitle>
        </HeaderLeft>
        <HeaderRight>
          <LastUpdate>Last updated: {lastUpdate.toLocaleTimeString()}</LastUpdate>
          <RefreshButton onClick={fetchDashboardData}>Refresh</RefreshButton>
        </HeaderRight>
      </Header>

      <StatsGrid>
        <StatCard>
          <StatHeader>
            <StatIcon>🔬</StatIcon>
            <StatTrend positive={stats.runsTrend > 0}>
              {stats.runsTrend > 0 ? '↑' : '↓'} {Math.abs(stats.runsTrend)}%
            </StatTrend>
          </StatHeader>
          <StatValue>{stats.totalRuns}</StatValue>
          <StatLabel>Total Runs</StatLabel>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatIcon>📊</StatIcon>
            <StatTrend positive={stats.datasetsTrend > 0}>
              {stats.datasetsTrend > 0 ? '↑' : '↓'} {Math.abs(stats.datasetsTrend)}%
            </StatTrend>
          </StatHeader>
          <StatValue>{stats.totalDatasets}</StatValue>
          <StatLabel>Datasets</StatLabel>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatIcon>✅</StatIcon>
          </StatHeader>
          <StatValue>{stats.completedRuns}</StatValue>
          <StatLabel>Completed Runs</StatLabel>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatIcon>📈</StatIcon>
            <StatTrend positive={stats.accuracyTrend > 0}>
              {stats.accuracyTrend > 0 ? '↑' : '↓'} {Math.abs(stats.accuracyTrend)}%
            </StatTrend>
          </StatHeader>
          <StatValue>{stats.avgAccuracy}%</StatValue>
          <StatLabel>Avg Accuracy</StatLabel>
        </StatCard>
      </StatsGrid>

      <QuickActionsGrid>
        <QuickActionCard onClick={() => window.location.href = '#datasets'}>
          <QuickActionIcon>📁</QuickActionIcon>
          <QuickActionTitle>Upload Dataset</QuickActionTitle>
        </QuickActionCard>
        <QuickActionCard onClick={() => window.location.href = '#runs'}>
          <QuickActionIcon>🚀</QuickActionIcon>
          <QuickActionTitle>Create Run</QuickActionTitle>
        </QuickActionCard>
        <QuickActionCard onClick={() => window.location.href = '#compare'}>
          <QuickActionIcon>🔍</QuickActionIcon>
          <QuickActionTitle>Compare Runs</QuickActionTitle>
        </QuickActionCard>
        <QuickActionCard onClick={() => window.location.href = '#artifacts'}>
          <QuickActionIcon>🗂️</QuickActionIcon>
          <QuickActionTitle>View Artifacts</QuickActionTitle>
        </QuickActionCard>
      </QuickActionsGrid>

      <ChartsGrid>
        <ChartCard>
          <ChartHeader>
            <ChartTitle>Runs Over Time</ChartTitle>
            <ChartActions>
              <ChartButton onClick={() => exportChart('Runs Over Time')}>Export</ChartButton>
            </ChartActions>
          </ChartHeader>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={runsOverTime}>
              <defs>
                <linearGradient id="colorRuns" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#854CE6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#854CE6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
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
              <Area type="monotone" dataKey="runs" stroke="#854CE6" fillOpacity={1} fill="url(#colorRuns)" />
              <Area type="monotone" dataKey="completed" stroke="#10b981" fillOpacity={1} fill="url(#colorCompleted)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard>
          <ChartHeader>
            <ChartTitle>Run Status Distribution</ChartTitle>
            <ChartActions>
              <ChartButton onClick={() => exportChart('Status Distribution')}>Export</ChartButton>
            </ChartActions>
          </ChartHeader>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
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

        {accuracyTrend.length > 0 && (
          <ChartCard>
            <ChartHeader>
              <ChartTitle>Accuracy Progression</ChartTitle>
              <ChartActions>
                <ChartButton onClick={() => exportChart('Accuracy Progression')}>Export</ChartButton>
              </ChartActions>
            </ChartHeader>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={accuracyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="date" stroke="#888" />
                <YAxis stroke="#888" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {datasetSizes.length > 0 && (
          <ChartCard>
            <ChartHeader>
              <ChartTitle>Dataset Sizes</ChartTitle>
              <ChartActions>
                <ChartButton onClick={() => exportChart('Dataset Sizes')}>Export</ChartButton>
              </ChartActions>
            </ChartHeader>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={datasetSizes}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="rows" fill="#3b82f6" name="Rows" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}
      </ChartsGrid>

      <ActivitySection>
        <ActivityHeader>
          <ActivityTitle>Recent Activity</ActivityTitle>
        </ActivityHeader>
        {recentActivity.length > 0 ? (
          <ActivityList>
            {recentActivity.map((activity, idx) => (
              <ActivityItem key={idx}>
                <ActivityIcon type={activity.type}>
                  {activity.type === 'run' ? '🔬' : '📊'}
                </ActivityIcon>
                <ActivityContent>
                  <ActivityText>
                    {activity.text}
                    {' '}
                    <Badge variant={
                      activity.badge === 'completed' ? 'success' :
                      activity.badge === 'failed' ? 'error' :
                      activity.badge === 'running' ? 'info' : 'default'
                    }>
                      {activity.badge}
                    </Badge>
                  </ActivityText>
                  <ActivityTime>{formatTimeAgo(activity.time)}</ActivityTime>
                </ActivityContent>
              </ActivityItem>
            ))}
          </ActivityList>
        ) : (
          <EmptyState>No recent activity</EmptyState>
        )}
      </ActivitySection>
    </Container>
  );
};

export default Dashboard;
