import React from 'react';
import styled, { keyframes } from 'styled-components';
import { BarChart3, Beaker, Package, Target, Rocket, Zap } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────────────────
   Animations
───────────────────────────────────────────────────────────────────────────── */

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* ─────────────────────────────────────────────────────────────────────────────
   Root
───────────────────────────────────────────────────────────────────────────── */

const Page = styled.div`
  min-height: 100vh;
  background: #f2f2f7;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', sans-serif;
  -webkit-font-smoothing: antialiased;
`;

/* ─────────────────────────────────────────────────────────────────────────────
   Hero
───────────────────────────────────────────────────────────────────────────── */

const Hero = styled.section`
  background: #ffffff;
  padding: 96px 24px 80px;
  text-align: center;
  border-bottom: 0.5px solid rgba(60, 60, 67, 0.12);
  animation: ${fadeUp} 0.5s ease both;
`;

const HeroEyebrow = styled.p`
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #6366f1;
  margin-bottom: 18px;
  animation: ${fadeUp} 0.5s ease both;
`;

const HeroTitle = styled.h1`
  font-size: clamp(48px, 7vw, 72px);
  font-weight: 900;
  letter-spacing: -2.5px;
  color: #1c1c1e;
  line-height: 1.06;
  margin-bottom: 20px;
  max-width: 760px;
  margin-left: auto;
  margin-right: auto;
  animation: ${fadeUp} 0.55s 0.05s ease both;
`;

const HeroSub = styled.p`
  font-size: 19px;
  font-weight: 400;
  color: #636366;
  line-height: 1.6;
  max-width: 520px;
  margin: 0 auto 40px;
  animation: ${fadeUp} 0.55s 0.1s ease both;
`;

const HeroCtas = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  animation: ${fadeUp} 0.55s 0.15s ease both;
`;

const BtnPrimary = styled.button`
  height: 52px;
  padding: 0 28px;
  background: #6366f1;
  color: #ffffff;
  border: none;
  border-radius: 14px;
  font-family: inherit;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease;
  box-shadow: 0 2px 12px rgba(99, 102, 241, 0.35);

  &:hover {
    background: #4f46e5;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
  }
`;

const BtnSecondary = styled.a`
  height: 52px;
  padding: 0 24px;
  display: inline-flex;
  align-items: center;
  font-family: inherit;
  font-size: 16px;
  font-weight: 600;
  color: #6366f1;
  text-decoration: none;
  border-radius: 14px;
  transition: background 0.18s ease;

  &:hover {
    background: rgba(99, 102, 241, 0.08);
  }
`;

/* ─────────────────────────────────────────────────────────────────────────────
   Stats band
───────────────────────────────────────────────────────────────────────────── */

const StatsBand = styled.div`
  background: #ffffff;
  border-bottom: 0.5px solid rgba(60, 60, 67, 0.1);
  padding: 28px 24px;
  display: flex;
  justify-content: center;
  gap: 56px;
  flex-wrap: wrap;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.8px;
  color: #1c1c1e;
  line-height: 1;
`;

const StatLabel = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #8e8e93;
  margin-top: 4px;
  letter-spacing: 0.2px;
`;

/* ─────────────────────────────────────────────────────────────────────────────
   Section
───────────────────────────────────────────────────────────────────────────── */

const Section = styled.section`
  max-width: 1100px;
  margin: 0 auto;
  padding: 80px 24px;
`;

const SectionEyebrow = styled.p`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #6366f1;
  margin-bottom: 10px;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-size: clamp(28px, 4vw, 38px);
  font-weight: 800;
  letter-spacing: -1.2px;
  color: #1c1c1e;
  text-align: center;
  margin-bottom: 8px;
`;

const SectionSub = styled.p`
  font-size: 16px;
  color: #636366;
  text-align: center;
  margin-bottom: 48px;
  line-height: 1.5;
`;

/* ─────────────────────────────────────────────────────────────────────────────
   Feature grid
───────────────────────────────────────────────────────────────────────────── */

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
`;

const FeatureCard = styled.div`
  background: #ffffff;
  border: 0.5px solid rgba(60, 60, 67, 0.12);
  border-radius: 18px;
  padding: 28px 26px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1);
  }
