const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { tenantMiddleware } = require('../middlewares/tenantMiddleware');
const { checkPermission } = require('../middlewares/permissionMiddleware');

// Apply authentication and tenant middleware
router.use(protect);
router.use(tenantMiddleware);

// @desc    Get all projects for the company
// @route   GET /api/projects
// @access  Private
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find({ companyId: req.companyId })
            .populate('agents', 'name email role')
            .sort({ createdAt: -1 });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private (Admin/Manager)
router.post('/', [authorize('admin', 'company_manager', 'superadmin')], async (req, res) => {
    try {
        const { name, description, agents, status } = req.body;

        const project = new Project({
            name,
            description,
            status,
            agents: agents || [],
            companyId: req.companyId,
            createdBy: req.user.id
        });

        const savedProject = await project.save();
        res.status(201).json(savedProject);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            companyId: req.companyId
        }).populate('agents', 'name email');

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json(project);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Admin/Manager)
router.put('/:id', [authorize('admin', 'company_manager', 'superadmin')], async (req, res) => {
    try {
        const { name, description, status, agents } = req.body;

        const project = await Project.findOne({
            _id: req.params.id,
            companyId: req.companyId
        });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        project.name = name || project.name;
        project.description = description !== undefined ? description : project.description;
        project.status = status || project.status;

        if (agents) {
            project.agents = agents;
        }

        const updatedProject = await project.save();
        res.json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Admin/Manager)
router.delete('/:id', [authorize('admin', 'company_manager', 'superadmin')], async (req, res) => {
    try {
        const project = await Project.findOneAndDelete({
            _id: req.params.id,
            companyId: req.companyId
        });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json({ message: 'Project removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
