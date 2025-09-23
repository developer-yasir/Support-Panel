const Ticket = require('../models/Ticket');
const User = require('../models/User');

// Create a new ticket
exports.createTicket = async (req, res) => {
  try {
    const { title, description, priority, dueDate, assignedTo } = req.body;
    
    const ticket = new Ticket({
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      createdBy: req.user.id
    });
    
    await ticket.save();
    
    // Populate references
    await ticket.populate('createdBy', 'name email');
    await ticket.populate('assignedTo', 'name email');
    
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all tickets
exports.getTickets = async (req, res) => {
  try {
    const { status, priority, assignedTo, dueDate, escalationLevel } = req.query;
    let filter = {};
    
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (dueDate) filter.dueDate = dueDate;
    if (escalationLevel) filter.escalationLevel = escalationLevel;
    
    const tickets = await Ticket.find(filter)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get ticket by ID
exports.getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update ticket
exports.updateTicket = async (req, res) => {
  try {
    console.log('Update ticket request:', req.params.id, req.body);
    const { title, description, priority, status, assignedTo, dueDate, escalationLevel } = req.body;
    
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      console.log('Ticket not found:', req.params.id);
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    // Check if user is authorized to update ticket
    if (ticket.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      console.log('Unauthorized update attempt:', req.user.id, ticket.createdBy.toString());
      return res.status(403).json({ message: 'Not authorized to update this ticket' });
    }
    
    // Only update fields that are provided
    if (title !== undefined) ticket.title = title;
    if (description !== undefined) ticket.description = description;
    if (priority !== undefined) ticket.priority = priority;
    if (status !== undefined) ticket.status = status;
    if (assignedTo !== undefined) ticket.assignedTo = assignedTo;
    if (dueDate !== undefined) ticket.dueDate = dueDate;
    if (escalationLevel !== undefined) ticket.escalationLevel = escalationLevel;
    
    console.log('Updating ticket with data:', {
      title: ticket.title,
      description: ticket.description,
      priority: ticket.priority,
      status: ticket.status,
      assignedTo: ticket.assignedTo,
      dueDate: ticket.dueDate,
      escalationLevel: ticket.escalationLevel
    });
    
    await ticket.save();
    
    // Populate references
    await ticket.populate('createdBy', 'name email');
    await ticket.populate('assignedTo', 'name email');
    
    console.log('Ticket updated successfully:', ticket._id);
    res.json(ticket);
  } catch (error) {
    console.error('Error updating ticket:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete ticket
exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    // Check if user is authorized to delete ticket
    if (ticket.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this ticket' });
    }
    
    await ticket.remove();
    res.json({ message: 'Ticket removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Escalate ticket
exports.escalateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    // Check if user is authorized to escalate ticket
    if (ticket.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to escalate this ticket' });
    }
    
    // Increase escalation level (max level is 3)
    if (ticket.escalationLevel < 3) {
      ticket.escalationLevel += 1;
      await ticket.save();
      
      // Populate references
      await ticket.populate('createdBy', 'name email');
      await ticket.populate('assignedTo', 'name email');
      
      res.json(ticket);
    } else {
      res.status(400).json({ message: 'Ticket is already at the highest escalation level' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get ticket statistics
exports.getTicketStats = async (req, res) => {
  try {
    const totalTickets = await Ticket.countDocuments();
    
    const openTickets = await Ticket.countDocuments({ status: 'open' });
    const inProgressTickets = await Ticket.countDocuments({ status: 'in_progress' });
    const highPriorityTickets = await Ticket.countDocuments({ 
      priority: { $in: ['high', 'urgent'] } 
    });
    
    res.json({
      totalTickets,
      openTickets,
      inProgressTickets,
      highPriorityTickets
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};