`;

const FeatureIconWrap = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: rgba(99, 102, 241, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
`;

const FeatureTitle = styled.h3`
  font-size: 17px;
  font-weight: 700;
  color: #1c1c1e;
  margin-bottom: 8px;
  letter-spacing: -0.3px;
`;

const FeatureDesc = styled.p`
  font-size: 14px;
  color: #636366;
  line-height: 1.65;
`;

/* ─────────────────────────────────────────────────────────────────────────────
   API section
───────────────────────────────────────────────────────────────────────────── */

const ApiSection = styled.section`
  background: #1c1c1e;
  padding: 80px 24px;
`;

const ApiInner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const ApiTitle = styled.h2`
  font-size: clamp(28px, 4vw, 38px);
  font-weight: 800;
  letter-spacing: -1.2px;
  color: #ffffff;
  text-align: center;
  margin-bottom: 8px;
`;

const ApiSub = styled.p`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
  margin-bottom: 40px;
`;

const CodeBlock = styled.pre`
  background: #000000;
  border: 0.5px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 28px 28px;
  overflow-x: auto;
  font-family: 'SF Mono', 'Menlo', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.75;
  color: #e5e5e7;
  margin-bottom: 28px;
`;

const EndpointsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 12px;
`;

const EndpointCard = styled.div`
  background: rgba(255, 255, 255, 0.06);
  border: 0.5px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px 18px;
`;

const MethodBadge = styled.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  font-family: 'SF Mono', monospace;
  margin-right: 8px;
  background: ${({ method }) =>
    method === 'GET' ? 'rgba(52, 199, 89, 0.15)' :
    method === 'POST' ? 'rgba(99, 102, 241, 0.2)' :
    method === 'DELETE' ? 'rgba(255, 59, 48, 0.15)' :
    'rgba(255, 255, 255, 0.08)'};
  color: ${({ method }) =>
    method === 'GET' ? '#34c759' :
    method === 'POST' ? '#a5b4fc' :
    method === 'DELETE' ? '#ff6961' :
    '#fff'};
`;

const EndpointPath = styled.code`
  color: #e5e5e7;
  font-size: 13px;
  font-family: 'SF Mono', 'Menlo', monospace;
`;

const EndpointDesc = styled.p`
  color: rgba(255, 255, 255, 0.4);
  font-size: 12px;
  margin-top: 6px;
`;

/* ─────────────────────────────────────────────────────────────────────────────
   Steps
───────────────────────────────────────────────────────────────────────────── */

const StepsGrid = styled.div`
  display: grid;
  gap: 14px;
`;

const StepCard = styled.div`
  background: #ffffff;
  border: 0.5px solid rgba(60, 60, 67, 0.12);
  border-radius: 18px;
  padding: 26px 28px;
  display: flex;
  align-items: flex-start;
  gap: 20px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
`;

const StepNum = styled.div`
  width: 44px;
  height: 44px;
  min-width: 44px;
  border-radius: 50%;
  background: #6366f1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 800;
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.35);
`;

const StepBody = styled.div``;

const StepTitle = styled.h4`
  font-size: 17px;
  font-weight: 700;
  color: #1c1c1e;
  margin-bottom: 6px;
  letter-spacing: -0.3px;
`;

const StepDesc = styled.p`
  font-size: 14px;
  color: #636366;
  line-height: 1.6;
`;

/* ─────────────────────────────────────────────────────────────────────────────
   Bottom CTA band
───────────────────────────────────────────────────────────────────────────── */

const CtaBand = styled.section`
  background: #ffffff;
  border-top: 0.5px solid rgba(60, 60, 67, 0.12);
  border-bottom: 0.5px solid rgba(60, 60, 67, 0.12);
  padding: 72px 24px;
  text-align: center;
`;

const CtaTitle = styled.h2`
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 800;
  letter-spacing: -1.4px;
  color: #1c1c1e;
  margin-bottom: 12px;
`;

