import React from 'react';
import styled from 'styled-components';
import { BarChart3, Flask, Package, Target, Rocket, Zap } from 'lucide-react';

const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.bg};
`;

const Hero = styled.section`
  padding: ${({ theme }) => theme.spacing[24]} ${({ theme }) => theme.spacing?.[8] || "2rem"};
  text-align: center;
  background: linear-gradient(135deg, ${({ theme }) => theme.primary?.[900] || '#064e3b'}15, ${({ theme }) => theme.primary?.[800] || '#065f46'}10);
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSize?.['6xl'] || '3.75rem'};
  font-weight: ${({ theme }) => theme.fontWeight?.extrabold || 800};
  background: linear-gradient(135deg, ${({ theme }) => theme.primary?.[400] || '#34d399'}, ${({ theme }) => theme.primary?.[600] || '#059669'});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${({ theme }) => theme.spacing?.[6] || "1.5rem"};
  letter-spacing: -0.02em;
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSize?.['2xl'] || '1.5rem'};
  color: ${({ theme }) => theme.text_secondary};
  max-width: 800px;
  margin: 0 auto ${({ theme }) => theme.spacing?.[12] || "3rem"};
  line-height: 1.6;
`;

const CTAButton = styled.button`
  padding: ${({ theme }) => `${theme.spacing?.[4] || "1rem"} ${theme.spacing?.[10] || "2.5rem"}`};
  background: ${({ theme }) => theme.primary?.[500] || '#10b981'};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius?.xl || "1rem"};
  font-size: ${({ theme }) => theme.fontSize?.xl || "1.25rem"};
  font-weight: ${({ theme }) => theme.fontWeight?.semibold || 600};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition?.base || '0.3s ease'};
  box-shadow: ${({ theme }) => theme.elevation?.md || "0 4px 6px rgba(0,0,0,0.1)"};

  &:hover {
    background: ${({ theme }) => theme.primary?.[600] || '#059669'};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.elevation?.lg || "0 10px 15px rgba(0,0,0,0.1)"};
  }
`;

const FeaturesSection = styled.section`
  padding: ${({ theme }) => theme.spacing[20]} ${({ theme }) => theme.spacing?.[8] || "2rem"};
  max-width: 1400px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSize?.['4xl'] || '2.25rem'};
  font-weight: ${({ theme }) => theme.fontWeight?.bold || 700};
  color: ${({ theme }) => theme.text_primary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing?.[16] || "4rem"};
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: ${({ theme }) => theme.spacing?.[8] || "2rem"};
`;

const FeatureCard = styled.div`
  background: ${({ theme }) => theme.cardElevated};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.borderRadius?.xl || "1rem"};
  padding: ${({ theme }) => theme.spacing?.[8] || "2rem"};
  transition: ${({ theme }) => theme.transition?.base || '0.3s ease'};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.elevation?.lg || "0 10px 15px rgba(0,0,0,0.1)"};
    border-color: ${({ theme }) => theme.primary?.[500] || '#10b981'}40;
  }
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  background: ${({ theme }) => theme.primary?.[500] || '#10b981'}15;
  border-radius: ${({ theme }) => theme.borderRadius?.xl || "1rem"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSize?.['3xl'] || '1.875rem'};
  margin-bottom: ${({ theme }) => theme.spacing?.[4] || "1rem"};
`;

const FeatureTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSize?.['2xl'] || '1.5rem'};
  font-weight: ${({ theme }) => theme.fontWeight?.bold || 700};
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: ${({ theme }) => theme.spacing?.[3] || "0.75rem"};
`;

const FeatureDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSize?.base || '1rem'};
  color: ${({ theme }) => theme.text_secondary};
  line-height: 1.8;
