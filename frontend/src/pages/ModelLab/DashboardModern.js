import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { API_ENDPOINTS } from '../../config/api';
import {
  AreaChart, Area, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  GlassCard,
  ModernButton,
  StatCard,
  StatIcon,
  StatValue,
  StatLabel,
  StatTrend,
  LoadingDots,
  SearchContainer
} from '../../components/ModernComponents';
import {
  Flask,
  BarChart3,
  CheckCircle2,
  Target,
  Upload,
  Rocket,
  Scale,
  Folder,
  TrendingUp,
  Palette,
  Zap,
  Clock
} from 'lucide-react';

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing?.[8] || "2rem"};
  max-width: 1600px;
  margin: 0 auto;
  min-height: 100vh;
  position: relative;

  /* Animated background gradient */
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      circle at 20% 20%,
      ${({ theme }) => theme.primary?.[500] || '#10b981'}10 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 80%,
      ${({ theme }) => theme.secondary?.[500] || '#a855f7'}10 0%,
      transparent 50%
    );
    pointer-events: none;
    z-index: 0;
    animation: ${({ theme }) => theme.animation?.pulse || 'pulse'} 8s ease-in-out infinite;
  }
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing?.[8] || "2rem"};
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing?.[6] || "1.5rem"};
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const HeaderLeft = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography?.display?.md || '2.25rem'};
  font-weight: ${({ theme }) => theme.fontWeight?.extrabold || 800};
  background: ${({ theme }) => theme.primary?.gradient || 'linear-gradient(135deg, #10b981, #059669)'};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 ${({ theme }) => theme.spacing?.[3] || "0.75rem"} 0;
  line-height: 1.2;
  letter-spacing: -0.03em;
  animation: ${({ theme }) => theme.animation?.slideDown || 'slideInDown'} 0.6s ${({ theme }) => theme.easing?.spring || 'cubic-bezier(0.34, 1.56, 0.64, 1)'};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography?.body?.lg || '1.125rem'};
  color: ${({ theme }) => theme.text_secondary};
  line-height: 1.6;
  margin: 0;
  max-width: 600px;
  animation: ${({ theme }) => theme.animation?.slideDown || 'slideInDown'} 0.6s ${({ theme }) => theme.easing?.spring || 'cubic-bezier(0.34, 1.56, 0.64, 1)'} 0.1s backwards;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing?.[3] || "0.75rem"};
  align-items: flex-start;
  animation: ${({ theme }) => theme.animation?.slideDown || 'slideInDown'} 0.6s ${({ theme }) => theme.easing?.spring || 'cubic-bezier(0.34, 1.56, 0.64, 1)'} 0.2s backwards;
`;

const LastUpdate = styled.div`
  font-size: ${({ theme }) => theme.typography?.body?.sm || '0.875rem'};
  color: ${({ theme }) => theme.text_tertiary};
  background: ${({ theme }) => theme.glass?.light?.background || 'rgba(255, 255, 255, 0.05)'};
  backdrop-filter: ${({ theme }) => theme.glass?.light?.backdropFilter || 'blur(12px)'};
  border: ${({ theme }) => theme.glass?.light?.border || '1px solid rgba(255, 255, 255, 0.1)'};
  padding: ${({ theme }) => `${theme.spacing?.[2] || "0.5rem"} ${theme.spacing?.[4] || "1rem"}`};
  border-radius: ${({ theme }) => theme.borderRadius?.full || '9999px'};
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing?.[2] || "0.5rem"};

  svg {
    width: 1.1em;
    height: 1.1em;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing?.[6] || "1.5rem"};
  margin-bottom: ${({ theme }) => theme.spacing?.[8] || "2rem"};
  position: relative;
  z-index: 1;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ModernStatCard = styled(GlassCard)`
  position: relative;
  overflow: hidden;
  animation: ${({ theme }) => theme.animation?.scaleIn || 'scaleIn'} 0.5s ${({ theme }) => theme.easing?.spring || 'cubic-bezier(0.34, 1.56, 0.64, 1)'} ${({ delay }) => delay || 0}s backwards;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${({ theme, color }) => color || theme.primary?.gradient || 'linear-gradient(135deg, #10b981, #059669)'};
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.6s ${({ theme }) => theme.easing?.spring || 'cubic-bezier(0.34, 1.56, 0.64, 1)'};
  }

  &:hover::before {
    transform: scaleX(1);
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: ${({ theme }) => theme.glass?.medium?.boxShadow || '0 20px 40px rgba(0, 0, 0, 0.3)'};
  }
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing?.[4] || "1rem"};
`;

