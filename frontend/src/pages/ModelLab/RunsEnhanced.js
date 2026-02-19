import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  LineChart, Line, BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Card, Button, Input, TextArea, Select, Modal, ModalContent, ModalHeader,
  ModalTitle, ModalClose, Badge, Table, Th, Td, Tabs,
  LoadingContainer, Spinner, LoadingText, EmptyState, EmptyStateTitle,
  EmptyStateText, ProgressBar, ProgressFill
} from './components/SharedComponents';
import { API_ENDPOINTS } from '../../config/api';

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing?.[8] || "2rem"};
  max-width: 1600px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing?.[8] || "2rem"};
  gap: ${({ theme }) => theme.spacing?.[4] || "1rem"};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSize?.['4xl'] || '2.25rem'};
  font-weight: ${({ theme }) => theme.fontWeight?.bold || 700};
  color: ${({ theme }) => theme.text_primary};
  line-height: ${({ theme }) => theme.lineHeight?.tight || "1.25"};
  margin-bottom: ${({ theme }) => theme.spacing?.[2] || "0.5rem"};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSize?.lg || "1.125rem"};
  color: ${({ theme }) => theme.text_secondary};
  line-height: ${({ theme }) => theme.lineHeight?.normal || "1.5"};
  margin: 0;
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const FilterBar = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing?.[4] || "1rem"};
  margin-bottom: ${({ theme }) => theme.spacing?.[6] || "1.5rem"};
  flex-wrap: wrap;
`;

const SearchInput = styled(Input)`
  flex: 1;
  min-width: 300px;
`;

const FilterSelect = styled(Select)`
  min-width: 180px;
`;

const RunsGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing?.[6] || "1.5rem"};
`;

const RunCard = styled(Card)`
  cursor: pointer;
  border: 2px solid ${({ theme }) => theme.border};

  &:hover {
    border-color: ${({ theme }) => theme.primary?.[500] || '#10b981'};
  }
`;

const RunHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing?.[4] || "1rem"};
  gap: ${({ theme }) => theme.spacing?.[4] || "1rem"};
`;

const RunName = styled.h3`
  font-size: ${({ theme }) => theme.fontSize?.['2xl'] || '1.5rem'};
  font-weight: ${({ theme }) => theme.fontWeight?.semibold || 600};
  color: ${({ theme }) => theme.text_primary};
  margin: 0;
  line-height: ${({ theme }) => theme.lineHeight?.tight || "1.25"};
`;

const RunDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSize?.base || '1rem'};
  color: ${({ theme }) => theme.text_secondary};
  margin-bottom: ${({ theme }) => theme.spacing?.[6] || "1.5rem"};
  line-height: ${({ theme }) => theme.lineHeight?.normal || "1.5"};
  line-height: 1.5;
`;

const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const MetaItem = styled.div`
  padding: 0.75rem;
  background: ${({ theme }) => theme.bg};
  border-radius: 8px;
`;

const MetaLabel = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.text_secondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
`;

const MetaValue = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
`;

const MetricCard = styled.div`
  padding: 1rem;
  background: ${({ theme }) => theme.bg};
  border-radius: 8px;
  text-align: center;
`;

const MetricValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 0.25rem;
`;

const MetricLabel = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.text_secondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const WizardModal = styled(ModalContent)`
  max-width: 800px;
`;

const WizardSteps = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 20px;
    left: 0;
    right: 0;
    height: 2px;
    background: ${({ theme }) => theme.text_primary + '20'};
    z-index: 0;
  }
`;

const WizardStep = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  z-index: 1;
  position: relative;
  flex: 1;
`;

const StepCircle = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ active, completed, theme }) =>
    completed ? theme.primary :
    active ? theme.primary :
    theme.bg};
  color: ${({ active, completed }) =>
    active || completed ? 'white' : '#888'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  border: 2px solid ${({ active, completed, theme }) =>
    completed ? theme.primary :
    active ? theme.primary :
    theme.text_primary + '30'};
`;

