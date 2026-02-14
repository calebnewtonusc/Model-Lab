import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { LoadingContainer, Spinner, LoadingText, Card, Badge, EmptyState, Button } from './components/SharedComponents';
import { API_ENDPOINTS } from '../../config/api';
import { Clock, Folder } from 'lucide-react';

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing?.[8] || "2rem"};
  max-width: 1600px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing?.[8] || "2rem"};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing?.[4] || "1rem"};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSize?.['4xl'] || '2.25rem'};
  font-weight: ${({ theme }) => theme.fontWeight?.bold || 700};
  color: ${({ theme }) => theme.text_primary};
  margin: 0;
  line-height: ${({ theme }) => theme.lineHeight?.tight || "1.25"};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSize?.lg || "1.125rem"};
  color: ${({ theme }) => theme.text_secondary};
  line-height: ${({ theme }) => theme.lineHeight?.normal || "1.5"};
  margin-top: ${({ theme }) => theme.spacing?.[2] || "0.5rem"};
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: ${({ theme }) => theme.spacing?.[6] || "1.5rem"};
  margin-bottom: ${({ theme }) => theme.spacing?.[8] || "2rem"};
`;

const ProjectCard = styled(Card)`
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadow?.lg || theme.elevation?.lg || "0 10px 15px rgba(0,0,0,0.1)"};
    border-color: ${({ theme }) => theme.primary};
  }
`;

const ProjectHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing?.[4] || "1rem"};
`;

const ProjectName = styled.h3`
  font-size: ${({ theme }) => theme.fontSize?.['2xl'] || '1.5rem'};
  font-weight: ${({ theme }) => theme.fontWeight?.semibold || 600};
  color: ${({ theme }) => theme.text_primary};
  margin: 0 0 ${({ theme }) => theme.spacing?.[2] || "0.5rem"} 0;
`;

const ProjectDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSize?.base || '1rem'};
  color: ${({ theme }) => theme.text_secondary};
  line-height: ${({ theme }) => theme.lineHeight?.relaxed || "1.75"};
  margin: 0 0 ${({ theme }) => theme.spacing?.[4] || "1rem"} 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProjectStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing?.[4] || "1rem"};
  padding-top: ${({ theme }) => theme.spacing?.[4] || "1rem"};
  border-top: 1px solid ${({ theme }) => theme.border};
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.fontSize?.['2xl'] || '1.5rem'};
  font-weight: ${({ theme }) => theme.fontWeight?.bold || 700};
  color: ${({ theme }) => theme.primary};
  margin-bottom: ${({ theme }) => theme.spacing?.[1] || "0.25rem"};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSize?.xs || "0.75rem"};
  color: ${({ theme }) => theme.text_tertiary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const LastActivity = styled.div`
  font-size: ${({ theme }) => theme.fontSize?.xs || "0.75rem"};
  color: ${({ theme }) => theme.text_tertiary};
  margin-top: ${({ theme }) => theme.spacing?.[3] || "0.75rem"};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing?.[2] || "0.5rem"};
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing?.[4] || "1rem"};
`;

const Modal = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius?.lg || "0.75rem"};
  padding: ${({ theme }) => theme.spacing?.[8] || "2rem"};
  max-width: 600px;
  width: 100%;
  box-shadow: ${({ theme }) => theme.shadow?.xl || theme.elevation?.xl || "0 20px 25px rgba(0,0,0,0.1)"};
`;

const ModalTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSize?.['2xl'] || '1.5rem'};
  font-weight: ${({ theme }) => theme.fontWeight?.bold || 700};
  color: ${({ theme }) => theme.text_primary};
  margin: 0 0 ${({ theme }) => theme.spacing?.[6] || "1.5rem"} 0;
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing?.[6] || "1.5rem"};
`;

