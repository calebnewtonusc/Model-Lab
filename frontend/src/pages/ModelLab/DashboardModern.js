import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { API_ENDPOINTS } from '../../config/api';
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { LoadingDots } from '../../components/ModernComponents';
import {
  Beaker,
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
  Clock,
  ArrowUpRight
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────────────────
   Design tokens (local — no theme dependency for this page)
───────────────────────────────────────────────────────────────────────────── */

const T = {
  bg: '#f2f2f7',
  card: '#ffffff',
  textPrimary: '#1c1c1e',
  textSecondary: '#3a3a3c',
  textMuted: '#8e8e93',
  accent: '#6366f1',
  accentViolet: '#8b5cf6',
  separator: 'rgba(60, 60, 67, 0.12)',
  separatorMedium: 'rgba(60, 60, 67, 0.18)',
  cardShadow: '0 2px 16px rgba(0, 0, 0, 0.08)',
  cardBorder: '0.5px solid rgba(60, 60, 67, 0.10)',
};

const PIE_COLORS = ['#6366f1', '#8b5cf6', '#ef4444', '#f59e0b', '#34c759'];

/* ─────────────────────────────────────────────────────────────────────────────
   Page shell
───────────────────────────────────────────────────────────────────────────── */

const PageWrap = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px 64px;
`;

/* ─────────────────────────────────────────────────────────────────────────────
   Loading / Empty
───────────────────────────────────────────────────────────────────────────── */

const LoadingWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 16px;
`;

const LoadingMsg = styled.p`
  font-size: 16px;
  font-weight: 500;
  color: ${T.textMuted};
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
`;

/* ─────────────────────────────────────────────────────────────────────────────
   Page Header
───────────────────────────────────────────────────────────────────────────── */

const Header = styled.div`
  margin-bottom: 36px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 24px;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const HeaderLeft = styled.div``;

const PageTitle = styled.h1`
  font-size: 52px;
  font-weight: 800;
  letter-spacing: -2px;
  color: ${T.textPrimary};
  line-height: 1.05;
  margin-bottom: 8px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;

  /* Fade in down on mount */
  animation: slideInDown 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;

  @keyframes slideInDown {
    from { opacity: 0; transform: translateY(-14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const PageSubtitle = styled.p`
  font-size: 16px;
  font-weight: 400;
  color: ${T.textMuted};
  line-height: 1.55;
  max-width: 520px;
  animation: slideInDown 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.07s both;

  @keyframes slideInDown {
    from { opacity: 0; transform: translateY(-12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
`;

const TimestampPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  background: ${T.card};
  border: ${T.cardBorder};
  border-radius: 9999px;
  box-shadow: ${T.cardShadow};
  font-size: 13px;
  font-weight: 500;
  color: ${T.textMuted};
  white-space: nowrap;

  svg {
    width: 13px;
    height: 13px;
    color: ${T.textMuted};
  }
`;

const RefreshBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 16px;
  background: ${T.accent};
  border: none;
  border-radius: 9999px;
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
  cursor: pointer;
  transition: opacity 0.18s ease, transform 0.18s ease;
  white-space: nowrap;

  &:hover  { opacity: 0.88; }
  &:active { transform: scale(0.97); }
`;

/* ─────────────────────────────────────────────────────────────────────────────
   Section Label
───────────────────────────────────────────────────────────────────────────── */

const SectionLabel = styled.p`
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${T.textMuted};
  margin-bottom: 14px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
`;

/* ─────────────────────────────────────────────────────────────────────────────
   Stats Row — 4-up metric cards
───────────────────────────────────────────────────────────────────────────── */

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 40px;

  @media (max-width: 900px)  { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 500px)  { grid-template-columns: 1fr; }
`;

const StatCard = styled.div`
  background: ${T.card};
  border-radius: 16px;
  border: ${T.cardBorder};
  box-shadow: ${T.cardShadow};
  padding: 20px 22px 22px;
  transition: transform 0.22s ease, box-shadow 0.22s ease;
  animation: fadeInUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${({ delay }) => delay || 0}s both;

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 28px rgba(0, 0, 0, 0.11);
  }
`;

const StatTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const StatIconWrap = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: ${({ gradient }) => gradient || `linear-gradient(135deg, #6366f1, #8b5cf6)`};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  flex-shrink: 0;

  svg {
    width: 18px;
    height: 18px;
  }
`;

const StatTrendBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ positive }) => positive ? '#34c759' : '#ff3b30'};
  background: ${({ positive }) => positive ? 'rgba(52, 199, 89, 0.10)' : 'rgba(255, 59, 48, 0.10)'};
  border-radius: 9999px;
  padding: 3px 8px;
`;

const StatValueText = styled.div`
  font-size: 36px;
  font-weight: 800;
  letter-spacing: -1.5px;
  color: ${({ accent }) => accent || T.accent};
  line-height: 1;
  margin-bottom: 4px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
`;

const StatLabelText = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: ${T.textMuted};
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
`;

/* ─────────────────────────────────────────────────────────────────────────────
   Quick Actions Row
───────────────────────────────────────────────────────────────────────────── */

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 40px;

  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 500px) { grid-template-columns: 1fr; }
`;

const ActionCard = styled.button`
  background: ${T.card};
  border: ${T.cardBorder};
  border-radius: 16px;
  box-shadow: ${T.cardShadow};
  padding: 22px 20px;
  cursor: pointer;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
  animation: fadeInUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${({ delay }) => delay || 0}s both;

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 28px rgba(0, 0, 0, 0.11);
    border-color: rgba(99, 102, 241, 0.30);
  }

  &:active {
    transform: translateY(-1px);
    box-shadow: ${T.cardShadow};
  }
`;

const ActionIconWrap = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${({ gradient }) => gradient || `linear-gradient(135deg, #6366f1, #8b5cf6)`};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const ActionTitle = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: ${T.textPrimary};
  letter-spacing: -0.2px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
`;

const ActionDesc = styled.div`
  font-size: 13px;
  font-weight: 400;
  color: ${T.textMuted};
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
`;

/* ─────────────────────────────────────────────────────────────────────────────
   Charts Row
───────────────────────────────────────────────────────────────────────────── */

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 16px;
  margin-bottom: 40px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: ${T.card};
  border-radius: 20px;
  border: ${T.cardBorder};
  box-shadow: ${T.cardShadow};
  padding: 24px;
  animation: fadeInUp 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${({ delay }) => delay || 0}s both;

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const ChartCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 0.5px solid ${T.separator};
`;

const ChartCardTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.4px;
  color: ${T.textPrimary};
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;

  svg {
    width: 18px;
    height: 18px;
    color: ${T.accent};
  }
`;

/* ─────────────────────────────────────────────────────────────────────────────
   Activity Feed
───────────────────────────────────────────────────────────────────────────── */

const ActivityCard = styled.div`
  background: ${T.card};
  border-radius: 20px;
  border: ${T.cardBorder};
  box-shadow: ${T.cardShadow};
  padding: 24px;
  margin-bottom: 40px;
  animation: fadeInUp 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.35s both;

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const ActivityHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 14px;
  border-bottom: 0.5px solid ${T.separator};
`;

const ActivityTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.4px;
  color: ${T.textPrimary};
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;

  svg {
    width: 18px;
    height: 18px;
    color: ${T.accent};
  }
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ActivityRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 14px;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.18s ease;

  &:hover {
    background: rgba(60, 60, 67, 0.04);
  }
`;

const ActivityIconWrap = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  flex-shrink: 0;
  background: ${({ type }) => {
    if (type === 'run')       return 'linear-gradient(135deg, #6366f1, #8b5cf6)';
    if (type === 'dataset')   return 'linear-gradient(135deg, #8b5cf6, #7c3aed)';
    if (type === 'evaluation') return 'linear-gradient(135deg, #06b6d4, #0891b2)';
    return '#e5e5ea';
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;

  svg {
    width: 18px;
    height: 18px;
  }
`;

const ActivityContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ActivityText = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${T.textPrimary};
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
`;

const ActivityTime = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: ${T.textMuted};
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  flex-shrink: 0;

  background: ${({ variant }) => {
    if (variant === 'success') return 'rgba(52, 199, 89, 0.12)';
    if (variant === 'error')   return 'rgba(255, 59, 48, 0.12)';
    if (variant === 'info')    return 'rgba(99, 102, 241, 0.12)';
    if (variant === 'warning') return 'rgba(255, 149, 0, 0.12)';
    return 'rgba(60, 60, 67, 0.08)';
  }};

  color: ${({ variant }) => {
    if (variant === 'success') return '#248a3d';
    if (variant === 'error')   return '#c0392b';
    if (variant === 'info')    return '#4f46e5';
    if (variant === 'warning') return '#c0720a';
    return T.textMuted;
  }};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: ${T.textMuted};
  font-size: 15px;
  font-weight: 400;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
`;

/* ─────────────────────────────────────────────────────────────────────────────
   Chart tooltip style (recharts)
───────────────────────────────────────────────────────────────────────────── */

const tooltipStyle = {
  contentStyle: {
    backgroundColor: '#ffffff',
    border: '0.5px solid rgba(60, 60, 67, 0.18)',
    borderRadius: 12,
    boxShadow: '0 4px 20px rgba(0,0,0,0.10)',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
    fontSize: 13,
    color: '#1c1c1e',
  },
  itemStyle: { color: '#3a3a3c' },
  labelStyle: { fontWeight: 600, color: '#1c1c1e' },
};

/* ─────────────────────────────────────────────────────────────────────────────
   Stat card definitions
───────────────────────────────────────────────────────────────────────────── */

const STAT_DEFS = [
  {
    key: 'totalRuns',
    label: 'Total Runs',
    trendKey: 'runsTrend',
    accent: T.accent,
    gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    Icon: Beaker,
    delay: 0,
  },
  {
    key: 'totalDatasets',
    label: 'Datasets',
    trendKey: 'datasetsTrend',
    accent: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    Icon: BarChart3,
    delay: 0.08,
  },
  {
    key: 'completedRuns',
    label: 'Completed Runs',
    trendKey: 'completedTrend',
    accent: '#06b6d4',
    gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)',
    Icon: CheckCircle2,
    delay: 0.16,
  },
  {
    key: 'avgAccuracy',
    label: 'Avg Accuracy',
    trendKey: 'accuracyTrend',
    accent: '#34c759',
    gradient: 'linear-gradient(135deg, #34c759, #248a3d)',
    Icon: Target,
    suffix: '%',
    delay: 0.24,
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   Action card definitions
───────────────────────────────────────────────────────────────────────────── */

const ACTION_DEFS = [
  {
    id: 'datasets',
    title: 'Upload Dataset',
    desc: 'Add new training data',
    gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    Icon: Upload,
    delay: 0.28,
  },
  {
    id: 'runs',
    title: 'New Run',
    desc: 'Start an experiment',
    gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    Icon: Rocket,
    delay: 0.34,
  },
  {
    id: 'compare',
    title: 'Compare Runs',
    desc: 'Analyse performance',
    gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)',
    Icon: Scale,
    delay: 0.40,
  },
  {
    id: 'projects',
    title: 'View Projects',
    desc: 'Organise experiments',
    gradient: 'linear-gradient(135deg, #34c759, #248a3d)',
    Icon: Folder,
    delay: 0.46,
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────────────────────────── */

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
    accuracyTrend: 0,
  });
  const [runsOverTime, setRunsOverTime] = useState([]);
  const [statusDistribution, setStatusDistribution] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchDashboardData = async () => {
    try {
      const runsResponse = await fetch(API_ENDPOINTS.runs);
      const runsData = await runsResponse.json();
      const runs = runsData.runs || [];

      const datasetsResponse = await fetch(API_ENDPOINTS.datasets);
      const datasetsData = await datasetsResponse.json();
      const datasets = datasetsData.datasets || [];

      const completedRuns = runs.filter(r => r.status === 'completed');
      const avgAccuracy =
        completedRuns.length > 0
          ? completedRuns.reduce((sum, r) => sum + (r.metrics?.accuracy || 0), 0) /
            completedRuns.length
          : 0;

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentRuns = runs.filter(r => new Date(r.createdAt) > sevenDaysAgo);
      const runsTrend =
        runs.length > 0 ? ((recentRuns.length / runs.length) * 100) : 0;

      setStats({
        totalRuns: runs.length,
        totalDatasets: datasets.length,
        completedRuns: completedRuns.length,
        avgAccuracy: (avgAccuracy * 100).toFixed(1),
        runsTrend: runsTrend.toFixed(0),
        datasetsTrend: datasets.length > 0 ? 12 : 0,
        completedTrend: completedRuns.length > 0 ? 8 : 0,
        accuracyTrend: avgAccuracy > 0 ? 5.2 : 0,
      });

      // Runs over time (14 days)
      const now = new Date();
      const last14Days = Array.from({ length: 14 }, (_, i) => {
        const date = new Date(now);
        date.setDate(date.getDate() - (13 - i));
        return date.toISOString().split('T')[0];
      });

      const runsByDate = last14Days.map(date => {
        const count = runs.filter(r => r.createdAt.split('T')[0] === date).length;
        const completed = runs.filter(
          r => r.createdAt.split('T')[0] === date && r.status === 'completed'
        ).length;
        return {
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          runs: count,
          completed,
        };
      });
      setRunsOverTime(runsByDate);

      // Status distribution pie
      const statusCounts = {
        completed: runs.filter(r => r.status === 'completed').length,
        running:   runs.filter(r => r.status === 'running').length,
        failed:    runs.filter(r => r.status === 'failed').length,
        pending:   runs.filter(r => r.status === 'pending').length,
      };
      const distribution = Object.entries(statusCounts)
        .filter(([, count]) => count > 0)
        .map(([status, count]) => ({
          name: status.charAt(0).toUpperCase() + status.slice(1),
          value: count,
        }));
      setStatusDistribution(distribution);

      // Recent activity
      const activities = [];
      runs.slice(0, 5).forEach(run => {
        activities.push({
          type: 'run',
          icon: <Beaker />,
          text: `Run "${run.name}" ${run.status}`,
          time: new Date(run.createdAt),
          badge: run.status,
        });
      });
      datasets.slice(0, 3).forEach(dataset => {
        activities.push({
          type: 'dataset',
          icon: <BarChart3 />,
          text: `Dataset "${dataset.name}" uploaded`,
          time: new Date(dataset.createdAt),
          badge: 'new',
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
    if (seconds < 60)  return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60)  return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24)    return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const badgeVariant = (badge) => {
    if (badge === 'completed') return 'success';
    if (badge === 'failed')    return 'error';
    if (badge === 'running')   return 'info';
    if (badge === 'warning')   return 'warning';
    return 'default';
  };

  /* ── Loading State ──────────────────────────────────────────────────────── */
  if (loading) {
    return (
      <PageWrap>
        <LoadingWrap>
          <LoadingDots />
          <LoadingMsg>Loading your dashboard…</LoadingMsg>
        </LoadingWrap>
      </PageWrap>
    );
  }

  /* ── Main Render ────────────────────────────────────────────────────────── */
  return (
    <PageWrap>

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <Header>
        <HeaderLeft>
          <PageTitle>ModelLab</PageTitle>
          <PageSubtitle>
            ML Experiment Platform: track runs, version datasets, compare models.
          </PageSubtitle>
        </HeaderLeft>
        <HeaderActions>
          <TimestampPill>
            <Clock />
            {lastUpdate.toLocaleTimeString()}
          </TimestampPill>
          <RefreshBtn onClick={fetchDashboardData}>
            Refresh
          </RefreshBtn>
        </HeaderActions>
      </Header>

      {/* ── Stats Row ───────────────────────────────────────────────────── */}
      <SectionLabel>Overview</SectionLabel>
      <StatsGrid>
        {STAT_DEFS.map(({ key, label, trendKey, accent, gradient, Icon, suffix, delay }) => (
          <StatCard key={key} delay={delay}>
            <StatTop>
              <StatIconWrap gradient={gradient}>
                <Icon />
              </StatIconWrap>
              {stats[trendKey] > 0 && (
                <StatTrendBadge positive>
                  <ArrowUpRight size={11} />
                  {stats[trendKey]}%
                </StatTrendBadge>
              )}
            </StatTop>
            <StatValueText accent={accent}>
              {stats[key]}{suffix || ''}
            </StatValueText>
            <StatLabelText>{label}</StatLabelText>
          </StatCard>
        ))}
      </StatsGrid>

      {/* ── Quick Actions ────────────────────────────────────────────────── */}
      <SectionLabel>Quick Actions</SectionLabel>
      <ActionsGrid>
        {ACTION_DEFS.map(({ id, title, desc, gradient, Icon, delay }) => (
          <ActionCard
            key={id}
            delay={delay}
            onClick={() => onNavigate && onNavigate(id)}
          >
            <ActionIconWrap gradient={gradient}>
              <Icon />
            </ActionIconWrap>
            <div>
              <ActionTitle>{title}</ActionTitle>
              <ActionDesc>{desc}</ActionDesc>
            </div>
          </ActionCard>
        ))}
      </ActionsGrid>

      {/* ── Charts ──────────────────────────────────────────────────────── */}
      <SectionLabel>Analytics</SectionLabel>
      <ChartsGrid>

        {/* Area: Runs over time */}
        <ChartCard delay={0.28}>
          <ChartCardHeader>
            <ChartCardTitle>
              <TrendingUp />
              Runs Over Time
            </ChartCardTitle>
          </ChartCardHeader>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={runsOverTime} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="mlRuns" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.22} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="mlCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.22} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(60, 60, 67, 0.10)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                stroke="#c7c7cc"
                tick={{ fontSize: 11, fill: '#8e8e93' }}
                tickLine={false}
                axisLine={{ stroke: 'rgba(60,60,67,0.12)' }}
              />
              <YAxis
                stroke="#c7c7cc"
                tick={{ fontSize: 11, fill: '#8e8e93' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip {...tooltipStyle} />
              <Legend
                wrapperStyle={{ fontSize: 12, color: '#8e8e93', paddingTop: 12 }}
              />
              <Area
                type="monotone"
                dataKey="runs"
                stroke="#6366f1"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#mlRuns)"
                name="Total Runs"
                dot={false}
                activeDot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }}
              />
              <Area
                type="monotone"
                dataKey="completed"
                stroke="#8b5cf6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#mlCompleted)"
                name="Completed"
                dot={false}
                activeDot={{ r: 4, fill: '#8b5cf6', strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Pie: Status distribution */}
        <ChartCard delay={0.36}>
          <ChartCardHeader>
            <ChartCardTitle>
              <Palette />
              Status Distribution
            </ChartCardTitle>
          </ChartCardHeader>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="46%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={88}
                dataKey="value"
                stroke="none"
              >
                {statusDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip {...tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </ChartsGrid>

      {/* ── Activity Feed ────────────────────────────────────────────────── */}
      <SectionLabel>Recent Activity</SectionLabel>
      <ActivityCard>
        <ActivityHeader>
          <ActivityTitle>
            <Zap />
            Activity
          </ActivityTitle>
        </ActivityHeader>

        {recentActivity.length > 0 ? (
          <ActivityList>
            {recentActivity.map((activity, idx) => (
              <ActivityRow key={idx}>
                <ActivityIconWrap type={activity.type}>
                  {activity.icon}
                </ActivityIconWrap>
                <ActivityContent>
                  <ActivityText>{activity.text}</ActivityText>
                  <ActivityTime>{formatTimeAgo(activity.time)}</ActivityTime>
                </ActivityContent>
                <StatusBadge variant={badgeVariant(activity.badge)}>
                  {activity.badge}
                </StatusBadge>
              </ActivityRow>
            ))}
          </ActivityList>
        ) : (
          <EmptyState>No recent activity</EmptyState>
        )}
      </ActivityCard>

    </PageWrap>
  );
};

export default DashboardModern;