`;

const APISection = styled.section`
  padding: ${({ theme }) => theme.spacing[20]} ${({ theme }) => theme.spacing?.[8] || "2rem"};
  background: ${({ theme }) => theme.cardElevated};
  border-top: 1px solid ${({ theme }) => theme.border};
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const APIContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const CodeBlock = styled.pre`
  background: ${({ theme }) => theme.bg};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.borderRadius?.xl || "1rem"};
  padding: ${({ theme }) => theme.spacing?.[6] || "1.5rem"};
  overflow-x: auto;
  margin: ${({ theme }) => theme.spacing?.[6] || "1.5rem"} 0;
  font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
  font-size: ${({ theme }) => theme.fontSize?.sm || "0.875rem"};
  line-height: 1.6;
  color: ${({ theme }) => theme.text_primary};
`;

const APIGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing?.[6] || "1.5rem"};
  margin-top: ${({ theme }) => theme.spacing?.[8] || "2rem"};
`;

const APIEndpoint = styled.div`
  background: ${({ theme }) => theme.bg};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.borderRadius?.lg || "0.75rem"};
  padding: ${({ theme }) => theme.spacing?.[5] || "1.25rem"};
`;

const Method = styled.span`
  display: inline-block;
  padding: ${({ theme }) => `${theme.spacing?.[1] || "0.25rem"} ${theme.spacing?.[3] || "0.75rem"}`};
  background: ${({ method, theme }) => {
    switch (method) {
      case 'GET': return theme.success || '#10b981' + '20';
      case 'POST': return theme.primary?.[500] || '#10b981' + '20';
      case 'PUT': return theme.warning || '#f59e0b' + '20';
      case 'DELETE': return theme.error || '#ef4444' + '20';
      default: return theme.text_secondary + '20';
    }
  }};
  color: ${({ method, theme }) => {
    switch (method) {
      case 'GET': return theme.success || '#10b981';
      case 'POST': return theme.primary?.[500] || '#10b981';
      case 'PUT': return theme.warning || '#f59e0b';
      case 'DELETE': return theme.error || '#ef4444';
      default: return theme.text_secondary;
    }
  }};
  border-radius: ${({ theme }) => theme.borderRadius?.md || "0.375rem"};
  font-size: ${({ theme }) => theme.fontSize?.xs || "0.75rem"};
  font-weight: ${({ theme }) => theme.fontWeight?.bold || 700};
  margin-right: ${({ theme }) => theme.spacing?.[2] || "0.5rem"};
`;

const EndpointPath = styled.code`
  color: ${({ theme }) => theme.text_primary};
  font-size: ${({ theme }) => theme.fontSize?.sm || "0.875rem"};
  font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
`;

const EndpointDescription = styled.p`
  color: ${({ theme }) => theme.text_secondary};
  font-size: ${({ theme }) => theme.fontSize?.sm || "0.875rem"};
  margin-top: ${({ theme }) => theme.spacing?.[2] || "0.5rem"};
`;

const QuickStartSection = styled.section`
  padding: ${({ theme }) => theme.spacing[20]} ${({ theme }) => theme.spacing?.[8] || "2rem"};
  max-width: 1200px;
  margin: 0 auto;
`;

const StepGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing?.[6] || "1.5rem"};
  margin-top: ${({ theme }) => theme.spacing?.[8] || "2rem"};
`;

const Step = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing?.[6] || "1.5rem"};
  background: ${({ theme }) => theme.cardElevated};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.borderRadius?.xl || "1rem"};
  padding: ${({ theme }) => theme.spacing?.[6] || "1.5rem"};
`;

const StepNumber = styled.div`
  width: 48px;
  height: 48px;
  min-width: 48px;
  background: ${({ theme }) => theme.primary?.[500] || '#10b981'};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius?.full || "9999px"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSize?.['2xl'] || '1.5rem'};
  font-weight: ${({ theme }) => theme.fontWeight?.bold || 700};
`;

const StepContent = styled.div`
  flex: 1;