const StepLabel = styled.div`
  font-size: 0.875rem;
  color: ${({ active, theme }) =>
    active ? theme.text_primary : theme.text_secondary};
  font-weight: ${({ active }) => active ? '600' : '400'};
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 0.5rem;
`;

const HelpText = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text_secondary};
  margin-top: 0.25rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: space-between;
`;

const TemplateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const TemplateCard = styled(Card)`
  cursor: pointer;
  text-align: center;
  padding: 1.5rem;
  transition: all 0.3s ease;
  border: 2px solid ${({ selected, theme }) =>
    selected ? theme.primary : 'transparent'};

  &:hover {
    border-color: ${({ theme }) => theme.primary};
    transform: translateY(-2px);
  }
`;

const TemplateIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const TemplateName = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 0.25rem;
`;

const TemplateDesc = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text_secondary};
`;

const DetailModal = styled(ModalContent)`
  max-width: 1200px;
`;

const TrainingProgress = styled.div`
  margin: 1rem 0;
`;

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text_secondary};
`;

const Section = styled.div`
  margin: 2rem 0;
`;

const SectionTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ConfigDisplay = styled.pre`
  background: ${({ theme }) => theme.bg};
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text_primary};
  line-height: 1.5;
`;

const TEMPLATES = [
  {
    id: 'classification',
    name: 'Classification',
    icon: '',
    description: 'Image or text classification model',
    config: {
      model: 'resnet50',
      optimizer: 'adam',
      loss: 'cross_entropy',
      epochs: 100
    }
  },
  {
    id: 'regression',
    name: 'Regression',
    icon: '',
    description: 'Numerical prediction model',
    config: {
      model: 'mlp',
      optimizer: 'adam',
      loss: 'mse',
      epochs: 100
    }
  },
  {
    id: 'nlp',
    name: 'NLP',
    icon: '',
    description: 'Natural language processing',
    config: {
      model: 'transformer',
      optimizer: 'adamw',
      loss: 'cross_entropy',
      epochs: 50
    }
  },
  {
    id: 'custom',
    name: 'Custom',
    icon: '',
    description: 'Start from scratch',
    config: {}
  }
];

