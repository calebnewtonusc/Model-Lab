import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { API_ENDPOINTS } from '../../config/api';

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

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const DatasetsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
`;

const DatasetCard = styled.div`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.text_primary + '12'};
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    border-color: ${({ theme }) => theme.primary};
  }
`;

const DatasetName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 0.5rem;
`;

const DatasetDescription = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text_secondary};
  margin-bottom: 1rem;
  line-height: 1.5;
`;

const DatasetMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const MetaItem = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.text_secondary};

  span {
    font-weight: 600;
    color: ${({ theme }) => theme.primary};
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Tag = styled.span`
  padding: 0.25rem 0.75rem;
  background: ${({ theme }) => theme.primary + '20'};
  color: ${({ theme }) => theme.primary};
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
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

const ModalTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 1.5rem;
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

const DropZone = styled.div`
  border: 2px dashed ${({ isDragging, theme }) =>
    isDragging ? theme.primary : theme.text_primary + '30'};
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  background: ${({ isDragging, theme }) =>
    isDragging ? theme.primary + '10' : theme.bg};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.primary + '10'};
  }
`;

const DropZoneText = styled.p`
  color: ${({ theme }) => theme.text_secondary};
  margin: 0;
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

const UploadProgress = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: ${({ theme }) => theme.bg};
  border-radius: 8px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${({ theme }) => theme.text_primary + '20'};
  border-radius: 4px;
  overflow: hidden;
  margin-top: 0.5rem;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${({ theme }) => theme.primary};
  width: ${({ progress }) => progress}%;
  transition: width 0.3s ease;
`;

const Datasets = () => {
  const [datasets, setDatasets] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tags: '',
    file: null
  });

  useEffect(() => {
    fetchDatasets();
  }, []);

  const fetchDatasets = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.datasets);
      const data = await response.json();
      setDatasets(data.datasets || []);
    } catch (error) {
      console.error('Error fetching datasets:', error);
    }
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setFormData(prev => ({ ...prev, file: files[0] }));
    }
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, file }));
    }
  };

  const handleUpload = async () => {
    if (!formData.file) {
      alert('Please select a file');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', formData.file);
      uploadFormData.append('name', formData.name || formData.file.name);
      uploadFormData.append('description', formData.description);
      uploadFormData.append('tags', JSON.stringify(
        formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      ));

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setUploadProgress(percentComplete);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 201) {
          setShowUploadModal(false);
          setFormData({ name: '', description: '', tags: '', file: null });
          fetchDatasets();
        } else {
          alert('Upload failed: ' + xhr.responseText);
        }
        setUploading(false);
        setUploadProgress(0);
      });

      xhr.addEventListener('error', () => {
        alert('Upload failed');
        setUploading(false);
        setUploadProgress(0);
      });

      xhr.open('POST', '/api/modellab/datasets');
      xhr.send(uploadFormData);

    } catch (error) {
      console.error('Error uploading dataset:', error);
      alert('Upload failed: ' + error.message);
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Container>
      <Header>
        <Title>Datasets</Title>
        <Button onClick={() => setShowUploadModal(true)}>
          Upload Dataset
        </Button>
      </Header>

      <DatasetsGrid>
        {datasets.map(dataset => (
          <DatasetCard key={dataset.id}>
            <DatasetName>{dataset.name}</DatasetName>
            <DatasetDescription>
              {dataset.description || 'No description provided'}
            </DatasetDescription>
            <DatasetMeta>
              <MetaItem>
                <span>{dataset.rowCount?.toLocaleString()}</span> rows
              </MetaItem>
              <MetaItem>
                <span>{dataset.schema?.columns?.length || 0}</span> columns
              </MetaItem>
              <MetaItem>
                <span>{formatFileSize(dataset.fileSize)}</span>
              </MetaItem>
              <MetaItem>
                Type: <span>{dataset.fileType}</span>
              </MetaItem>
            </DatasetMeta>
            <MetaItem style={{ fontSize: '0.75rem' }}>
              Checksum: {dataset.checksum?.substring(0, 16)}...
            </MetaItem>
            {dataset.tags && dataset.tags.length > 0 && (
              <TagsContainer>
                {dataset.tags.map((tag, idx) => (
                  <Tag key={idx}>{tag}</Tag>
                ))}
              </TagsContainer>
            )}
          </DatasetCard>
        ))}
      </DatasetsGrid>

      {showUploadModal && (
        <Modal onClick={() => !uploading && setShowUploadModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Upload Dataset</ModalTitle>

            <FormGroup>
              <Label>Dataset Name (optional)</Label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter dataset name"
              />
            </FormGroup>

            <FormGroup>
              <Label>Description (optional)</Label>
              <TextArea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your dataset"
              />
            </FormGroup>

            <FormGroup>
              <Label>Tags (comma-separated, optional)</Label>
              <Input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="e.g., training, validation, test"
              />
            </FormGroup>

            <FormGroup>
              <Label>File (CSV or JSON)</Label>
              <input
                type="file"
                id="file-input"
                accept=".csv,.json"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              <DropZone
                isDragging={isDragging}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input').click()}
              >
                <DropZoneText>
                  {formData.file
                    ? `Selected: ${formData.file.name}`
                    : 'Drag and drop a file here, or click to select'}
                </DropZoneText>
              </DropZone>
            </FormGroup>

            {uploading && (
              <UploadProgress>
                <DropZoneText>Uploading... {uploadProgress.toFixed(0)}%</DropZoneText>
                <ProgressBar>
                  <ProgressFill progress={uploadProgress} />
                </ProgressBar>
              </UploadProgress>
            )}

            <ButtonGroup>
              <Button onClick={handleUpload} disabled={uploading || !formData.file}>
                {uploading ? 'Uploading...' : 'Upload'}
              </Button>
              <SecondaryButton onClick={() => setShowUploadModal(false)} disabled={uploading}>
                Cancel
              </SecondaryButton>
            </ButtonGroup>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default Datasets;