const ModernStatIcon = styled(StatIcon)`
  background: ${({ theme, color }) => color || theme.primary?.gradient || 'linear-gradient(135deg, #10b981, #059669)'};
  background-size: 200% 200%;
  animation: ${({ theme }) => theme.animation?.gradientShift || 'gradientShift'} 6s ease infinite;
  box-shadow: ${({ theme }) => theme.elevation?.primaryGlow || '0 8px 32px rgba(16, 185, 129, 0.4)'};
  font-size: 1.8rem;
`;

const QuickActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: ${({ theme }) => theme.spacing?.[4] || "1rem"};
  margin-bottom: ${({ theme }) => theme.spacing?.[8] || "2rem"};
  position: relative;
  z-index: 1;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const QuickActionCard = styled(GlassCard)`
  text-align: center;
  cursor: pointer;
  border: 2px solid ${({ theme }) => theme.glass?.light?.border || 'rgba(255, 255, 255, 0.1)'};
  transition: all 0.4s ${({ theme }) => theme.easing?.spring || 'cubic-bezier(0.34, 1.56, 0.64, 1)'};
  animation: ${({ theme }) => theme.animation?.scaleIn || 'scaleIn'} 0.5s ${({ theme }) => theme.easing?.spring || 'cubic-bezier(0.34, 1.56, 0.64, 1)'} ${({ delay }) => delay || 0}s backwards;

  &:hover {
    border-color: ${({ theme }) => theme.primary?.[500] || '#10b981'};
    transform: translateY(-8px) scale(1.02);
    box-shadow: ${({ theme }) => theme.glass?.heavy?.boxShadow || theme.elevation?.primaryGlow || '0 30px 60px rgba(0, 0, 0, 0.4), 0 8px 32px rgba(16, 185, 129, 0.4)'};
  }

  &:active {
    transform: translateY(-4px) scale(1.01);
  }
`;

const QuickActionIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: ${({ theme }) => theme.spacing?.[3] || "0.75rem"};
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
`;

const QuickActionTitle = styled.div`
  font-size: ${({ theme }) => theme.typography?.body?.lg || '1.125rem'};
  font-weight: ${({ theme }) => theme.fontWeight?.semibold || 600};
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: ${({ theme }) => theme.spacing?.[2] || "0.5rem"};
`;

const QuickActionDesc = styled.div`
  font-size: ${({ theme }) => theme.typography?.body?.sm || '0.875rem'};
  color: ${({ theme }) => theme.text_secondary};
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: ${({ theme }) => theme.spacing?.[6] || "1.5rem"};
  margin-bottom: ${({ theme }) => theme.spacing?.[8] || "2rem"};
  position: relative;
  z-index: 1;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled(GlassCard)`
  position: relative;
  animation: ${({ theme }) => theme.animation?.fadeIn || 'fadeIn'} 0.8s ${({ theme }) => theme.easing?.spring || 'cubic-bezier(0.34, 1.56, 0.64, 1)'} ${({ delay }) => delay || 0}s backwards;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing?.[6] || "1.5rem"};
  padding-bottom: ${({ theme }) => theme.spacing?.[4] || "1rem"};
  border-bottom: 2px solid ${({ theme }) => theme.glass?.light?.border || 'rgba(255, 255, 255, 0.1)'};
`;

const ChartTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography?.heading?.md || '1.5rem'};
  font-weight: ${({ theme }) => theme.fontWeight?.bold || 700};
  color: ${({ theme }) => theme.text_primary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing?.[2] || "0.5rem"};
`;

const ChartTitleIcon = styled.span`
  font-size: 1.4em;
`;

const ActivitySection = styled(GlassCard)`
  margin-bottom: ${({ theme }) => theme.spacing?.[8] || "2rem"};
  position: relative;
  z-index: 1;
  animation: ${({ theme }) => theme.animation?.fadeIn || 'fadeIn'} 0.8s ${({ theme }) => theme.easing?.spring || 'cubic-bezier(0.34, 1.56, 0.64, 1)'} 0.6s backwards;
`;

const ActivityHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing?.[6] || "1.5rem"};
  padding-bottom: ${({ theme }) => theme.spacing?.[4] || "1rem"};
  border-bottom: 2px solid ${({ theme }) => theme.glass?.light?.border || 'rgba(255, 255, 255, 0.1)'};
`;

const ActivityTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography?.heading?.md || '1.5rem'};
  font-weight: ${({ theme }) => theme.fontWeight?.bold || 700};
  color: ${({ theme }) => theme.text_primary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing?.[2] || "0.5rem"};
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing?.[3] || "0.75rem"};
`;

const ActivityItem = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing?.[4] || "1rem"};
  padding: ${({ theme }) => theme.spacing?.[4] || "1rem"};
  background: ${({ theme }) => theme.glass?.light?.background || 'rgba(255, 255, 255, 0.05)'};
  backdrop-filter: ${({ theme }) => theme.glass?.light?.backdropFilter || 'blur(12px)'};
  border: ${({ theme }) => theme.glass?.light?.border || '1px solid rgba(255, 255, 255, 0.1)'};
  border-radius: ${({ theme }) => theme.borderRadius?.xl || '0.75rem'};
  transition: all 0.3s ${({ theme }) => theme.easing?.spring || 'cubic-bezier(0.34, 1.56, 0.64, 1)'};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.glass?.medium?.background || 'rgba(255, 255, 255, 0.1)'};
    backdrop-filter: ${({ theme }) => theme.glass?.medium?.backdropFilter || 'blur(16px)'};
    transform: translateX(8px);
    box-shadow: ${({ theme }) => theme.glass?.medium?.boxShadow || '0 20px 40px rgba(0, 0, 0, 0.3)'};
  }
`;

const ActivityIcon = styled.div`
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  background: ${({ type, theme }) => {
    if (type === 'run') return theme.primary?.gradient || 'linear-gradient(135deg, #10b981, #059669)';
    if (type === 'dataset') return theme.secondary?.gradient || 'linear-gradient(135deg, #a855f7, #7c3aed)';
    if (type === 'evaluation') return theme.accent?.gradient || 'linear-gradient(135deg, #06b6d4, #0891b2)';
    return theme.neutral?.[700] || '#4b5563';
  }};
  border-radius: ${({ theme }) => theme.borderRadius?.xl || '0.75rem'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: ${({ theme }) => theme.elevation?.md || '0 4px 6px rgba(0, 0, 0, 0.1)'};
`;

const ActivityContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ActivityText = styled.div`
  font-size: ${({ theme }) => theme.typography?.body?.base || '1rem'};
  font-weight: ${({ theme }) => theme.fontWeight?.medium || 500};
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: ${({ theme }) => theme.spacing?.[1] || '0.25rem'};
`;

const ActivityTime = styled.div`
  font-size: ${({ theme }) => theme.typography?.body?.sm || '0.875rem'};
  color: ${({ theme }) => theme.text_tertiary};
`;

const Badge = styled.span`
  display: inline-block;
  padding: ${({ theme }) => `${theme.spacing?.[1] || "0.25rem"} ${theme.spacing?.[3] || "0.75rem"}`};
  border-radius: ${({ theme }) => theme.borderRadius?.full || '9999px'};
  font-size: ${({ theme }) => theme.typography?.body?.xs || '0.75rem'};
  font-weight: ${({ theme }) => theme.fontWeight?.semibold || 600};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: ${({ variant, theme }) => {
    if (variant === 'success') return theme.success + '20';
    if (variant === 'error') return theme.error + '20';
    if (variant === 'info') return theme.info + '20';
    if (variant === 'warning') return theme.warning + '20';
    return theme.neutral?.[700] || '#4b5563' + '20';
  }};
  color: ${({ variant, theme }) => {
    if (variant === 'success') return theme.success;
    if (variant === 'error') return theme.error;
    if (variant === 'info') return theme.info;
    if (variant === 'warning') return theme.warning;
    return theme.text_secondary;
  }};
  border: 1px solid ${({ variant, theme }) => {
    if (variant === 'success') return theme.success + '40';
    if (variant === 'error') return theme.error + '40';
    if (variant === 'info') return theme.info + '40';
    if (variant === 'warning') return theme.warning + '40';
    return theme.neutral?.[600] || '#6b7280' + '40';
  }};
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: ${({ theme }) => theme.spacing?.[4] || "1rem"};
`;

