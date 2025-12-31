const express = require('express');
const router = express.Router();
const {
    getAllClientCompanies,
    getClientCompanyById,
    createClientCompany,
    updateClientCompany,
    deleteClientCompany,
    getClientCompanyStats,
    getProjectsByClientCompany,
    getContactsByClientCompany
} = require('../controllers/clientCompaniesController');

const { protect } = require('../middlewares/authMiddleware');
const { tenantMiddleware } = require('../middlewares/tenantMiddleware');

// All routes require authentication and tenant context
router.use(protect);
router.use(tenantMiddleware);

// Client company routes
router.get('/', getAllClientCompanies);
router.post('/', createClientCompany);
router.get('/:id', getClientCompanyById);
router.put('/:id', updateClientCompany);
router.delete('/:id', deleteClientCompany);
router.get('/:id/stats', getClientCompanyStats);
router.get('/:id/projects', getProjectsByClientCompany);
router.get('/:id/contacts', getContactsByClientCompany);

module.exports = router;