const CtaSub = styled.p`
  font-size: 17px;
  color: #636366;
  margin-bottom: 32px;
`;

/* ─────────────────────────────────────────────────────────────────────────────
   Footer
───────────────────────────────────────────────────────────────────────────── */

const FooterBar = styled.footer`
  padding: 28px 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32px;
  flex-wrap: wrap;
`;

const FooterLink = styled.a`
  font-size: 13px;
  color: #8e8e93;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.18s ease;

  &:hover {
    color: #6366f1;
  }
`;

const FooterCopy = styled.p`
  font-size: 12px;
  color: #aeaeb2;
  text-align: center;
  padding-bottom: 24px;
`;

/* ─────────────────────────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────────────────────────── */

const FEATURES = [
  {
    icon: <BarChart3 size={26} color="#6366f1" />,
    title: 'Track Everything',
    desc: 'Automatically log datasets, hyperparameters, metrics, and artifacts. Never lose track of what worked.',
  },
  {
    icon: <Beaker size={26} color="#6366f1" />,
    title: 'Compare Experiments',
    desc: 'Side-by-side comparison of runs with metric deltas, parameter diffs, and performance visualizations.',
  },
  {
    icon: <Package size={26} color="#6366f1" />,
    title: 'Reproduction Packs',
    desc: 'Export complete reproduction packages with code, data checksums, and environment specs.',
  },
  {
    icon: <Target size={26} color="#6366f1" />,
    title: 'EvalHarness',
    desc: 'Comprehensive evaluation framework with metrics, confidence intervals, data slicing, and failure analysis.',
  },
  {
    icon: <Rocket size={26} color="#6366f1" />,
    title: 'Python SDK',
    desc: 'Intuitive Python API with context managers. Integrates seamlessly with scikit-learn and PyTorch.',
  },
  {
    icon: <Zap size={26} color="#6366f1" />,
    title: 'REST API',
    desc: 'Full-featured REST API for integration with any ML stack. Production-ready with rate limiting.',
  },
];

const ENDPOINTS = [
  { method: 'GET',  path: '/api/modellab/projects',      desc: 'List all projects with stats' },
  { method: 'POST', path: '/api/modellab/datasets',      desc: 'Upload new dataset' },
  { method: 'GET',  path: '/api/modellab/runs',          desc: 'List and filter all runs' },
  { method: 'POST', path: '/api/modellab/runs/:id/evaluate', desc: 'Submit evaluation results' },
  { method: 'GET',  path: '/api/modellab/runs/:id/repro', desc: 'Export reproduction pack' },
  { method: 'GET',  path: '/api/health',                 desc: 'Health check with metrics' },
];

