const Ticket = require('../models/Ticket');
const User = require('../models/User');
const { sendTicketNotification } = require('../config/email');

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
    
    // Send email notification for new ticket
    try {
      if (ticket.createdBy.email) {
        await sendTicketNotification(
          ticket.createdBy.email,
          ticket.createdBy.name,
          ticket
        );
      }
      
      // Also notify the assigned user if different from creator
      if (ticket.assignedTo && ticket.assignedTo.email && ticket.assignedTo._id.toString() !== ticket.createdBy._id.toString()) {
        await sendTicketNotification(
          ticket.assignedTo.email,
          ticket.assignedTo.name,
          ticket
        );
      }
    } catch (emailError) {
      // If email fails, log the error but still return success
      console.error('Error sending ticket notification email:', emailError);
    }
    
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
      .populate('createdBy', 'name email company')
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
    let ticket;
    
    // First try to find by custom ticketId
    ticket = await Ticket.findOne({ ticketId: req.params.id })
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');
    
    // If not found by ticketId and the param looks like an ObjectId, try to find by _id
    if (!ticket && /^[0-9a-fA-F]{24}$/.test(req.params.id)) {
      ticket = await Ticket.findById(req.params.id)
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email');
    }
    
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
    
    let ticket;
    
    // Find ticket by custom ticketId
    ticket = await Ticket.findOne({ ticketId: req.params.id });
    
    // If not found by ticketId and the param looks like an ObjectId, try to find by _id
    if (!ticket && /^[0-9a-fA-F]{24}$/.test(req.params.id)) {
      ticket = await Ticket.findById(req.params.id);
    }
    
    if (!ticket) {
      console.log('Ticket not found:', req.params.id);
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    // Check if user is authorized to update ticket
    // Admins can update any ticket
    // Support agents can update any ticket if they're only changing assignment, status, or priority
    // Ticket creator can update their own ticket
    const fieldsBeingUpdated = Object.keys(req.body);
    const assignmentFields = ['assignedTo', 'status', 'priority']; // Fields that support agents can update
    const isOnlyAssignmentUpdate = fieldsBeingUpdated.every(field => assignmentFields.includes(field));
    
    const isTicketCreator = ticket.createdBy.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    const isSupportAgent = req.user.role === 'support_agent';
    
    if (!(isAdmin || (isSupportAgent && isOnlyAssignmentUpdate) || isTicketCreator)) {
      console.log('Unauthorized update attempt:', req.user.id, ticket.createdBy.toString(), fieldsBeingUpdated);
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
    
    // Send email notification for ticket update
    try {
      if (ticket.createdBy.email) {
        await sendTicketUpdateNotification(
          ticket.createdBy.email,
          ticket.createdBy.name,
          ticket
        );
      }
      
      // Also notify the assigned user if different from creator
      if (ticket.assignedTo && ticket.assignedTo.email && ticket.assignedTo._id.toString() !== ticket.createdBy._id.toString()) {
        await sendTicketUpdateNotification(
          ticket.assignedTo.email,
          ticket.assignedTo.name,
          ticket
        );
      }
    } catch (emailError) {
      // If email fails, log the error but still return success
      console.error('Error sending ticket update notification email:', emailError);
    }
    
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
    let ticket;
    
    // Find ticket by custom ticketId
    ticket = await Ticket.findOne({ ticketId: req.params.id });
    
    // If not found by ticketId and the param looks like an ObjectId, try to find by _id
    if (!ticket && /^[0-9a-fA-F]{24}$/.test(req.params.id)) {
      ticket = await Ticket.findById(req.params.id);
    }
    
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
    let ticket;
    
    // Find ticket by custom ticketId
    ticket = await Ticket.findOne({ ticketId: req.params.id });
    
    // If not found by ticketId and the param looks like an ObjectId, try to find by _id
    if (!ticket && /^[0-9a-fA-F]{24}$/.test(req.params.id)) {
      ticket = await Ticket.findById(req.params.id);
    }
    
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

// Get agent performance data
exports.getAgentPerformance = async (req, res) => {
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

    // Aggregate ticket data by assigned agent
    const agentPerformance = await Ticket.aggregate([
      {
        $match: dateFilter
      },
      {
        $group: {
          _id: "$assignedTo",
          ticketsHandled: { $sum: 1 },
          resolvedTickets: {
            $sum: {
              $cond: [{ $in: ["$status", ["resolved", "closed"]] }, 1, 0]
            }
          },
          avgResolutionTime: {
            $avg: {
              $cond: [
                { $in: ["$status", ["resolved", "closed"]] },
                {
                  $divide: [
                    { $subtract: ["$updatedAt", "$createdAt"] }, // Time difference in milliseconds
                    1000 * 60 * 60 // Convert to hours
                  ]
                },
                null
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'agentInfo'
        }
      },
      {
        $unwind: '$agentInfo'
      },
      {
        $project: {
          _id: 0,
          agentId: "$_id",
          name: "$agentInfo.name",
          email: "$agentInfo.email",
          ticketsHandled: 1,
          resolvedTickets: 1,
          avgResolutionTime: 1
        }
      },
      {
        $sort: { ticketsHandled: -1 }
      }
    ]);

    const result = agentPerformance.map(agent => ({
      ...agent,
      avgResolutionTime: agent.avgResolutionTime ? agent.avgResolutionTime.toFixed(1) + 'h' : 'N/A',
    }));

    res.json(result);
  } catch (error) {
    console.error('Error fetching agent performance:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get recent activity
exports.getRecentActivity = async (req, res) => {
  try {
    // Get the 10 most recently created tickets
    const recentTickets = await Ticket.find()
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(recentTickets);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get company ticket statistics
exports.getCompanyTicketStats = async (req, res) => {
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

    // Get overall company statistics
    const totalTickets = await Ticket.countDocuments(dateFilter);
    const openTickets = await Ticket.countDocuments({ 
      ...dateFilter,
      status: 'open' 
    });
    const resolvedTickets = await Ticket.countDocuments({ 
      ...dateFilter,
      status: 'resolved' 
    });
    const closedTickets = await Ticket.countDocuments({ 
      ...dateFilter,
      status: 'closed' 
    });

    // Calculate average resolution time for resolved tickets
    const resolvedTicketsWithTime = await Ticket.aggregate([
      {
        $match: {
          ...dateFilter,
          status: { $in: ['resolved', 'closed'] },
          resolvedAt: { $exists: true }
        }
      },
      {
        $group: {
          _id: null,
          avgResolutionTime: { $avg: { $subtract: ["$resolvedAt", "$createdAt"] } }
        }
      }
    ]);

    const avgResolutionTime = resolvedTicketsWithTime[0] ? 
      Math.round(resolvedTicketsWithTime[0].avgResolutionTime / (1000 * 60 * 60 * 24)) : 0; // Days

    res.json({
      totalTickets,
      openTickets,
      resolvedTickets,
      closedTickets,
      avgResolutionTime
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Get department statistics
exports.getDepartmentStats = async (req, res) => {
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

    // In a real application, this would pull from department information
    // For now, we'll return mock data showing ticket distribution by department
    const departmentStats = [
      { department: 'Technical Support', ticketCount: Math.floor(Math.random() * 100) + 50, resolvedCount: Math.floor(Math.random() * 100) + 40 },
      { department: 'Billing', ticketCount: Math.floor(Math.random() * 80) + 30, resolvedCount: Math.floor(Math.random() * 80) + 25 },
      { department: 'Account Management', ticketCount: Math.floor(Math.random() * 60) + 20, resolvedCount: Math.floor(Math.random() * 60) + 18 },
      { department: 'Sales', ticketCount: Math.floor(Math.random() * 40) + 10, resolvedCount: Math.floor(Math.random() * 40) + 8 },
    ];

    res.json(departmentStats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get response time metrics
exports.getResponseTimeMetrics = async (req, res) => {
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

    // Calculate average first response time
    const ticketsWithResponse = await Ticket.aggregate([
      {
        $match: {
          ...dateFilter,
          firstResponseAt: { $exists: true }
        }
      },
      {
        $group: {
          _id: null,
          avgFirstResponseTime: { $avg: { $subtract: ["$firstResponseAt", "$createdAt"] } }
        }
      }
    ]);

    // Calculate response time by priority
    const responseTimeByPriority = await Ticket.aggregate([
      {
        $match: {
          ...dateFilter,
          firstResponseAt: { $exists: true }
        }
      },
      {
        $group: {
          _id: "$priority",
          avgResponseTime: { $avg: { $subtract: ["$firstResponseAt", "$createdAt"] } }
        }
      }
    ]);

    const avgFirstResponseTime = ticketsWithResponse[0] ? 
      Math.round(ticketsWithResponse[0].avgFirstResponseTime / (1000 * 60 * 60)) : 0; // Hours

    res.json({
      avgFirstResponseTime: avgFirstResponseTime > 0 ? `${avgFirstResponseTime}h` : 'N/A',
      responseTimeByPriority: responseTimeByPriority.map(item => ({
        priority: item._id,
        avgResponseTime: `${Math.round(item.avgResponseTime / (1000 * 60 * 60))}h`
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get ticket age analysis
exports.getTicketAgeAnalysis = async (req, res) => {
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

    // Calculate ticket age for open tickets
    const openTickets = await Ticket.find({ 
      ...dateFilter, 
      status: { $in: ['open', 'in_progress'] } 
    });

    // Create age buckets
    const now = new Date();
    const ageBuckets = {
      'less_than_1_day': 0,
      '1_to_3_days': 0,
      '3_to_7_days': 0,
      'more_than_7_days': 0,
      'more_than_30_days': 0
    };

    openTickets.forEach(ticket => {
      const ageInMs = now - ticket.createdAt;
      const ageInDays = Math.floor(ageInMs / (1000 * 60 * 60 * 24));

      if (ageInDays < 1) {
        ageBuckets['less_than_1_day']++;
      } else if (ageInDays < 3) {
        ageBuckets['1_to_3_days']++;
      } else if (ageInDays < 7) {
        ageBuckets['3_to_7_days']++;
      } else if (ageInDays < 30) {
        ageBuckets['more_than_7_days']++;
      } else {
        ageBuckets['more_than_30_days']++;
      }
    });

    res.json({
      totalOpenTickets: openTickets.length,
      ageDistribution: ageBuckets
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get ticket categories
exports.getTicketCategories = async (req, res) => {
  try {
    // In a real application, this would pull from actual categories 
    // For now, we'll return mock data showing ticket distribution by category
    const categories = [
      { category: 'Technical Issue', count: Math.floor(Math.random() * 100) + 50 },
      { category: 'Billing Question', count: Math.floor(Math.random() * 60) + 30 },
      { category: 'Feature Request', count: Math.floor(Math.random() * 40) + 20 },
      { category: 'Account Issue', count: Math.floor(Math.random() * 50) + 25 },
      { category: 'General Inquiry', count: Math.floor(Math.random() * 30) + 15 },
    ];

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get upcoming breaches
exports.getUpcomingBreaches = async (req, res) => {
  try {
    // Find tickets that are approaching their due date (within 24 hours)
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const ticketsAtRisk = await Ticket.find({
      status: { $in: ['open', 'in_progress'] },
      dueDate: { 
        $gte: now,
        $lte: tomorrow
      }
    }).populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    res.json(ticketsAtRisk);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};