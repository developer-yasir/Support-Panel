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
    
    // Broadcast new ticket to WebSocket clients
    if (global.broadcastNewTicket) {
      global.broadcastNewTicket(ticket);
    }
    
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
    
    // Broadcast ticket update to WebSocket clients
    if (global.broadcastTicketUpdate) {
      global.broadcastTicketUpdate(ticket);
    }
    
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
    
    // Broadcast ticket deletion to WebSocket clients
    if (global.broadcastTicketUpdate) {
      global.broadcastTicketUpdate({ id: req.params.id, deleted: true });
    }
    
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
    const { startDate, endDate } = req.query;
    let filter = {};

    // Add date range filter if provided
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.createdAt.$lte = new Date(endDate);
      }
    }

    const totalTickets = await Ticket.countDocuments(filter);
    
    // Add the date filter to all other queries
    const openTickets = await Ticket.countDocuments({ 
      ...filter,
      status: 'open' 
    });
    
    const inProgressTickets = await Ticket.countDocuments({ 
      ...filter,
      status: 'in_progress' 
    });
    
    const highPriorityTickets = await Ticket.countDocuments({ 
      ...filter,
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

// Get ticket trends data for charts
exports.getTicketTrends = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Aggregate ticket counts by day
    const ticketTrends = await Ticket.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt"
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Create a complete date range
    const dateRange = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dateRange.push(d.toISOString().split('T')[0]);
    }

    // Fill in missing dates with 0 counts
    const filledTrends = dateRange.map(date => {
      const trend = ticketTrends.find(t => t._id === date);
      return {
        date,
        count: trend ? trend.count : 0
      };
    });

    res.json(filledTrends);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get ticket distribution by priority
exports.getTicketDistribution = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let dateFilter = {};

    // Add date range filter if provided
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) {
        dateFilter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        dateFilter.createdAt.$lte = new Date(endDate);
      }
    }

    // Aggregate tickets by priority
    const priorityDistribution = await Ticket.aggregate([
      {
        $match: dateFilter
      },
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.json(priorityDistribution);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get ticket resolution rates over time
exports.getResolutionRates = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Aggregate resolution rates by day
    const resolutionRates = await Ticket.aggregate([
      {
        $match: {
          updatedAt: {
            $gte: startDate,
            $lte: endDate
          },
          status: { $in: ['resolved', 'closed'] }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$updatedAt"
            }
          },
          resolvedCount: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Create a complete date range
    const dateRange = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dateRange.push(d.toISOString().split('T')[0]);
    }

    // Fill in missing dates with 0 counts
    const filledRates = dateRange.map(date => {
      const rate = resolutionRates.find(r => r._id === date);
      return {
        date,
        resolvedCount: rate ? rate.resolvedCount : 0
      };
    });

    res.json(filledRates);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};