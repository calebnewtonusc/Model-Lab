import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { API_ENDPOINTS } from '../../config/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Container = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.primary}dd;
    transform: translateY(-1px);
  }
`;

const RunsGrid = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const RunCard = styled.div`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.text_primary + '12'};
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const RunHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const RunName = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  margin: 0;
`;

const StatusBadge = styled.span`
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-size: 0.875rem;
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

const RunDescription = styled.p`
  color: ${({ theme }) => theme.text_secondary};
  margin-bottom: 1.5rem;
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

const Section = styled.div`
  margin-top: 1.5rem;
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

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: 12px;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
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

const Input = styled.input`
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

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  background: ${({ theme }) => theme.bg};
  border: 1px solid ${({ theme }) => theme.text_primary + '20'};
  border-radius: 8px;
  color: ${({ theme }) => theme.text_primary};
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const SecondaryButton = styled(Button)`
  background: transparent;
  color: ${({ theme }) => theme.text_primary};
  border: 1px solid ${({ theme }) => theme.text_primary + '30'};

  &:hover {
    background: ${({ theme }) => theme.text_primary + '10'};
  }
`;

const Runs = () => {
  const [runs, setRuns] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    datasetId: '',
    status: 'pending',
    hyperparameters: '{}',
    config: '{}'
  });

  useEffect(() => {
    fetchRuns();
    fetchDatasets();
  }, []);

  const fetchRuns = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.runs);
      const data = await response.json();
      setRuns(data.runs || []);
    } catch (error) {
      console.error('Error fetching runs:', error);
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

  const handleCreateRun = async () => {
    try {
      let hyperparameters = {};
      let config = {};

      try {
        hyperparameters = JSON.parse(formData.hyperparameters);
        config = JSON.parse(formData.config);
      } catch (e) {
        alert('Invalid JSON in hyperparameters or config');
        return;
      }

      const response = await fetch(API_ENDPOINTS.runs, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          datasetId: formData.datasetId || null,
          status: formData.status,
          hyperparameters,
          config
        })
      });

      if (response.ok) {
        setShowCreateModal(false);
        setFormData({
          name: '',
          description: '',
          datasetId: '',
          status: 'pending',
          hyperparameters: '{}',
          config: '{}'
        });
        fetchRuns();
      } else {
        alert('Failed to create run');
      }
    } catch (error) {
      console.error('Error creating run:', error);
      alert('Failed to create run: ' + error.message);
    }
  };

  return (
    <Container>
      <Header>
        <Title>Runs</Title>
        <Button onClick={() => setShowCreateModal(true)}>
          Create Run
        </Button>
      </Header>

      <RunsGrid>
        {runs.map(run => (
          <RunCard key={run.id}>
            <RunHeader>
              <RunName>{run.name}</RunName>
              <StatusBadge status={run.status}>{run.status}</StatusBadge>
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
                <MetaLabel>Commit Hash</MetaLabel>
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
              <Section>
                <SectionTitle>Metrics</SectionTitle>
                <MetricsGrid>
                  {Object.entries(run.metrics).map(([key, value]) => (
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
              </Section>
            )}

            {run.hyperparameters && Object.keys(run.hyperparameters).length > 0 && (
              <Section>
                <SectionTitle>Hyperparameters</SectionTitle>
                <ConfigDisplay>
                  {JSON.stringify(run.hyperparameters, null, 2)}
                </ConfigDisplay>
              </Section>
            )}
          </RunCard>
        ))}
      </RunsGrid>

      {showCreateModal && (
        <Modal onClick={() => setShowCreateModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <Title style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>
              Create New Run
            </Title>

            <FormGroup>
              <Label>Run Name</Label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter run name"
              />
            </FormGroup>

            <FormGroup>
              <Label>Description</Label>
              <TextArea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe this run"
              />
            </FormGroup>

            <FormGroup>
              <Label>Dataset</Label>
              <Select
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
            </FormGroup>

            <FormGroup>
              <Label>Status</Label>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="pending">Pending</option>
                <option value="running">Running</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Hyperparameters (JSON)</Label>
              <TextArea
                value={formData.hyperparameters}
                onChange={(e) => setFormData({ ...formData, hyperparameters: e.target.value })}
                placeholder='{"learning_rate": 0.001, "batch_size": 32}'
                style={{ fontFamily: 'monospace' }}
              />
            </FormGroup>

            <FormGroup>
              <Label>Config (JSON)</Label>
              <TextArea
                value={formData.config}
                onChange={(e) => setFormData({ ...formData, config: e.target.value })}
                placeholder='{"model": "resnet50", "optimizer": "adam"}'
                style={{ fontFamily: 'monospace' }}
              />
            </FormGroup>

            <ButtonGroup>
              <Button onClick={handleCreateRun}>Create</Button>
              <SecondaryButton onClick={() => setShowCreateModal(false)}>
                Cancel
              </SecondaryButton>
            </ButtonGroup>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default Runs;
