import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import {
  BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell
} from 'recharts';
import {
  Card, Button, Input, TextArea, Select, Modal, ModalContent, ModalHeader,
  ModalTitle, ModalClose, ProgressBar, ProgressFill, Badge, Table, Th, Td,
  Tabs, LoadingContainer, Spinner, LoadingText, EmptyState, EmptyStateTitle,
  EmptyStateText, Skeleton
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

const SearchBar = styled(Input)`
  max-width: 400px;
  margin-bottom: ${({ theme }) => theme.spacing?.[6] || "1.5rem"};
`;

const DatasetsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: ${({ theme }) => theme.spacing?.[6] || "1.5rem"};
`;

const DatasetCard = styled(Card)`
  cursor: pointer;
  border: 2px solid ${({ theme }) => theme.border};

  &:hover {
    border-color: ${({ theme }) => theme.primary?.[500] || '#10b981'};
  }
`;

const DatasetName = styled.h3`
  font-size: ${({ theme }) => theme.fontSize?.xl || "1.25rem"};
  font-weight: ${({ theme }) => theme.fontWeight?.semibold || 600};
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: ${({ theme }) => theme.spacing?.[2] || "0.5rem"};
  line-height: ${({ theme }) => theme.lineHeight?.tight || "1.25"};
`;

const DatasetDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSize?.sm || "0.875rem"};
  color: ${({ theme }) => theme.text_secondary};
  margin-bottom: ${({ theme }) => theme.spacing?.[4] || "1rem"};
  line-height: ${({ theme }) => theme.lineHeight?.normal || "1.5"};
`;

const DatasetMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing?.[4] || "1rem"};
  margin-bottom: ${({ theme }) => theme.spacing?.[4] || "1rem"};
`;

const MetaItem = styled.div`
  font-size: ${({ theme }) => theme.fontSize?.xs || "0.75rem"};
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

const Tag = styled(Badge)``;

const QualityScore = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${({ score, theme }) => {
    if (score >= 80) return '#10b981' + '20';
    if (score >= 60) return '#f59e0b' + '20';
    return '#ef4444' + '20';
  }};
  color: ${({ score }) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  }};
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const DropZone = styled.div`
  border: 2px dashed ${({ isDragging, theme }) =>
    isDragging ? theme.primary : theme.text_primary + '30'};
  border-radius: 8px;
  padding: 3rem 2rem;
  text-align: center;
  background: ${({ isDragging, theme }) =>
    isDragging ? theme.primary + '10' : theme.bg};
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1.5rem;

  &:hover {
    border-color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.primary + '10'};
  }
`;

const DropZoneIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const DropZoneText = styled.p`
  color: ${({ theme }) => theme.text_secondary};
  margin: 0.5rem 0;
  font-size: 1rem;
`;

const DropZoneHint = styled.p`
  color: ${({ theme }) => theme.text_secondary};
  font-size: 0.875rem;
  margin: 0;
`;

const FileList = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FileItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: ${({ theme }) => theme.bg};
  border-radius: 8px;
`;

const FileName = styled.span`
  color: ${({ theme }) => theme.text_primary};
  font-size: 0.875rem;
`;

const FileSize = styled.span`
  color: ${({ theme }) => theme.text_secondary};
  font-size: 0.875rem;
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const UploadProgress = styled.div`
  margin-top: 1rem;
`;

const ProgressText = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text_secondary};
`;

const DetailModal = styled(ModalContent)`
  max-width: 1200px;
`;

const DetailTabs = styled.div`
  margin-top: 1.5rem;
`;

const PreviewTable = styled.div`
  overflow-x: auto;
  margin: 1rem 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
`;

const StatCard = styled(Card)`
  padding: 1rem;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.text_secondary};
  text-transform: uppercase;
`;

const ColumnCard = styled(Card)`
  padding: 1rem;
  margin-bottom: 1rem;
`;

const ColumnName = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 0.5rem;
`;

const ColumnStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.5rem;
  font-size: 0.875rem;
