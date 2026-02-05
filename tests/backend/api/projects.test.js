/**
 * Tests for Projects API
 */

const request = require('supertest');
const app = require('../../../server');
const db = require('../../../lib/database');

describe('Projects API', () => {
  let projectId;

  // Clean up before tests
  beforeAll(() => {
    // Create test database or use existing
  });

  // Clean up after tests
  afterAll(() => {
    // Clean up test data if needed
  });

  describe('POST /api/modellab/projects', () => {
    it('should create a new project', async () => {
      const response = await request(app)
        .post('/api/modellab/projects')
        .send({
          name: 'Test Project',
          description: 'Test project for automated testing'
        })
        .expect(201);

      expect(response.body.project).toBeDefined();
      expect(response.body.project.id).toBeDefined();
      expect(response.body.project.name).toBe('Test Project');
      expect(response.body.project.description).toBe('Test project for automated testing');

      projectId = response.body.project.id;
    });

    it('should fail with invalid data', async () => {
      await request(app)
        .post('/api/modellab/projects')
        .send({
          // Missing required name field
          description: 'No name provided'
        })
        .expect(400);
    });

    it('should fail with empty name', async () => {
      await request(app)
        .post('/api/modellab/projects')
        .send({
          name: '',
          description: 'Empty name'
        })
        .expect(400);
    });
  });

  describe('GET /api/modellab/projects', () => {
    it('should list all projects', async () => {
      const response = await request(app)
        .get('/api/modellab/projects')
        .expect(200);

      expect(response.body.projects).toBeDefined();
      expect(Array.isArray(response.body.projects)).toBe(true);
      expect(response.body.projects.length).toBeGreaterThan(0);

      // Check that projects have stats
      const project = response.body.projects[0];
      expect(project.datasetCount).toBeDefined();
      expect(project.runCount).toBeDefined();
      expect(project.lastActivity).toBeDefined();
    });
  });

  describe('GET /api/modellab/projects/:id', () => {
    it('should get a specific project', async () => {
      const response = await request(app)
        .get(`/api/modellab/projects/${projectId}`)
        .expect(200);

      expect(response.body.project).toBeDefined();
      expect(response.body.project.id).toBe(projectId);
      expect(response.body.project.name).toBe('Test Project');
    });

    it('should return 404 for non-existent project', async () => {
      await request(app)
        .get('/api/modellab/projects/9999999999999-xxxxxxxxx')
        .expect(404);
    });
  });

  describe('PUT /api/modellab/projects/:id', () => {
    it('should update a project', async () => {
      const response = await request(app)
        .put(`/api/modellab/projects/${projectId}`)
        .send({
          name: 'Updated Test Project',
          description: 'Updated description'
        })
        .expect(200);

      expect(response.body.project.name).toBe('Updated Test Project');
      expect(response.body.project.description).toBe('Updated description');
    });

    it('should return 404 for non-existent project', async () => {
      await request(app)
        .put('/api/modellab/projects/9999999999999-xxxxxxxxx')
        .send({
          name: 'Should Fail'
        })
        .expect(404);
    });
  });

  describe('GET /api/modellab/projects/:id/datasets', () => {
    it('should list datasets for a project', async () => {
      const response = await request(app)
        .get(`/api/modellab/projects/${projectId}/datasets`)
        .expect(200);

      expect(response.body.datasets).toBeDefined();
      expect(Array.isArray(response.body.datasets)).toBe(true);
    });
  });

  describe('GET /api/modellab/projects/:id/runs', () => {
    it('should list runs for a project', async () => {
      const response = await request(app)
        .get(`/api/modellab/projects/${projectId}/runs`)
        .expect(200);

      expect(response.body.runs).toBeDefined();
      expect(Array.isArray(response.body.runs)).toBe(true);
    });
  });

  describe('DELETE /api/modellab/projects/:id', () => {
    it('should delete a project', async () => {
      await request(app)
        .delete(`/api/modellab/projects/${projectId}`)
        .expect(204);

      // Verify it's deleted
      await request(app)
        .get(`/api/modellab/projects/${projectId}`)
        .expect(404);
    });

    it('should return 404 for non-existent project', async () => {
      await request(app)
        .delete('/api/modellab/projects/9999999999999-xxxxxxxxx')
        .expect(404);
    });
  });
});