function Landing({ onGetStarted }) {
  return (
    <Page>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <Hero>
        <HeroEyebrow>ML Experiment Tracking</HeroEyebrow>
        <HeroTitle>The lab for your<br />machine learning.</HeroTitle>
        <HeroSub>
          Track, compare, and reproduce ML experiments with ease.
          Built for data scientists who value simplicity and reproducibility.
        </HeroSub>
        <HeroCtas>
          <BtnPrimary onClick={onGetStarted}>Get Started</BtnPrimary>
          <BtnSecondary href="https://github.com/calebnewtonusc/Model-Lab" target="_blank" rel="noopener noreferrer">
            GitHub ↗
          </BtnSecondary>
        </HeroCtas>
      </Hero>

      {/* ── Stats band ───────────────────────────────────────────────────── */}
      <StatsBand>
        <StatItem><StatValue>6</StatValue><StatLabel>API Endpoints</StatLabel></StatItem>
        <StatItem><StatValue>∞</StatValue><StatLabel>Experiment Runs</StatLabel></StatItem>
        <StatItem><StatValue>100%</StatValue><StatLabel>Reproducible</StatLabel></StatItem>
        <StatItem><StatValue>Free</StatValue><StatLabel>Open Source</StatLabel></StatItem>
      </StatsBand>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <Section>
        <SectionEyebrow>Features</SectionEyebrow>
        <SectionTitle>Everything you need.</SectionTitle>
        <SectionSub>From experiment tracking to reproduction packages.</SectionSub>
        <FeaturesGrid>
          {FEATURES.map((f) => (
            <FeatureCard key={f.title}>
              <FeatureIconWrap>{f.icon}</FeatureIconWrap>
              <FeatureTitle>{f.title}</FeatureTitle>
              <FeatureDesc>{f.desc}</FeatureDesc>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </Section>

      {/* ── API ──────────────────────────────────────────────────────────── */}
      <ApiSection>
        <ApiInner>
          <ApiTitle>Powerful REST API</ApiTitle>
          <ApiSub>RESTful endpoints for every operation</ApiSub>
          <CodeBlock>{`# Create a project
curl -X POST https://modellab-api-production.up.railway.app/api/modellab/projects \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Image Classification", "description": "CNN experiments"}'

# Upload a dataset
curl -X POST https://modellab-api-production.up.railway.app/api/modellab/datasets \\
  -F "name=iris" -F "file=@data/iris.csv" -F "project_id=proj_abc123"

# Track a run
curl -X POST https://modellab-api-production.up.railway.app/api/modellab/runs \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Baseline Model",
    "project_id": "proj_abc123",
    "model_type": "LogisticRegression",
    "hyperparameters": {"C": 1.0, "solver": "lbfgs"},
    "metrics": {"accuracy": 0.96, "f1_score": 0.95}
  }'`}</CodeBlock>
          <EndpointsGrid>
            {ENDPOINTS.map((e) => (
              <EndpointCard key={e.path}>
                <div>
                  <MethodBadge method={e.method}>{e.method}</MethodBadge>
                  <EndpointPath>{e.path}</EndpointPath>
                </div>
                <EndpointDesc>{e.desc}</EndpointDesc>
              </EndpointCard>
            ))}
          </EndpointsGrid>
        </ApiInner>
      </ApiSection>

      {/* ── Steps ────────────────────────────────────────────────────────── */}
      <Section>
        <SectionEyebrow>Quick Start</SectionEyebrow>
        <SectionTitle>Up and running in 3 steps.</SectionTitle>
        <SectionSub>No complex setup. Just start tracking.</SectionSub>
        <StepsGrid>
          {[
            {
              n: '1',
              title: 'Create a Project',
              desc: 'Organize experiments into projects. Each project holds multiple datasets and runs, perfect for different research directions.',
            },
            {
              n: '2',
              title: 'Upload Your Data',
              desc: 'Upload CSV datasets through the UI or API. ModelLab automatically extracts metadata, validates format, and provides previews.',
            },
            {
              n: '3',
              title: 'Track Experiments',
              desc: 'Log training runs with metrics, hyperparameters, and artifacts. Compare results, analyze failures, export reproduction packs.',
            },
          ].map((s) => (
            <StepCard key={s.n}>
              <StepNum>{s.n}</StepNum>
              <StepBody>
                <StepTitle>{s.title}</StepTitle>
                <StepDesc>{s.desc}</StepDesc>
              </StepBody>
            </StepCard>
          ))}
        </StepsGrid>
      </Section>

      {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
      <CtaBand>
        <CtaTitle>Start tracking today.</CtaTitle>
        <CtaSub>Free to use. Open source. Built for scientists.</CtaSub>
        <BtnPrimary onClick={onGetStarted} style={{ fontSize: 17, height: 56, padding: '0 36px' }}>
          Open Dashboard
        </BtnPrimary>
      </CtaBand>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <FooterBar>
        <FooterLink href="https://github.com/calebnewtonusc/Model-Lab" target="_blank" rel="noopener noreferrer">GitHub</FooterLink>
        <FooterLink href="https://modellab.studio">API Docs</FooterLink>
        <FooterLink href="https://modellab.studio">Status</FooterLink>
      </FooterBar>
      <FooterCopy>ModelLab: ML Experiment Tracking · Built with React &amp; Express</FooterCopy>
    </Page>
  );
}

export default Landing;