const Label = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.fontSize?.sm || "0.875rem"};
  font-weight: ${({ theme }) => theme.fontWeight?.medium || 500};
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: ${({ theme }) => theme.spacing?.[2] || "0.5rem"};
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing?.[3] || "0.75rem"};
  font-size: ${({ theme }) => theme.fontSize?.base || '1rem'};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.borderRadius?.md || "0.375rem"};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.primary}20;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing?.[3] || "0.75rem"};
  font-size: ${({ theme }) => theme.fontSize?.base || '1rem'};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.borderRadius?.md || "0.375rem"};
  transition: all 0.2s ease;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.primary}20;
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing?.[3] || "0.75rem"};
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing?.[6] || "1.5rem"};
`;

const SecondaryButton = styled(Button)`
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text_primary};
  border: 1px solid ${({ theme }) => theme.border};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.background_secondary};
  }
`;

const ErrorMessage = styled.div`
  background: ${({ theme }) => theme.error}10;
  color: ${({ theme }) => theme.error};
  padding: ${({ theme }) => theme.spacing?.[3] || "0.75rem"};
  border-radius: ${({ theme }) => theme.borderRadius?.md || "0.375rem"};
  margin-bottom: ${({ theme }) => theme.spacing?.[4] || "1rem"};
  font-size: ${({ theme }) => theme.fontSize?.sm || "0.875rem"};
`;

const ProjectsEnhanced = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_ENDPOINTS.projects);
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      setProjects(data.projects || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setCreateError('Project name is required');
      return;
    }

    try {
      setCreating(true);
      setCreateError(null);
      const response = await fetch(API_ENDPOINTS.projects, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create project');
      }

      await fetchProjects();
      setShowCreateModal(false);
      setFormData({ name: '', description: '' });
    } catch (err) {
      setCreateError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <LoadingContainer>
        <Spinner />
        <LoadingText>Loading projects...</LoadingText>
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <Container>
        <EmptyState>
          Error loading projects: {error}
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <div>
          <Title>Projects</Title>
          <Subtitle>Organize your experiments with project workspaces</Subtitle>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          + New Project
        </Button>
      </Header>

      {projects.length === 0 ? (
        <EmptyState>
          <div style={{ marginBottom: '1rem' }}><Folder size={48} color="#10b981" /></div>
          <div style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            No projects yet
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            Create your first project to organize datasets and runs
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            Create Project
          </Button>
        </EmptyState>
      ) : (
        <ProjectsGrid>
          {projects.map((project) => (
            <ProjectCard key={project.id}>
              <ProjectHeader>
                <div style={{ flex: 1 }}>
                  <ProjectName>{project.name}</ProjectName>
                  {project.description && (
                    <ProjectDescription>{project.description}</ProjectDescription>
                  )}
                </div>
              </ProjectHeader>

              <ProjectStats>
                <StatItem>
                  <StatValue>{project.datasetCount || 0}</StatValue>
                  <StatLabel>Datasets</StatLabel>
                </StatItem>
                <StatItem>
                  <StatValue>{project.runCount || 0}</StatValue>
                  <StatLabel>Runs</StatLabel>
                </StatItem>
                <StatItem>
                  <StatValue>
                    {project.completedRuns || 0}/{project.runCount || 0}
                  </StatValue>
                  <StatLabel>Completed</StatLabel>
                </StatItem>
              </ProjectStats>

              {project.lastActivity && (
                <LastActivity>
                  <Clock size={14} />
                  Last activity: {formatDate(project.lastActivity)}
                </LastActivity>
              )}
            </ProjectCard>
          ))}
        </ProjectsGrid>
      )}

      {showCreateModal && (
        <ModalOverlay onClick={() => setShowCreateModal(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Create New Project</ModalTitle>

            {createError && <ErrorMessage>{createError}</ErrorMessage>}

            <form onSubmit={handleCreateProject}>
              <FormGroup>
                <Label>Project Name *</Label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter project name"
                  autoFocus
                  disabled={creating}
                />
              </FormGroup>

              <FormGroup>
                <Label>Description</Label>
                <TextArea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the purpose of this project (optional)"
                  disabled={creating}
                />
              </FormGroup>

              <ModalActions>
                <SecondaryButton
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  disabled={creating}
                >
                  Cancel
                </SecondaryButton>
                <Button type="submit" disabled={creating || !formData.name.trim()}>
                  {creating ? 'Creating...' : 'Create Project'}
                </Button>
              </ModalActions>
            </form>
          </Modal>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default ProjectsEnhanced;
