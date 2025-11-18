const nodemailer = require('nodemailer');

const createTransporter = () => {
  console.log('Creating transporter with config:', {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    user: process.env.EMAIL_USER ? '[REDACTED]' : 'NOT SET'
  });
  
  // Determine if using secure connection
  const isSecure = parseInt(process.env.EMAIL_PORT) === 465;
  
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: isSecure, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const sendVerificationEmail = async (email, name, verificationCode) => {
  console.log('Sending verification email to:', email);
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Support Panel" <no-reply@supportpanel.com>',
    to: email,
    subject: 'Email Verification - Support Panel',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">Email Verification</h2>
        <p>Hello ${name},</p>
        <p>Thank you for registering with Support Panel. Please use the following verification code to complete your registration:</p>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0; font-size: 32px; letter-spacing: 5px; color: #3b82f6;">${verificationCode}</h3>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this verification, please ignore this email.</p>
        <hr style="margin: 30px 0;">
        <p style="font-size: 12px; color: #6b7280;">
          This email was sent by Support Panel. If you have any questions, please contact our support team.
        </p>
      </div>
    `
  };

  try {
    console.log('Sending mail with options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

// Additional email functions for support panel

const sendTicketNotification = async (userEmail, userName, ticket) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Support Panel" <no-reply@supportpanel.com>',
    to: userEmail,
    subject: `New Support Ticket Created - ${ticket.ticketId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">New Support Ticket Created</h2>
        <p>Hello ${userName},</p>
        <p>A new support ticket has been created with the following details:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background-color: #f9fafb;">
            <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Ticket ID</td>
            <td style="padding: 12px; border: 1px solid #e5e7eb;">${ticket.ticketId || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Title</td>
            <td style="padding: 12px; border: 1px solid #e5e7eb;">${ticket.title || 'N/A'}</td>
          </tr>
          <tr style="background-color: #f9fafb;">
            <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Priority</td>
            <td style="padding: 12px; border: 1px solid #e5e7eb; color: ${getPriorityColor(ticket.priority || 'medium')}">${(ticket.priority || 'medium').toUpperCase()}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Status</td>
            <td style="padding: 12px; border: 1px solid #e5e7eb;">${(ticket.status || 'open').toUpperCase()}</td>
          </tr>
          <tr style="background-color: #f9fafb;">
            <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Created Date</td>
            <td style="padding: 12px; border: 1px solid #e5e7eb;">${new Date(ticket.createdAt || Date.now()).toLocaleString()}</td>
          </tr>
        </table>
        <p><a href="${process.env.FRONTEND_URL}/ticket/${ticket._id}" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Ticket</a></p>
        <p>If you didn't create this ticket, please contact our support team.</p>
        <hr style="margin: 30px 0;">
        <p style="font-size: 12px; color: #6b7280;">
          This email was sent by Support Panel. If you have any questions, please contact our support team.
        </p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Ticket notification email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending ticket notification email:', error);
    throw error;
  }
};

const sendTicketUpdateNotification = async (userEmail, userName, ticket) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Support Panel" <no-reply@supportpanel.com>',
    to: userEmail,
    subject: `Ticket Update - ${ticket.ticketId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">Ticket Update</h2>
        <p>Hello ${userName},</p>
        <p>The following ticket has been updated:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background-color: #f9fafb;">
            <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Ticket ID</td>
            <td style="padding: 12px; border: 1px solid #e5e7eb;">${ticket.ticketId}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Title</td>
            <td style="padding: 12px; border: 1px solid #e5e7eb;">${ticket.title}</td>
          </tr>
          <tr style="background-color: #f9fafb;">
            <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Status</td>
            <td style="padding: 12px; border: 1px solid #e5e7eb;">${(ticket.status || 'open').toUpperCase()}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Priority</td>
            <td style="padding: 12px; border: 1px solid #e5e7eb; color: ${getPriorityColor(ticket.priority || 'medium')}">${(ticket.priority || 'medium').toUpperCase()}</td>
          </tr>
          <tr style="background-color: #f9fafb;">
            <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Last Updated</td>
            <td style="padding: 12px; border: 1px solid #e5e7eb;">${new Date(ticket.updatedAt || Date.now()).toLocaleString()}</td>
          </tr>
        </table>
        <p><a href="${process.env.FRONTEND_URL}/ticket/${ticket._id}" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Updated Ticket</a></p>
        <p>If you have any questions about this update, please contact our support team.</p>
        <hr style="margin: 30px 0;">
        <p style="font-size: 12px; color: #6b7280;">
          This email was sent by Support Panel. If you have any questions, please contact our support team.
        </p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Ticket update notification email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending ticket update notification email:', error);
    throw error;
  }
};

const getPriorityColor = (priority) => {
  switch (priority.toLowerCase()) {
    case 'low': return '#10b981'; // green
    case 'medium': return '#f59e0b'; // amber
    case 'high': return '#f97316'; // orange
    case 'urgent': return '#ef4444'; // red
    default: return '#6b7280'; // gray
  }
};

const sendPasswordResetEmail = async (email, name, resetToken) => {
  const transporter = createTransporter();
  
  // Get the frontend URL from environment variable or default to localhost
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;
  
  const mailOptions = {
    from: process.env.EMAIL_FROM || '\"Support Panel\" <no-reply@supportpanel.com>',
    to: email,
    subject: 'Password Reset Request - Support Panel',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">Password Reset Request</h2>
        <p>Hello ${name},</p>
        <p>You have requested to reset your password. Please click the button below to set a new password:</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Your Password</a>
        </p>
        <p style="text-align: center; margin: 20px 0;">
          Or copy and paste this link into your browser:<br>
          <a href="${resetUrl}" style="color: #3b82f6; word-break: break-all;">${resetUrl}</a>
        </p>
        <p>This link will expire in 1 hour for security reasons.</p>
        <p>If you didn't request a password reset, please ignore this email.</p>
        <hr style="margin: 30px 0;">
        <p style="font-size: 12px; color: #6b7280;">
          This email was sent by Support Panel. If you have any questions, please contact our support team.
        </p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

module.exports = {
  sendVerificationEmail,
  sendTicketNotification,
  sendTicketUpdateNotification,
  sendPasswordResetEmail
};