/**
 * Tests for Datasets API
 */

const request = require('supertest');
const path = require('path');
const fs = require('fs');
const app = require('../../../server');

describe('Datasets API', () => {
  let datasetId;
  let projectId;

  beforeAll(async () => {
    // Create a test project first
    const projectResponse = await request(app)
      .post('/api/modellab/projects')
      .send({
        name: 'Dataset Test Project',
        description: 'Project for dataset tests'
      });

    projectId = projectResponse.body.project.id;
  });

  afterAll(async () => {
    // Clean up test project
    if (projectId) {
      await request(app).delete(`/api/modellab/projects/${projectId}`);
    }
  });

  describe('POST /api/modellab/datasets/upload', () => {
    it('should upload a CSV dataset', async () => {
      // Create a temporary test CSV file
      const testCsvPath = path.join(__dirname, 'test_data.csv');
      const csvContent = 'feature1,feature2,label\n1,2,0\n3,4,1\n5,6,0\n';
      fs.writeFileSync(testCsvPath, csvContent);

      const response = await request(app)
        .post('/api/modellab/datasets/upload')
        .field('name', 'Test Dataset')
        .field('description', 'Test dataset for API testing')
        .field('project_id', projectId)
        .attach('file', testCsvPath)
        .expect(201);

      expect(response.body.dataset).toBeDefined();
      expect(response.body.dataset.id).toBeDefined();
      expect(response.body.dataset.name).toBe('Test Dataset');
      expect(response.body.dataset.project_id).toBe(projectId);
      expect(response.body.dataset.rowCount).toBe(3);
      expect(response.body.dataset.columns).toEqual(['feature1', 'feature2', 'label']);

      datasetId = response.body.dataset.id;

      // Clean up test file
      fs.unlinkSync(testCsvPath);
    });

    it('should fail without file', async () => {
      await request(app)
        .post('/api/modellab/datasets/upload')
        .field('name', 'No File Dataset')
        .expect(400);
    });

    it('should fail without name', async () => {
      const testCsvPath = path.join(__dirname, 'test_data2.csv');
      fs.writeFileSync(testCsvPath, 'a,b,c\n1,2,3\n');

      await request(app)
        .post('/api/modellab/datasets/upload')
        .attach('file', testCsvPath)
        .expect(400);

      fs.unlinkSync(testCsvPath);
    });
  });

  describe('GET /api/modellab/datasets', () => {
    it('should list all datasets', async () => {
      const response = await request(app)
        .get('/api/modellab/datasets')
        .expect(200);

      expect(response.body.datasets).toBeDefined();
      expect(Array.isArray(response.body.datasets)).toBe(true);
      expect(response.body.datasets.length).toBeGreaterThan(0);
    });

    it('should filter datasets by project_id', async () => {
      const response = await request(app)
        .get('/api/modellab/datasets')
        .query({ project_id: projectId })
        .expect(200);

      expect(response.body.datasets).toBeDefined();
      expect(response.body.datasets.every(d => d.project_id === projectId)).toBe(true);
    });
  });

  describe('GET /api/modellab/datasets/:id', () => {
    it('should get a specific dataset', async () => {
      const response = await request(app)
        .get(`/api/modellab/datasets/${datasetId}`)
        .expect(200);

      expect(response.body.dataset).toBeDefined();
      expect(response.body.dataset.id).toBe(datasetId);
      expect(response.body.dataset.name).toBe('Test Dataset');
      expect(response.body.dataset.rowCount).toBe(3);
      expect(response.body.dataset.columns).toEqual(['feature1', 'feature2', 'label']);
    });

    it('should return 404 for non-existent dataset', async () => {
      await request(app)
        .get('/api/modellab/datasets/9999999999999-xxxxxxxxx')
        .expect(404);
    });
  });

  describe('GET /api/modellab/datasets/:id/preview', () => {
    it('should preview dataset rows', async () => {
      const response = await request(app)
        .get(`/api/modellab/datasets/${datasetId}/preview`)
        .expect(200);

      expect(response.body.rows).toBeDefined();
      expect(Array.isArray(response.body.rows)).toBe(true);
      expect(response.body.rows.length).toBeLessThanOrEqual(10); // Default limit
    });

    it('should respect limit parameter', async () => {
      const response = await request(app)
        .get(`/api/modellab/datasets/${datasetId}/preview`)
        .query({ limit: 2 })
        .expect(200);

      expect(response.body.rows.length).toBeLessThanOrEqual(2);
    });
  });

  describe('PUT /api/modellab/datasets/:id', () => {
    it('should update dataset metadata', async () => {
      const response = await request(app)
        .put(`/api/modellab/datasets/${datasetId}`)
        .send({
          name: 'Updated Test Dataset',
          description: 'Updated description'
        })
        .expect(200);

      expect(response.body.dataset.name).toBe('Updated Test Dataset');
      expect(response.body.dataset.description).toBe('Updated description');
    });

    it('should return 404 for non-existent dataset', async () => {
      await request(app)
        .put('/api/modellab/datasets/9999999999999-xxxxxxxxx')
        .send({ name: 'Should Fail' })
        .expect(404);
    });
  });

  describe('DELETE /api/modellab/datasets/:id', () => {
    it('should delete a dataset', async () => {
      await request(app)
        .delete(`/api/modellab/datasets/${datasetId}`)
        .expect(204);

      // Verify it's deleted
      await request(app)
        .get(`/api/modellab/datasets/${datasetId}`)
        .expect(404);
    });

    it('should return 404 for non-existent dataset', async () => {
      await request(app)
        .delete('/api/modellab/datasets/9999999999999-xxxxxxxxx')
        .expect(404);
    });
  });
});
