const Comment = require('../models/Comment');
const Ticket = require('../models/Ticket');

// Add a comment to a ticket
exports.addComment = async (req, res) => {
  try {
    const { content, ticketId, isInternal } = req.body;

    // Check if ticket exists
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const comment = new Comment({
      content,
      ticket: ticketId,
      createdBy: req.user.id,
      companyId: req.user.companyId, // Get from authenticated user
      isInternal: isInternal || false
    });

    await comment.save();

    // Populate the createdBy field
    await comment.populate('createdBy', 'name email');

    res.status(201).json(comment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get comments for a ticket
exports.getCommentsByTicket = async (req, res) => {
  try {
    const comments = await Comment.find({ ticket: req.params.ticketId })
      .populate('createdBy', 'name email')
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a comment
exports.updateComment = async (req, res) => {
  try {
    const { content } = req.body;

    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.createdBy.toString() !== req.user.id && req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Not authorized to update this comment' });
    }

    comment.content = content || comment.content;

    await comment.save();

    // Populate the createdBy field
    await comment.populate('createdBy', 'name email');

    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is authorized to delete comment
    if (comment.createdBy.toString() !== req.user.id && req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await comment.remove();
    res.json({ message: 'Comment removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};