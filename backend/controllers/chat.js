const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');

const createMessage = async (req, res) => {
  try {
    const { conversationId, text, senderType } = req.body;

    if (!conversationId || !text) {
      return res.status(400).json({ message: 'Conversation ID and text are required' });
    }

    // Verify that the user has access to this conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      $or: [
        { 'participants.userId': req.user.id },
        { 'participants.customerId': req.user.id }
      ]
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Create a new message
    const message = new Message({
      conversationId,
      text,
      sender: {
        id: req.user.id,
        type: senderType || 'user'
      }
    });

    const savedMessage = await message.save();
    // Populate the message to get user data if needed
    await savedMessage.populate('sender.id', 'name email avatar');
    
    // Transform the message to have a simpler structure for the frontend
    const transformedMessage = {
      id: savedMessage._id,
      conversationId: savedMessage.conversationId,
      text: savedMessage.text,
      timestamp: savedMessage.createdAt,
      senderType: savedMessage.sender.type,
      senderId: savedMessage.sender.id._id,
      senderName: savedMessage.sender.id.name,
      avatar: savedMessage.sender.id.avatar || savedMessage.sender.id.name?.charAt(0)?.toUpperCase() + (savedMessage.sender.id.name?.charAt(1) || ''),
      ...savedMessage._doc
    };

    // Update the conversation's last message
    conversation.lastMessage = savedMessage._id;
    conversation.updatedAt = Date.now();
    await conversation.save();

    // Broadcast the new message to all connected clients in the conversation
    if (global.broadcastChatMessage) {
      global.broadcastChatMessage(conversationId, {
        type: 'chat_message',
        message: transformedMessage
      });
    }

    res.status(201).json(transformedMessage);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getConversations = async (req, res) => {
  try {
    // Get conversations where the user is involved (either as agent, user, or customer)
    const conversations = await Conversation.find({
      $or: [
        { 'participants.userId': req.user.id },
        { 'participants.agentId': req.user.id },
        { 'participants.customerId': req.user.id }
      ]
    })
    .populate({
      path: 'lastMessage',
      populate: {
        path: 'sender.id',
        select: 'name email avatar'
      }
    })
    .populate('participants.userId', 'name email avatar isActive')
    .populate('participants.agentId', 'name email avatar isActive')
    .populate('participants.customerId', 'name email avatar isActive')
    .sort({ updatedAt: -1 });

    // Transform conversations to have a simpler structure for the frontend
    const transformedConversations = conversations.map(conv => {
      // Determine the primary participant to show (prioritize customer, then user, then agent)
      let primaryParticipant = conv.participants.customerId || conv.participants.userId || conv.participants.agentId;
      if (!primaryParticipant && conv.participants.userId) {
        primaryParticipant = conv.participants.userId;
      }
      
      return {
        id: conv._id,
        customerName: primaryParticipant?.name || 'Unknown',
        customerEmail: primaryParticipant?.email || '',
        lastMessage: conv.lastMessage?.text || '',
        lastMessageTime: conv.lastMessage?.createdAt || conv.updatedAt,
        unread: 0, // This would be calculated based on read receipts in a full implementation
        status: primaryParticipant?.isActive ? 'online' : 'offline', // Use actual active status
        avatar: primaryParticipant?.avatar || 
                 primaryParticipant?.name?.charAt(0).toUpperCase() + 
                 (primaryParticipant?.name?.charAt(1) || '') || 'U',
        ...conv._doc
      };
    });

    res.json(transformedConversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    // Verify that the user has access to this conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      $or: [
        { 'participants.userId': req.user.id },
        { 'participants.customerId': req.user.id }
      ]
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    const messages = await Message.find({ 
      conversationId: conversationId 
    })
    .populate('sender.id', 'name email avatar')
    .sort({ createdAt: 1 });

    // Transform messages to have a simpler structure for the frontend
    const transformedMessages = messages.map(msg => ({
      id: msg._id,
      conversationId: msg.conversationId,
      text: msg.text,
      timestamp: msg.createdAt,
      senderType: msg.sender.type,
      senderId: msg.sender.id._id,
      senderName: msg.sender.id.name,
      avatar: msg.sender.id.avatar || msg.sender.id.name?.charAt(0).toUpperCase() + msg.sender.id.name?.charAt(1),
      ...msg._doc // Include other properties if needed
    }));

    res.json(transformedMessages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createConversation = async (req, res) => {
  try {
    const { subject, message, targetUserId } = req.body;

    // If targetUserId is provided, create a conversation with that specific user
    let targetUser = null;
    if (targetUserId) {
      targetUser = await User.findById(targetUserId);
      if (!targetUser) {
        return res.status(404).json({ message: 'Target user not found' });
      }
    }

    // Create a new conversation
    const conversation = new Conversation({
      participants: {
        userId: targetUser ? targetUser._id : req.user.id, // The customer/user in the conversation
        agentId: targetUser ? req.user.id : null,          // The support agent (if this is initiated by an agent)
        customerId: null                                   // customerId is for backward compatibility
      },
      subject: subject || 'Support Chat',
      status: 'open'
    });

    const savedConversation = await conversation.save();

    // Create the initial message
    const initialMessage = new Message({
      conversationId: savedConversation._id,
      text: message || 'New conversation started',
      sender: {
        id: req.user.id,
        type: req.user.role === 'admin' || req.user.role === 'support_agent' ? 'agent' : 'customer'
      }
    });

    const savedMessage = await initialMessage.save();

    // Update the conversation with the initial message
    savedConversation.lastMessage = savedMessage._id;
    await savedConversation.save();

    // Transform the savedMessage to have the same structure as API responses for consistency
    const transformedInitialMessage = {
      id: savedMessage._id,
      conversationId: savedMessage.conversationId,
      text: savedMessage.text,
      timestamp: savedMessage.createdAt,
      senderType: savedMessage.sender.type,
      senderId: savedMessage.sender.id._id,
      senderName: savedMessage.sender.id.name,
      avatar: savedMessage.sender.id.avatar || savedMessage.sender.id.name?.charAt(0).toUpperCase() + savedMessage.sender.id.name?.charAt(1),
      ...savedMessage._doc
    };

    // Broadcast the new conversation event
    if (global.broadcastChatMessage) {
      global.broadcastChatMessage(savedConversation._id, {
        type: 'chat_message',
        message: transformedInitialMessage
      });
    }

    res.status(201).json(savedConversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getConversations,
  getMessages,
  createMessage,
  createConversation
};