const LoadingMessage = styled.div`
  font-size: ${({ theme }) => theme.typography?.body?.lg || '1.125rem'};
  color: ${({ theme }) => theme.text_secondary};
  font-weight: ${({ theme }) => theme.fontWeight?.medium || 500};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing?.[12] || '3rem'} ${({ theme }) => theme.spacing?.[6] || "1.5rem"};
  color: ${({ theme }) => theme.text_secondary};
  font-size: ${({ theme }) => theme.typography?.body?.lg || '1.125rem'};
`;

const CHART_COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6'];

const DashboardModern = ({ onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRuns: 0,
    totalDatasets: 0,
    completedRuns: 0,
    avgAccuracy: 0,
    runsTrend: 0,
    datasetsTrend: 0,
    completedTrend: 0,
    accuracyTrend: 0
  });
  const [runsOverTime, setRunsOverTime] = useState([]);
  const [statusDistribution, setStatusDistribution] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const runsResponse = await fetch(API_ENDPOINTS.runs);
      const runsData = await runsResponse.json();
      const runs = runsData.runs || [];

      const datasetsResponse = await fetch(API_ENDPOINTS.datasets);
      const datasetsData = await datasetsResponse.json();
      const datasets = datasetsData.datasets || [];

      const completedRuns = runs.filter(r => r.status === 'completed');
      const avgAccuracy = completedRuns.length > 0
        ? completedRuns.reduce((sum, r) => sum + (r.metrics?.accuracy || 0), 0) / completedRuns.length
        : 0;

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
        completedTrend: completedRuns.length > 0 ? 8 : 0,
        accuracyTrend: avgAccuracy > 0 ? 5.2 : 0
      });

      const now = new Date();
      const last14Days = Array.from({ length: 14 }, (_, i) => {
        const date = new Date(now);
        date.setDate(date.getDate() - (13 - i));
        return date.toISOString().split('T')[0];
      });

      const runsByDate = last14Days.map(date => {
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

      const activities = [];
      runs.slice(0, 5).forEach(run => {
        activities.push({
          type: 'run',
          icon: <Flask className="w-6 h-6" />,
          text: `Run "${run.name}" ${run.status}`,
          time: new Date(run.createdAt),
          badge: run.status
        });
      });

      datasets.slice(0, 3).forEach(dataset => {
        activities.push({
          type: 'dataset',
          icon: <BarChart3 className="w-6 h-6" />,
          text: `Dataset "${dataset.name}" uploaded`,
          time: new Date(dataset.createdAt),
          badge: 'new'
        });
      });

      activities.sort((a, b) => b.time - a.time);
      setRecentActivity(activities.slice(0, 10));

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

  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <LoadingDots />
          <LoadingMessage>Loading your dashboard...</LoadingMessage>
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <Title>ModelLab Dashboard</Title>
          <Subtitle>
            Track your ML experiments with dataset versioning, run tracking, and reproducibility tools.
            View metrics, compare models, and analyze performance.
          </Subtitle>
        </HeaderLeft>
        <HeaderActions>
          <LastUpdate>
            <Clock className="w-4 h-4" />
            {lastUpdate.toLocaleTimeString()}
          </LastUpdate>
          <ModernButton variant="gradient" onClick={fetchDashboardData}>
            Refresh
          </ModernButton>
        </HeaderActions>
      </Header>

      <StatsGrid>
        <ModernStatCard variant="medium" delay={0}>
          <StatHeader>
            <ModernStatIcon color="linear-gradient(135deg, #10b981, #059669)">
              <Flask className="w-8 h-8" />
            </ModernStatIcon>
            {stats.runsTrend > 0 && (
              <StatTrend positive={true}>
                ↑ {stats.runsTrend}%
              </StatTrend>
            )}
          </StatHeader>
          <StatValue>{stats.totalRuns}</StatValue>
          <StatLabel>Total Runs</StatLabel>
        </ModernStatCard>

        <ModernStatCard variant="medium" delay={0.1} color="linear-gradient(135deg, #a855f7, #7c3aed)">
          <StatHeader>
            <ModernStatIcon color="linear-gradient(135deg, #a855f7, #7c3aed)">
              <BarChart3 className="w-8 h-8" />
            </ModernStatIcon>
            {stats.datasetsTrend > 0 && (
              <StatTrend positive={true}>
                ↑ {stats.datasetsTrend}%
              </StatTrend>
            )}
          </StatHeader>
          <StatValue>{stats.totalDatasets}</StatValue>
          <StatLabel>Datasets</StatLabel>
        </ModernStatCard>

        <ModernStatCard variant="medium" delay={0.2} color="linear-gradient(135deg, #06b6d4, #0891b2)">
          <StatHeader>
            <ModernStatIcon color="linear-gradient(135deg, #06b6d4, #0891b2)">
              <CheckCircle2 className="w-8 h-8" />
            </ModernStatIcon>
            {stats.completedTrend > 0 && (
              <StatTrend positive={true}>
                ↑ {stats.completedTrend}%
              </StatTrend>
            )}
          </StatHeader>
          <StatValue>{stats.completedRuns}</StatValue>
          <StatLabel>Completed Runs</StatLabel>
        </ModernStatCard>

        <ModernStatCard variant="medium" delay={0.3} color="linear-gradient(135deg, #10b981, #059669)">
          <StatHeader>
            <ModernStatIcon color="linear-gradient(135deg, #10b981, #059669)">
              <Target className="w-8 h-8" />
            </ModernStatIcon>
            {stats.accuracyTrend > 0 && (
              <StatTrend positive={true}>
                ↑ {stats.accuracyTrend}%
              </StatTrend>
            )}
          </StatHeader>
          <StatValue>{stats.avgAccuracy}%</StatValue>
          <StatLabel>Avg Accuracy</StatLabel>
        </ModernStatCard>
      </StatsGrid>

      <QuickActionsGrid>
        <QuickActionCard
          variant="medium"
          delay={0.3}
          onClick={() => onNavigate && onNavigate('datasets')}
        >
          <QuickActionIcon><Upload className="w-10 h-10" /></QuickActionIcon>
          <QuickActionTitle>Upload Dataset</QuickActionTitle>
          <QuickActionDesc>Add new training data</QuickActionDesc>
        </QuickActionCard>

        <QuickActionCard
          variant="medium"
          delay={0.4}
          onClick={() => onNavigate && onNavigate('runs')}
        >
          <QuickActionIcon><Rocket className="w-10 h-10" /></QuickActionIcon>
          <QuickActionTitle>Create Run</QuickActionTitle>
          <QuickActionDesc>Start new experiment</QuickActionDesc>
        </QuickActionCard>

        <QuickActionCard
          variant="medium"
          delay={0.5}
          onClick={() => onNavigate && onNavigate('compare')}
        >
          <QuickActionIcon><Scale className="w-10 h-10" /></QuickActionIcon>
          <QuickActionTitle>Compare Runs</QuickActionTitle>
          <QuickActionDesc>Analyze performance</QuickActionDesc>
        </QuickActionCard>

        <QuickActionCard
          variant="medium"
          delay={0.6}
          onClick={() => onNavigate && onNavigate('projects')}
        >
          <QuickActionIcon><Folder className="w-10 h-10" /></QuickActionIcon>
          <QuickActionTitle>View Projects</QuickActionTitle>
          <QuickActionDesc>Organize experiments</QuickActionDesc>
        </QuickActionCard>
      </QuickActionsGrid>

      <ChartsGrid>
        <ChartCard variant="medium" delay={0.4}>
          <ChartHeader>
            <ChartTitle>
              <ChartTitleIcon><TrendingUp className="w-6 h-6" /></ChartTitleIcon>
              Runs Over Time
            </ChartTitle>
          </ChartHeader>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={runsOverTime}>
              <defs>
                <linearGradient id="colorRuns" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" />
              <XAxis dataKey="date" stroke="#888" style={{ fontSize: '12px' }} />
              <YAxis stroke="#888" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(10, 10, 15, 0.95)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="runs"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRuns)"
                name="Total Runs"
              />
              <Area
                type="monotone"
                dataKey="completed"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCompleted)"
                name="Completed"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard variant="medium" delay={0.5}>
          <ChartHeader>
            <ChartTitle>
              <ChartTitleIcon><Palette className="w-6 h-6" /></ChartTitleIcon>
              Status Distribution
            </ChartTitle>
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
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(10, 10, 15, 0.95)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </ChartsGrid>

      <ActivitySection variant="medium">
        <ActivityHeader>
          <ActivityTitle>
            <Zap className="w-6 h-6" />
            Recent Activity
          </ActivityTitle>
        </ActivityHeader>
        {recentActivity.length > 0 ? (
          <ActivityList>
            {recentActivity.map((activity, idx) => (
              <ActivityItem key={idx}>
                <ActivityIcon type={activity.type}>
                  {activity.icon}
                </ActivityIcon>
                <ActivityContent>
                  <ActivityText>
                    {activity.text}{' '}
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

export default DashboardModern;