const Runs = () => {
  const [runs, setRuns] = useState([]);
  const [filteredRuns, setFilteredRuns] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showWizard, setShowWizard] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRun, setSelectedRun] = useState(null);
  const [wizardStep, setWizardStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState('overview');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    datasetId: '',
    status: 'pending',
    hyperparameters: {},
    config: {},
    tags: []
  });

  useEffect(() => {
    fetchRuns();
    fetchDatasets();
  }, []);

  useEffect(() => {
    let filtered = runs;

    if (searchTerm) {
      filtered = filtered.filter(r =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.description && r.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(r => r.status === statusFilter);
    }

    setFilteredRuns(filtered);
  }, [runs, searchTerm, statusFilter]);

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

  const fetchDatasets = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.datasets);
      const data = await response.json();
      setDatasets(data.datasets || []);
    } catch (error) {
      console.error('Error fetching datasets:', error);
    }
  };

  const startWizard = () => {
    setWizardStep(0);
    setSelectedTemplate(null);
    setFormData({
      name: '',
      description: '',
      datasetId: '',
      status: 'pending',
      hyperparameters: {},
      config: {},
      tags: []
    });
    setShowWizard(true);
  };

  const nextStep = () => {
    if (wizardStep < 3) {
      setWizardStep(wizardStep + 1);
    }
  };

  const prevStep = () => {
    if (wizardStep > 0) {
      setWizardStep(wizardStep - 1);
    }
  };

  const selectTemplate = (template) => {
    setSelectedTemplate(template);
    setFormData(prev => ({
      ...prev,
      config: template.config,
      hyperparameters: template.config
    }));
  };

  const handleCreateRun = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.runs, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          status: 'pending'
        })
      });

      if (response.ok) {
        setShowWizard(false);
        fetchRuns();
      } else {
        alert('Failed to create run');
      }
    } catch (error) {
      console.error('Error creating run:', error);
      alert('Failed to create run: ' + error.message);
    }
  };

  const viewRunDetails = (run) => {
    setSelectedRun(run);
    setShowDetailModal(true);
  };

  const renderWizardStep = () => {
    switch (wizardStep) {
      case 0:
        return (
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Choose a Template</h3>
            <TemplateGrid>
              {TEMPLATES.map(template => (
                <TemplateCard
                  key={template.id}
                  selected={selectedTemplate?.id === template.id}
                  onClick={() => selectTemplate(template)}
                >
                  <TemplateIcon>{template.icon}</TemplateIcon>
                  <TemplateName>{template.name}</TemplateName>
                  <TemplateDesc>{template.description}</TemplateDesc>
                </TemplateCard>
              ))}
            </TemplateGrid>
          </div>
        );

      case 1:
        return (
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Basic Information</h3>
            <FormGroup>
              <Label htmlFor="run-name">Run Name *</Label>
              <Input
                id="run-name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter run name"
              />
              <HelpText>A descriptive name for this experiment</HelpText>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="run-description">Description</Label>
              <TextArea
                id="run-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe this run"
              />
              <HelpText>What are you testing or trying to achieve?</HelpText>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="run-dataset">Dataset</Label>
              <Select
                id="run-dataset"
                value={formData.datasetId}
                onChange={(e) => setFormData({ ...formData, datasetId: e.target.value })}
              >
                <option value="">None</option>
                {datasets.map(dataset => (
                  <option key={dataset.id} value={dataset.id}>
                    {dataset.name}
                  </option>
                ))}
              </Select>
              <HelpText>Select a dataset for this experiment</HelpText>
            </FormGroup>
          </div>
        );

      case 2:
        return (
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Hyperparameters</h3>
            <FormGroup>
              <Label htmlFor="run-hyperparameters">Hyperparameters (JSON)</Label>
              <TextArea
                id="run-hyperparameters"
                value={JSON.stringify(formData.hyperparameters, null, 2)}
                onChange={(e) => {
                  try {
                    setFormData({ ...formData, hyperparameters: JSON.parse(e.target.value) });
                  } catch (err) {
                    // Invalid JSON, ignore
                  }
                }}
                style={{ fontFamily: 'monospace', minHeight: '200px' }}
              />
              <HelpText>Edit your hyperparameters as JSON</HelpText>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="run-config">Config (JSON)</Label>
              <TextArea
                id="run-config"
                value={JSON.stringify(formData.config, null, 2)}
                onChange={(e) => {
                  try {
                    setFormData({ ...formData, config: JSON.parse(e.target.value) });
                  } catch (err) {
                    // Invalid JSON, ignore
                  }
                }}
                style={{ fontFamily: 'monospace', minHeight: '200px' }}
              />
              <HelpText>Additional configuration</HelpText>
            </FormGroup>
          </div>
        );

      case 3:
        return (
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Review & Create</h3>
            <Section>
              <SectionTitle>Basic Info</SectionTitle>
              <div>
                <strong>Name:</strong> {formData.name || 'Untitled Run'}
              </div>
              <div>
                <strong>Description:</strong> {formData.description || 'No description'}
              </div>
              <div>
                <strong>Dataset:</strong> {datasets.find(d => d.id === formData.datasetId)?.name || 'None'}
              </div>
            </Section>

            <Section>
              <SectionTitle>Hyperparameters</SectionTitle>
              <ConfigDisplay>
                {JSON.stringify(formData.hyperparameters, null, 2)}
              </ConfigDisplay>
            </Section>

            <Section>
              <SectionTitle>Config</SectionTitle>
              <ConfigDisplay>
                {JSON.stringify(formData.config, null, 2)}
              </ConfigDisplay>
            </Section>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <Spinner size="60px" />
          <LoadingText>Loading runs...</LoadingText>
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderContent>
          <Title>Runs</Title>
          <Subtitle>Execute and track ML experiments with automatic seed tracking, git commit hashes, dataset versions, and artifact storage for complete reproducibility.</Subtitle>
        </HeaderContent>
        <Button onClick={startWizard}>
          Create Run
        </Button>
      </Header>

      <FilterBar>
        <SearchInput
          type="text"
          placeholder="Search runs by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FilterSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="running">Running</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </FilterSelect>
      </FilterBar>

      {filteredRuns.length === 0 ? (
        <EmptyState>
          <EmptyStateTitle>No Runs Found</EmptyStateTitle>
          <EmptyStateText>
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Create your first run to get started'}
          </EmptyStateText>
          <Button onClick={startWizard}>Create Run</Button>
        </EmptyState>
      ) : (
        <RunsGrid>
          {filteredRuns.map(run => (
            <RunCard key={run.id} onClick={() => viewRunDetails(run)}>
              <RunHeader>
                <RunName>{run.name}</RunName>
                <Badge variant={
                  run.status === 'completed' ? 'success' :
                  run.status === 'running' ? 'info' :
                  run.status === 'failed' ? 'error' : 'default'
                }>
                  {run.status}
                </Badge>
              </RunHeader>

              {run.description && (
                <RunDescription>{run.description}</RunDescription>
              )}

              <MetaGrid>
                <MetaItem>
                  <MetaLabel>Seed</MetaLabel>
                  <MetaValue>{run.seed}</MetaValue>
                </MetaItem>
                <MetaItem>
                  <MetaLabel>Commit</MetaLabel>
                  <MetaValue>{run.commitHash?.substring(0, 8) || 'N/A'}</MetaValue>
                </MetaItem>
                <MetaItem>
                  <MetaLabel>Created</MetaLabel>
                  <MetaValue>
                    {new Date(run.createdAt).toLocaleDateString()}
                  </MetaValue>
                </MetaItem>
                <MetaItem>
                  <MetaLabel>Dataset</MetaLabel>
                  <MetaValue>
                    {datasets.find(d => d.id === run.datasetId)?.name || 'None'}
                  </MetaValue>
                </MetaItem>
              </MetaGrid>

              {run.metrics && Object.keys(run.metrics).length > 0 && (
                <MetricsGrid>
                  {Object.entries(run.metrics).slice(0, 4).map(([key, value]) => (
                    <MetricCard key={key}>
                      <MetricValue>
                        {typeof value === 'number'
                          ? value.toFixed(4)
                          : JSON.stringify(value)}
                      </MetricValue>
                      <MetricLabel>{key}</MetricLabel>
                    </MetricCard>
                  ))}
                </MetricsGrid>
              )}
            </RunCard>
          ))}
        </RunsGrid>
      )}

      <Modal show={showWizard} onClick={() => !wizardStep && setShowWizard(false)}>
        <WizardModal onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>Create New Run</ModalTitle>
            <ModalClose onClick={() => setShowWizard(false)}>×</ModalClose>
          </ModalHeader>

          <WizardSteps>
            <WizardStep>
              <StepCircle active={wizardStep === 0} completed={wizardStep > 0}>1</StepCircle>
              <StepLabel active={wizardStep === 0}>Template</StepLabel>
            </WizardStep>
            <WizardStep>
              <StepCircle active={wizardStep === 1} completed={wizardStep > 1}>2</StepCircle>
              <StepLabel active={wizardStep === 1}>Info</StepLabel>
            </WizardStep>
            <WizardStep>
              <StepCircle active={wizardStep === 2} completed={wizardStep > 2}>3</StepCircle>
              <StepLabel active={wizardStep === 2}>Config</StepLabel>
            </WizardStep>
            <WizardStep>
              <StepCircle active={wizardStep === 3} completed={wizardStep > 3}>4</StepCircle>
              <StepLabel active={wizardStep === 3}>Review</StepLabel>
            </WizardStep>
          </WizardSteps>

          {renderWizardStep()}

          <ButtonGroup>
            <Button
              variant="secondary"
              onClick={prevStep}
              disabled={wizardStep === 0}
            >
              Previous
            </Button>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Button variant="secondary" onClick={() => setShowWizard(false)}>
                Cancel
              </Button>
              {wizardStep < 3 ? (
                <Button
                  onClick={nextStep}
                  disabled={wizardStep === 0 && !selectedTemplate}
                >
                  Next
                </Button>
              ) : (
                <Button onClick={handleCreateRun} disabled={!formData.name}>
                  Create Run
                </Button>
              )}
            </div>
          </ButtonGroup>
        </WizardModal>
      </Modal>

      <Modal show={showDetailModal} onClick={() => setShowDetailModal(false)}>
        <DetailModal onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>{selectedRun?.name}</ModalTitle>
            <ModalClose onClick={() => setShowDetailModal(false)}>×</ModalClose>
          </ModalHeader>

          {selectedRun && (
            <>
              <Tabs
                tabs={[
                  { id: 'overview', label: 'Overview' },
                  { id: 'metrics', label: 'Metrics' },
                  { id: 'config', label: 'Configuration' },
                  { id: 'artifacts', label: 'Artifacts' }
                ]}
                activeTab={activeDetailTab}
                onChange={setActiveDetailTab}
              />

              {activeDetailTab === 'overview' && (
                <div>
                  <p>{selectedRun.description || 'No description'}</p>
                  <MetaGrid>
                    <MetaItem>
                      <MetaLabel>Status</MetaLabel>
                      <MetaValue>{selectedRun.status}</MetaValue>
                    </MetaItem>
                    <MetaItem>
                      <MetaLabel>Seed</MetaLabel>
                      <MetaValue>{selectedRun.seed}</MetaValue>
                    </MetaItem>
                    <MetaItem>
                      <MetaLabel>Commit Hash</MetaLabel>
                      <MetaValue>{selectedRun.commitHash || 'N/A'}</MetaValue>
                    </MetaItem>
                    <MetaItem>
                      <MetaLabel>Created</MetaLabel>
                      <MetaValue>{new Date(selectedRun.createdAt).toLocaleString()}</MetaValue>
                    </MetaItem>
                  </MetaGrid>

                  {selectedRun.status === 'running' && (
                    <TrainingProgress>
                      <SectionTitle>Training Progress</SectionTitle>
                      <ProgressLabel>
                        <span>Epoch 45/100</span>
                        <span>45%</span>
                      </ProgressLabel>
                      <ProgressBar height="12px">
                        <ProgressFill progress={45} />
                      </ProgressBar>
                    </TrainingProgress>
                  )}
                </div>
              )}

              {activeDetailTab === 'metrics' && (
                <div>
                  {selectedRun.metrics && Object.keys(selectedRun.metrics).length > 0 ? (
                    <MetricsGrid>
                      {Object.entries(selectedRun.metrics).map(([key, value]) => (
                        <MetricCard key={key}>
                          <MetricValue>
                            {typeof value === 'number' ? value.toFixed(4) : JSON.stringify(value)}
                          </MetricValue>
                          <MetricLabel>{key}</MetricLabel>
                        </MetricCard>
                      ))}
                    </MetricsGrid>
                  ) : (
                    <EmptyState>No metrics available</EmptyState>
                  )}
                </div>
              )}

              {activeDetailTab === 'config' && (
                <div>
                  <Section>
                    <SectionTitle>Hyperparameters</SectionTitle>
                    <ConfigDisplay>
                      {JSON.stringify(selectedRun.hyperparameters || {}, null, 2)}
                    </ConfigDisplay>
                  </Section>
                  <Section>
                    <SectionTitle>Configuration</SectionTitle>
                    <ConfigDisplay>
                      {JSON.stringify(selectedRun.config || {}, null, 2)}
                    </ConfigDisplay>
                  </Section>
                </div>
              )}

              {activeDetailTab === 'artifacts' && (
                <EmptyState>
                  <EmptyStateText>Artifacts feature coming soon...</EmptyStateText>
                </EmptyState>
              )}
            </>
          )}
        </DetailModal>
      </Modal>
    </Container>
  );
};

export default Runs;