`;

const ColumnStat = styled.div`
  color: ${({ theme }) => theme.text_secondary};

  span {
    color: ${({ theme }) => theme.text_primary};
    font-weight: 600;
  }
`;

const Datasets = () => {
  const [datasets, setDatasets] = useState([]);
  const [filteredDatasets, setFilteredDatasets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState('overview');
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tags: '',
    files: []
  });
  const [datasetPreview, setDatasetPreview] = useState(null);

  useEffect(() => {
    fetchDatasets();
  }, []);

  useEffect(() => {
    const filtered = datasets.filter(d =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.description && d.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (d.tags && d.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    );
    setFilteredDatasets(filtered);
  }, [datasets, searchTerm]);

  const fetchDatasets = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.datasets);
      const data = await response.json();
      const datasetsWithQuality = (data.datasets || []).map(d => ({
        ...d,
        qualityScore: calculateQualityScore(d)
      }));
      setDatasets(datasetsWithQuality);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching datasets:', error);
      setLoading(false);
    }
  };

  const calculateQualityScore = (dataset) => {
    let score = 100;

    // Penalize missing values
    if (dataset.schema && dataset.schema.columns) {
      const totalNulls = dataset.schema.columns.reduce((sum, col) => sum + (col.nullCount || 0), 0);
      const totalCells = dataset.rowCount * dataset.schema.columns.length;
      const missingPct = (totalNulls / totalCells) * 100;
      score -= missingPct;
    }

    // Bonus for having tags and description
    if (!dataset.description) score -= 5;
    if (!dataset.tags || dataset.tags.length === 0) score -= 5;

    return Math.max(0, Math.min(100, score)).toFixed(0);
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

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setFormData(prev => ({ ...prev, files: [...prev.files, ...files] }));
    }
  }, []);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setFormData(prev => ({ ...prev, files: [...prev.files, ...files] }));
    }
  };

  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const handleUpload = async () => {
    if (formData.files.length === 0) {
      alert('Please select at least one file');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const startTime = Date.now();

      for (let i = 0; i < formData.files.length; i++) {
        const file = formData.files[i];
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        uploadFormData.append('name', formData.name || file.name);
        uploadFormData.append('description', formData.description);
        uploadFormData.append('tags', JSON.stringify(
          formData.tags.split(',').map(t => t.trim()).filter(Boolean)
        ));

        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const fileProgress = ((i / formData.files.length) + (e.loaded / e.total / formData.files.length)) * 100;
            setUploadProgress(fileProgress);

            // Calculate upload speed
            const elapsed = (Date.now() - startTime) / 1000; // seconds
            const speed = e.loaded / elapsed / 1024 / 1024; // MB/s
            setUploadSpeed(speed);
          }
        });

        await new Promise((resolve, reject) => {
          xhr.addEventListener('load', () => {
            if (xhr.status === 201) {
              resolve();
            } else {
              reject(new Error('Upload failed: ' + xhr.responseText));
            }
          });

          xhr.addEventListener('error', () => {
            reject(new Error('Upload failed'));
          });

          xhr.open('POST', '/api/modellab/datasets');
          xhr.send(uploadFormData);
        });
      }

      setShowUploadModal(false);
      setFormData({ name: '', description: '', tags: '', files: [] });
      fetchDatasets();
      setUploading(false);
      setUploadProgress(0);
      setUploadSpeed(0);

    } catch (error) {
      console.error('Error uploading dataset:', error);
      alert('Upload failed: ' + error.message);
      setUploading(false);
      setUploadProgress(0);
      setUploadSpeed(0);
    }
  };

  const viewDatasetDetails = async (dataset) => {
    setSelectedDataset(dataset);
    setShowDetailModal(true);

    // Fetch preview data
    try {
      const response = await fetch(API_ENDPOINTS.datasetPreview(dataset.id));
      if (response.ok) {
        const data = await response.json();
        setDatasetPreview(data);
      }
    } catch (error) {
      console.error('Error fetching preview:', error);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatTimeRemaining = (speed, remaining) => {
    if (!speed || !remaining) return '';
    const seconds = remaining / (speed * 1024 * 1024);
    if (seconds < 60) return `${Math.round(seconds)}s remaining`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${Math.round(seconds % 60)}s remaining`;
  };

  const renderColumnStatistics = (column) => {
    if (!column) return null;

    return (
      <ColumnCard key={column.name}>
        <ColumnName>{column.name}</ColumnName>
        <ColumnStats>
          <ColumnStat>Type: <span>{column.type}</span></ColumnStat>
          <ColumnStat>Unique: <span>{column.uniqueCount}</span></ColumnStat>
          <ColumnStat>Nulls: <span>{column.nullCount || 0}</span></ColumnStat>
          {column.nullable && <Badge variant="warning">Nullable</Badge>}
        </ColumnStats>
        {column.examples && column.examples.length > 0 && (
          <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
            <strong>Examples:</strong> {column.examples.slice(0, 3).map(ex =>
              typeof ex === 'string' && ex.length > 20 ? ex.substring(0, 20) + '...' : String(ex)
            ).join(', ')}
          </div>
        )}
      </ColumnCard>
    );
  };

  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <Spinner size="60px" />
          <LoadingText>Loading datasets...</LoadingText>
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderContent>
          <Title>Datasets</Title>
          <Subtitle>Manage your training data with automatic versioning, SHA-256 checksums, and schema snapshots for full reproducibility.</Subtitle>
        </HeaderContent>
        <Button onClick={() => setShowUploadModal(true)}>
          Upload Dataset
        </Button>
      </Header>

      <SearchBar
        type="text"
        placeholder="Search datasets by name, description, or tags..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filteredDatasets.length === 0 ? (
        <EmptyState>
          <EmptyStateTitle>No Datasets Found</EmptyStateTitle>
          <EmptyStateText>
            {searchTerm ? 'Try adjusting your search' : 'Upload your first dataset to get started'}
          </EmptyStateText>
          <Button onClick={() => setShowUploadModal(true)}>Upload Dataset</Button>
        </EmptyState>
      ) : (
        <DatasetsGrid>
          {filteredDatasets.map(dataset => (
            <DatasetCard key={dataset.id} onClick={() => viewDatasetDetails(dataset)}>
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
              <QualityScore score={dataset.qualityScore}>
                Quality: {dataset.qualityScore}/100
              </QualityScore>
              {dataset.tags && dataset.tags.length > 0 && (
                <TagsContainer>
                  {dataset.tags.map((tag, idx) => (
                    <Tag key={idx} variant="info">{tag}</Tag>
                  ))}
                </TagsContainer>
              )}
            </DatasetCard>
          ))}
        </DatasetsGrid>
      )}

      <Modal show={showUploadModal} onClick={() => !uploading && setShowUploadModal(false)}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>Upload Dataset</ModalTitle>
            <ModalClose onClick={() => !uploading && setShowUploadModal(false)}>×</ModalClose>
          </ModalHeader>

          <input
            type="file"
            id="file-input"
            accept=".csv,.json"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            multiple
          />

          <DropZone
            isDragging={isDragging}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input').click()}
          >
            <DropZoneIcon>SF Symbol: folder.fill</DropZoneIcon>
            <DropZoneText>Drag and drop files here, or click to select</DropZoneText>
            <DropZoneHint>Supports CSV and JSON files (max 100MB each)</DropZoneHint>
          </DropZone>

          {formData.files.length > 0 && (
            <FileList>
              {formData.files.map((file, index) => (
                <FileItem key={index}>
                  <FileName>{file.name}</FileName>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <FileSize>{formatFileSize(file.size)}</FileSize>
                    <Button
                      variant="danger"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </FileItem>
              ))}
            </FileList>
          )}

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

          {uploading && (
            <UploadProgress>
              <ProgressText>
                <span>Uploading... {uploadProgress.toFixed(0)}%</span>
                <span>
                  {uploadSpeed.toFixed(2)} MB/s
                  {' | '}
                  {formatTimeRemaining(uploadSpeed, formData.files.reduce((sum, f) => sum + f.size, 0) * (1 - uploadProgress / 100))}
                </span>
              </ProgressText>
              <ProgressBar>
                <ProgressFill progress={uploadProgress} />
              </ProgressBar>
            </UploadProgress>
          )}

          <ButtonGroup>
            <Button onClick={handleUpload} disabled={uploading || formData.files.length === 0}>
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
            <Button variant="secondary" onClick={() => setShowUploadModal(false)} disabled={uploading}>
              Cancel
            </Button>
          </ButtonGroup>
        </ModalContent>
      </Modal>

      <Modal show={showDetailModal} onClick={() => setShowDetailModal(false)}>
        <DetailModal onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>{selectedDataset?.name}</ModalTitle>
            <ModalClose onClick={() => setShowDetailModal(false)}>×</ModalClose>
          </ModalHeader>

          <DetailTabs>
            <Tabs
              tabs={[
                { id: 'overview', label: 'Overview' },
                { id: 'schema', label: 'Schema' },
                { id: 'preview', label: 'Preview' },
                { id: 'statistics', label: 'Statistics' }
              ]}
              activeTab={activeDetailTab}
              onChange={setActiveDetailTab}
            />

            {activeDetailTab === 'overview' && selectedDataset && (
              <div>
                <p style={{ marginBottom: '1rem' }}>{selectedDataset.description || 'No description'}</p>
                <StatsGrid>
                  <StatCard>
                    <StatValue>{selectedDataset.rowCount?.toLocaleString()}</StatValue>
                    <StatLabel>Rows</StatLabel>
                  </StatCard>
                  <StatCard>
                    <StatValue>{selectedDataset.schema?.columns?.length || 0}</StatValue>
                    <StatLabel>Columns</StatLabel>
                  </StatCard>
                  <StatCard>
                    <StatValue>{formatFileSize(selectedDataset.fileSize)}</StatValue>
                    <StatLabel>File Size</StatLabel>
                  </StatCard>
                  <StatCard>
                    <StatValue>{selectedDataset.qualityScore}/100</StatValue>
                    <StatLabel>Quality Score</StatLabel>
                  </StatCard>
                </StatsGrid>
                <div style={{ marginTop: '1rem' }}>
                  <strong>Checksum:</strong> {selectedDataset.checksum}
                </div>
                <div style={{ marginTop: '0.5rem' }}>
                  <strong>Created:</strong> {new Date(selectedDataset.createdAt).toLocaleString()}
                </div>
              </div>
            )}

            {activeDetailTab === 'schema' && selectedDataset?.schema?.columns && (
              <div>
                {selectedDataset.schema.columns.map(col => renderColumnStatistics(col))}
              </div>
            )}

            {activeDetailTab === 'preview' && (
              <div>
                <PreviewTable>
                  {datasetPreview ? (
                    <Table>
                      <thead>
                        <tr>
                          {Object.keys(datasetPreview.preview[0] || {}).map(key => (
                            <Th key={key}>{key}</Th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {datasetPreview.preview.slice(0, 20).map((row, idx) => (
                          <tr key={idx}>
                            {Object.values(row).map((val, i) => (
                              <Td key={i}>
                                {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                              </Td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <LoadingText>Loading preview...</LoadingText>
                  )}
                </PreviewTable>
              </div>
            )}

            {activeDetailTab === 'statistics' && selectedDataset?.schema?.columns && (
              <div>
                <h4>Column Statistics</h4>
                {selectedDataset.schema.columns.map(col => (
                  <div key={col.name} style={{ marginBottom: '1rem' }}>
                    <strong>{col.name}:</strong> {col.uniqueCount} unique values, {col.nullCount || 0} missing
                  </div>
                ))}
              </div>
            )}
          </DetailTabs>
        </DetailModal>
      </Modal>
    </Container>
  );
};

export default Datasets;
