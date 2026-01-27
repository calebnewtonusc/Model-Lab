/**
 * Projects API Routes
 * Handles project workspace creation and management
 */

const express = require('express');
const path = require('path');
const router = express.Router();

// Import database and validation
const db = require(path.join(__dirname, '../../lib/database'));
const { validate, validateId, schemas } = require(path.join(__dirname, '../../lib/validation'));

// GET all projects
router.get('/', async (req, res) => {
  try {
    const projects = await db.getAllProjects();

    // Add stats for each project
    const projectsWithStats = await Promise.all(projects.map(async (project) => {
      const datasets = await db.getDatasetsByProjectId(project.id);
      const runs = await db.getRunsByProjectId(project.id);

      return {
        ...project,
        datasetCount: datasets.length,
        runCount: runs.length,
        lastActivity: runs.length > 0
          ? runs[0].created_at
          : (datasets.length > 0 ? datasets[0].created_at : project.created_at)
      };
    }));

    res.json({ projects: projectsWithStats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single project with detailed stats
router.get('/:id', validateId('id'), async (req, res) => {
  try {
    const project = await db.getProject(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Get project statistics
    const datasets = await db.getDatasetsByProjectId(project.id);
    const runs = await db.getRunsByProjectId(project.id);

    // Calculate aggregate stats
    const stats = {
      datasetCount: datasets.length,
      runCount: runs.length,
      completedRuns: runs.filter(r => r.status === 'completed').length,
      failedRuns: runs.filter(r => r.status === 'failed').length,
      runningRuns: runs.filter(r => r.status === 'running').length,
      totalDatasetSize: datasets.reduce((sum, d) => sum + (d.fileSize || 0), 0),
      lastActivity: runs.length > 0
        ? runs[0].created_at
        : (datasets.length > 0 ? datasets[0].created_at : project.created_at)
    };

    res.json({
      project: {
        ...project,
        ...stats
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new project
router.post('/', validate(schemas.project.create), async (req, res) => {
  try {
    const { name, description } = req.body;

    const project = await db.createProject({
      name,
      description: description || ''
    });

    res.status(201).json({ project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update project
router.put('/:id', validateId('id'), validate(schemas.project.update), async (req, res) => {
  try {
    const { name, description } = req.body;

    const project = await db.updateProject(req.params.id, {
      name,
      description
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE project
router.delete('/:id', validateId('id'), async (req, res) => {
  try {
    const project = await db.getProject(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if project has datasets or runs
    const datasets = await db.getDatasetsByProjectId(req.params.id);
    const runs = await db.getRunsByProjectId(req.params.id);

    if (datasets.length > 0 || runs.length > 0) {
      return res.status(400).json({
        error: 'Cannot delete project with existing datasets or runs. Delete them first or reassign to another project.',
        datasetCount: datasets.length,
        runCount: runs.length
      });
    }

    await db.deleteProject(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET project datasets
router.get('/:id/datasets', validateId('id'), async (req, res) => {
  try {
    const project = await db.getProject(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const datasets = await db.getDatasetsByProjectId(req.params.id);
    res.json({ datasets });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET project runs
router.get('/:id/runs', validateId('id'), async (req, res) => {
  try {
    const project = await db.getProject(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const runs = await db.getRunsByProjectId(req.params.id);
    res.json({ runs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
