const ClientCompany = require('../models/ClientCompany');
const Contact = require('../models/Contact');
const Project = require('../models/Project');
const Ticket = require('../models/Ticket');

// Get all client companies for the authenticated tenant
exports.getAllClientCompanies = async (req, res) => {
    try {
        if (!req.company) {
            return res.status(400).json({ message: 'No company context found in request' });
        }

        const { search, status } = req.query;
        const query = { companyId: req.company._id };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { domain: { $regex: search, $options: 'i' } },
                { industry: { $regex: search, $options: 'i' } }
            ];
        }

        if (status) {
            query.status = status;
        }

        const clientCompanies = await ClientCompany.find(query)
            .sort({ createdAt: -1 })
            .populate('createdBy', 'name email');

        // Get counts for each client company
        const companiesWithCounts = await Promise.all(
            clientCompanies.map(async (company) => {
                const [contactsCount, projectsCount, ticketsCount] = await Promise.all([
                    Contact.countDocuments({ clientCompanyId: company._id }),
                    Project.countDocuments({ clientCompanyId: company._id }),
                    Ticket.countDocuments({ clientCompanyId: company._id })
                ]);

                return {
                    id: company._id,
                    name: company.name,
                    domain: company.domain,
                    industry: company.industry,
                    contactEmail: company.contactEmail,
                    phone: company.phone,
                    status: company.status,
                    contacts: contactsCount,
                    projects: projectsCount,
                    tickets: ticketsCount,
                    createdAt: company.createdAt,
                    avatar: company.name.substring(0, 2).toUpperCase()
                };
            })
        );

        res.json(companiesWithCounts);
    } catch (error) {
        console.error('Error fetching client companies:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get client company by ID
exports.getClientCompanyById = async (req, res) => {
    try {
        if (!req.company) {
            return res.status(400).json({ message: 'No company context found in request' });
        }

        const clientCompany = await ClientCompany.findOne({
            _id: req.params.id,
            companyId: req.company._id
        }).populate('createdBy', 'name email');

        if (!clientCompany) {
            return res.status(404).json({ message: 'Client company not found' });
        }

        res.json(clientCompany);
    } catch (error) {
        console.error('Error fetching client company:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create new client company
exports.createClientCompany = async (req, res) => {
    try {
        if (!req.company) {
            return res.status(400).json({ message: 'No company context found in request' });
        }

        const { name, domain, industry, contactEmail, phone, address, notes } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Company name is required' });
        }

        // Check if client company with same name already exists for this tenant
        const existingCompany = await ClientCompany.findOne({
            name: name,
            companyId: req.company._id
        });

        if (existingCompany) {
            return res.status(400).json({ message: 'A client company with this name already exists' });
        }

        const clientCompany = new ClientCompany({
            name,
            domain,
            industry,
            contactEmail,
            phone,
            address,
            notes,
            companyId: req.company._id,
            createdBy: req.user.id
        });

        await clientCompany.save();

        res.status(201).json({
            message: 'Client company created successfully',
            clientCompany
        });
    } catch (error) {
        console.error('Error creating client company:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update client company
exports.updateClientCompany = async (req, res) => {
    try {
        if (!req.company) {
            return res.status(400).json({ message: 'No company context found in request' });
        }

        const allowedUpdates = [
            'name', 'domain', 'industry', 'contactEmail', 'phone',
            'address', 'logo', 'status', 'notes'
        ];

        const updates = {};
        for (const key in req.body) {
            if (allowedUpdates.includes(key)) {
                updates[key] = req.body[key];
            }
        }

        const clientCompany = await ClientCompany.findOneAndUpdate(
            { _id: req.params.id, companyId: req.company._id },
            updates,
            { new: true, runValidators: true }
        );

        if (!clientCompany) {
            return res.status(404).json({ message: 'Client company not found' });
        }

        res.json({
            message: 'Client company updated successfully',
            clientCompany
        });
    } catch (error) {
        console.error('Error updating client company:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete client company (soft delete)
exports.deleteClientCompany = async (req, res) => {
    try {
        if (!req.company) {
            return res.status(400).json({ message: 'No company context found in request' });
        }

        const clientCompany = await ClientCompany.findOneAndUpdate(
            { _id: req.params.id, companyId: req.company._id },
            { status: 'inactive' },
            { new: true }
        );

        if (!clientCompany) {
            return res.status(404).json({ message: 'Client company not found' });
        }

        res.json({
            message: 'Client company deleted successfully',
            clientCompany
        });
    } catch (error) {
        console.error('Error deleting client company:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get client company stats
exports.getClientCompanyStats = async (req, res) => {
    try {
        if (!req.company) {
            return res.status(400).json({ message: 'No company context found in request' });
        }

        const clientCompany = await ClientCompany.findOne({
            _id: req.params.id,
            companyId: req.company._id
        });

        if (!clientCompany) {
            return res.status(404).json({ message: 'Client company not found' });
        }

        const [contactsCount, projectsCount, ticketsCount] = await Promise.all([
            Contact.countDocuments({ clientCompanyId: clientCompany._id }),
            Project.countDocuments({ clientCompanyId: clientCompany._id }),
            Ticket.countDocuments({ clientCompanyId: clientCompany._id })
        ]);

        res.json({
            totalContacts: contactsCount,
            totalProjects: projectsCount,
            totalTickets: ticketsCount
        });
    } catch (error) {
        console.error('Error fetching client company stats:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get projects by client company
exports.getProjectsByClientCompany = async (req, res) => {
    try {
        if (!req.company) {
            return res.status(400).json({ message: 'No company context found in request' });
        }

        const projects = await Project.find({
            clientCompanyId: req.params.id,
            companyId: req.company._id
        }).sort({ createdAt: -1 });

        res.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get contacts by client company
exports.getContactsByClientCompany = async (req, res) => {
    try {
        if (!req.company) {
            return res.status(400).json({ message: 'No company context found in request' });
        }

        const contacts = await Contact.find({
            clientCompanyId: req.params.id,
            companyId: req.company._id
        }).sort({ createdAt: -1 });

        res.json(contacts);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
