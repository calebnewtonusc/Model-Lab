/**
 * Tests for Runs API
 */

const request = require('supertest');
const app = require('../../../server');

describe('Runs API', () => {
  let runId;
  let projectId;
  let datasetId;

  beforeAll(async () => {
    // Create test project
    const projectResponse = await request(app)
      .post('/api/modellab/projects')
      .send({
        name: 'Run Test Project',
        description: 'Project for run tests'
      });
    projectId = projectResponse.body.project.id;

    // Note: In a real test, we'd upload a dataset here
    // For now, we'll create a run without a dataset_id
  });

  afterAll(async () => {
    // Clean up
    if (projectId) {
      await request(app).delete(`/api/modellab/projects/${projectId}`);
    }
  });

  describe('POST /api/modellab/runs', () => {
    it('should create a new run', async () => {
      const response = await request(app)
        .post('/api/modellab/runs')
        .send({
          name: 'Test Run',
          project_id: projectId,
          model_type: 'LogisticRegression',
          hyperparameters: {
            max_iter: 1000,
            C: 1.0
          },
          seed: 42
        })
        .expect(201);

      expect(response.body.run).toBeDefined();
      expect(response.body.run.id).toBeDefined();
      expect(response.body.run.name).toBe('Test Run');
      expect(response.body.run.project_id).toBe(projectId);
      expect(response.body.run.model_type).toBe('LogisticRegression');
      expect(response.body.run.status).toBe('created');
      expect(response.body.run.seed).toBe(42);

      runId = response.body.run.id;
    });

    it('should fail without required name', async () => {
      await request(app)
        .post('/api/modellab/runs')
        .send({
          model_type: 'RandomForest'
        })
        .expect(400);
    });

    it('should create run with tags', async () => {
      const response = await request(app)
        .post('/api/modellab/runs')
        .send({
          name: 'Tagged Run',
          project_id: projectId,
          model_type: 'XGBoost',
          tags: ['baseline', 'experiment-1']
        })
        .expect(201);

      expect(response.body.run.tags).toEqual(['baseline', 'experiment-1']);
    });
  });

  describe('GET /api/modellab/runs', () => {
    it('should list all runs', async () => {
      const response = await request(app)
        .get('/api/modellab/runs')
        .expect(200);

      expect(response.body.runs).toBeDefined();
      expect(Array.isArray(response.body.runs)).toBe(true);
      expect(response.body.runs.length).toBeGreaterThan(0);
    });

    it('should filter runs by project_id', async () => {
      const response = await request(app)
        .get('/api/modellab/runs')
        .query({ project_id: projectId })
        .expect(200);

      expect(response.body.runs.every(r => r.project_id === projectId)).toBe(true);
    });

    it('should filter runs by model_type', async () => {
      const response = await request(app)
        .get('/api/modellab/runs')
        .query({ model_type: 'LogisticRegression' })
        .expect(200);

      expect(response.body.runs.every(r => r.model_type === 'LogisticRegression')).toBe(true);
    });

    it('should filter runs by status', async () => {
      const response = await request(app)
        .get('/api/modellab/runs')
        .query({ status: 'created' })
        .expect(200);

      expect(response.body.runs.every(r => r.status === 'created')).toBe(true);
    });
  });

  describe('GET /api/modellab/runs/:id', () => {
    it('should get a specific run', async () => {
      const response = await request(app)
        .get(`/api/modellab/runs/${runId}`)
        .expect(200);

      expect(response.body.run).toBeDefined();
      expect(response.body.run.id).toBe(runId);
      expect(response.body.run.name).toBe('Test Run');
      expect(response.body.run.hyperparameters).toEqual({
        max_iter: 1000,
        C: 1.0
      });
    });

    it('should return 404 for non-existent run', async () => {
      await request(app)
        .get('/api/modellab/runs/9999999999999-xxxxxxxxx')
        .expect(404);
    });
  });

  describe('PUT /api/modellab/runs/:id', () => {
    it('should update run metadata', async () => {
      const response = await request(app)
        .put(`/api/modellab/runs/${runId}`)
        .send({
          name: 'Updated Test Run',
          status: 'running'
        })
        .expect(200);

      expect(response.body.run.name).toBe('Updated Test Run');
      expect(response.body.run.status).toBe('running');
    });

    it('should update run with metrics', async () => {
      const response = await request(app)
        .put(`/api/modellab/runs/${runId}`)
        .send({
          status: 'completed',
          metrics: {
            accuracy: 0.95,
            precision: 0.93,
            recall: 0.92
          }
        })
        .expect(200);

      expect(response.body.run.status).toBe('completed');
      expect(response.body.run.metrics).toEqual({
        accuracy: 0.95,
        precision: 0.93,
        recall: 0.92
      });
    });

    it('should return 404 for non-existent run', async () => {
      await request(app)
        .put('/api/modellab/runs/9999999999999-xxxxxxxxx')
        .send({ name: 'Should Fail' })
        .expect(404);
    });
  });

  describe('GET /api/modellab/runs/:id/repro', () => {
    it('should get reproducibility pack', async () => {
      const response = await request(app)
        .get(`/api/modellab/runs/${runId}/repro`)
        .expect(200);

      expect(response.body.reproPack).toBeDefined();
      expect(response.body.reproPack.run).toBeDefined();
      expect(response.body.reproPack.reproduceCommand).toBeDefined();
      expect(response.body.reproPack.environment).toBeDefined();
    });

    it('should return 404 for non-existent run', async () => {
      await request(app)
        .get('/api/modellab/runs/nonexistent/repro')
        .expect(404);
    });
  });

  describe('DELETE /api/modellab/runs/:id', () => {
    it('should delete a run', async () => {
      await request(app)
        .delete(`/api/modellab/runs/${runId}`)
        .expect(204);

      // Verify it's deleted
      await request(app)
        .get(`/api/modellab/runs/${runId}`)
        .expect(404);
    });

    it('should return 404 for non-existent run', async () => {
      await request(app)
        .delete('/api/modellab/runs/9999999999999-xxxxxxxxx')
        .expect(404);
    });
  });
});