`;

const StepTitle = styled.h4`
  font-size: ${({ theme }) => theme.fontSize?.xl || "1.25rem"};
  font-weight: ${({ theme }) => theme.fontWeight?.bold || 700};
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: ${({ theme }) => theme.spacing?.[2] || "0.5rem"};
`;

const StepDescription = styled.p`
  color: ${({ theme }) => theme.text_secondary};
  line-height: 1.6;
`;

const Footer = styled.footer`
  padding: ${({ theme }) => theme.spacing?.[8] || "2rem"};
  text-align: center;
  border-top: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.text_secondary};
  font-size: ${({ theme }) => theme.fontSize?.sm || "0.875rem"};
`;

const FooterLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing?.[6] || "1.5rem"};
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing?.[4] || "1rem"};
`;

const FooterLink = styled.a`
  color: ${({ theme }) => theme.primary?.[500] || '#10b981'};
  text-decoration: none;
  font-weight: ${({ theme }) => theme.fontWeight?.semibold || 600};
  transition: ${({ theme }) => theme.transition?.base || '0.3s ease'};

  &:hover {
    color: ${({ theme }) => theme.primary?.[600] || '#059669'};
    text-decoration: underline;
  }
`;

function Landing({ onGetStarted }) {
  return (
    <Container>
      <Hero>
        <Title>ModelLab</Title>
        <Subtitle>
          Track, compare, and reproduce ML experiments with ease.
          Built for data scientists who value simplicity and reproducibility.
        </Subtitle>
        <CTAButton onClick={onGetStarted}>
          Get Started
        </CTAButton>
      </Hero>

      <FeaturesSection>
        <SectionTitle>Why ModelLab?</SectionTitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon><BarChart3 size={32} color="#10b981" /></FeatureIcon>
            <FeatureTitle>Track Everything</FeatureTitle>
            <FeatureDescription>
              Automatically log datasets, hyperparameters, metrics, and artifacts.
              Never lose track of what worked and what didn't.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon><Flask size={32} color="#10b981" /></FeatureIcon>
            <FeatureTitle>Compare Experiments</FeatureTitle>
            <FeatureDescription>
              Side-by-side comparison of runs with metric deltas, parameter diffs,
              and performance visualizations.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon><Package size={32} color="#10b981" /></FeatureIcon>
            <FeatureTitle>Reproduction Packs</FeatureTitle>
            <FeatureDescription>
              Export complete reproduction packages with code, data checksums,
              and environment specs. Share results with confidence.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon><Target size={32} color="#10b981" /></FeatureIcon>
            <FeatureTitle>EvalHarness</FeatureTitle>
            <FeatureDescription>
              Comprehensive evaluation framework with metrics, confidence intervals,
              data slicing, and failure analysis built-in.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon><Rocket size={32} color="#10b981" /></FeatureIcon>
            <FeatureTitle>Python SDK</FeatureTitle>
            <FeatureDescription>
              Intuitive Python API with context managers for clean experiment tracking.
              Integrates seamlessly with scikit-learn and PyTorch.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon><Zap size={32} color="#10b981" /></FeatureIcon>
            <FeatureTitle>REST API</FeatureTitle>
            <FeatureDescription>
              Full-featured REST API for integration with any ML stack.
              Production-ready with rate limiting and security.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>

      <APISection>
        <APIContent>
          <SectionTitle>Powerful API</SectionTitle>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '18px' }}>
            RESTful API with comprehensive endpoints for all operations
          </p>

          <CodeBlock>{`# Create a project
curl -X POST https://modellab-api-production.up.railway.app/api/modellab/projects \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Image Classification", "description": "CNN experiments"}'

# Upload a dataset
curl -X POST https://modellab-api-production.up.railway.app/api/modellab/datasets \\
  -F "name=iris" \\
  -F "file=@data/iris.csv" \\
  -F "project_id=proj_abc123"

# Track a run
curl -X POST https://modellab-api-production.up.railway.app/api/modellab/runs \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Baseline Model",
    "project_id": "proj_abc123",
    "dataset_id": "ds_xyz789",
    "model_type": "LogisticRegression",
    "hyperparameters": {"C": 1.0, "solver": "lbfgs"},
    "metrics": {"accuracy": 0.96, "f1_score": 0.95}
  }'`}</CodeBlock>

          <APIGrid>
            <APIEndpoint>
              <div>
                <Method method="GET">GET</Method>
                <EndpointPath>/api/modellab/projects</EndpointPath>
              </div>
              <EndpointDescription>List all projects with stats</EndpointDescription>
            </APIEndpoint>

            <APIEndpoint>
              <div>
                <Method method="POST">POST</Method>
                <EndpointPath>/api/modellab/datasets</EndpointPath>
              </div>
              <EndpointDescription>Upload new dataset</EndpointDescription>
            </APIEndpoint>

            <APIEndpoint>
              <div>
                <Method method="GET">GET</Method>
                <EndpointPath>/api/modellab/runs</EndpointPath>
              </div>
              <EndpointDescription>List and filter all runs</EndpointDescription>
            </APIEndpoint>

            <APIEndpoint>
              <div>
                <Method method="POST">POST</Method>
                <EndpointPath>/api/modellab/runs/:id/evaluate</EndpointPath>
              </div>
              <EndpointDescription>Submit evaluation results</EndpointDescription>
            </APIEndpoint>

            <APIEndpoint>
              <div>
                <Method method="GET">GET</Method>
                <EndpointPath>/api/modellab/runs/:id/repro</EndpointPath>
              </div>
              <EndpointDescription>Export reproduction pack</EndpointDescription>
            </APIEndpoint>

            <APIEndpoint>
              <div>
                <Method method="GET">GET</Method>
                <EndpointPath>/api/health</EndpointPath>
              </div>
              <EndpointDescription>Health check with metrics</EndpointDescription>
            </APIEndpoint>
          </APIGrid>
        </APIContent>
      </APISection>

      <QuickStartSection>
        <SectionTitle>Get Started in 3 Steps</SectionTitle>
        <StepGrid>
          <Step>
            <StepNumber>1</StepNumber>
            <StepContent>
              <StepTitle>Create a Project</StepTitle>
              <StepDescription>
                Organize your experiments into projects. Each project can contain multiple
                datasets and runs. Perfect for tracking different research directions.
              </StepDescription>
            </StepContent>
          </Step>

          <Step>
            <StepNumber>2</StepNumber>
            <StepContent>
              <StepTitle>Upload Your Data</StepTitle>
              <StepDescription>
                Upload CSV datasets directly through the UI or API. ModelLab automatically
                extracts metadata, validates format, and provides previews.
              </StepDescription>
            </StepContent>
          </Step>

          <Step>
            <StepNumber>3</StepNumber>
            <StepContent>
              <StepTitle>Track Experiments</StepTitle>
              <StepDescription>
                Log training runs with metrics, hyperparameters, and artifacts. Compare
                results, analyze failures, and export reproduction packages.
              </StepDescription>
            </StepContent>
          </Step>
        </StepGrid>

        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <CTAButton onClick={onGetStarted}>
            Start Tracking Experiments
          </CTAButton>
        </div>
      </QuickStartSection>

      <Footer>
        <FooterLinks>
          <FooterLink href="https://github.com/calebnewtonusc/ModelLab" target="_blank" rel="noopener noreferrer">
            GitHub
          </FooterLink>
          <FooterLink href="https://modellab.studio" rel="noopener noreferrer">
            API Docs
          </FooterLink>
          <FooterLink href="https://modellab.studio" rel="noopener noreferrer">
            API Status
          </FooterLink>
        </FooterLinks>
        <p>ModelLab - ML Experiment Tracking Platform</p>
        <p style={{ marginTop: '8px', opacity: 0.7 }}>Built with Express, React, and PostgreSQL</p>
      </Footer>
    </Container>
  );
}

export default Landing;
