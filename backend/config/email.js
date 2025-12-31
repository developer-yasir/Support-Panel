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
      <div style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #000000;">
        <div style="white-space: pre-wrap;">${ticket.description || 'No description provided'}</div>
        
        <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          Ticket: <a href="${process.env.FRONTEND_URL}/ticket/${ticket._id}" style="color: #0066cc; text-decoration: none;">${process.env.FRONTEND_URL}/ticket/${ticket._id}</a>
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

const getPriorityBgColor = (priority) => {
  switch (priority.toLowerCase()) {
    case 'low': return '#d1fae5'; // light green
    case 'medium': return '#fef3c7'; // light amber
    case 'high': return '#fed7aa'; // light orange
    case 'urgent': return '#fee2e2'; // light red
    default: return '#f3f4f6'; // light gray
  }
};

const sendForwardedTicket = async (toEmail, ccEmails, ticket, message, forwarderName) => {
  const transporter = createTransporter();

  // Format comments HTML
  let commentsHtml = '';
  if (ticket.comments && ticket.comments.length > 0) {
    commentsHtml = ticket.comments.map(comment => `
      <div style="margin: 20px 0; padding: 15px; background-color: #f9fafb; border-left: 3px solid #3b82f6; border-radius: 4px;">
        <div style="margin-bottom: 8px;">
          <strong style="color: #1f2937;">${comment.author?.name || 'Unknown'}</strong>
          <span style="color: #6b7280; font-size: 12px; margin-left: 8px;">
            ${new Date(comment.createdAt).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })}
          </span>
          ${comment.isInternal ? '<span style="background-color: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 3px; font-size: 11px; margin-left: 8px;">Internal Note</span>' : ''}
        </div>
        <div style="color: #374151; white-space: pre-wrap;">${comment.content || ''}</div>
      </div>
    `).join('');
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Support Panel" <no-reply@supportpanel.com>',
    to: toEmail,
    cc: ccEmails || undefined,
    subject: `Forwarded Ticket: ${ticket.ticketId} - ${ticket.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; color: #1f2937;">
        <div style="background-color: #3b82f6; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h2 style="margin: 0; font-size: 24px;">Forwarded Ticket</h2>
        </div>
        
        <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
          ${message ? `
            <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 12px 16px; margin-bottom: 20px; border-radius: 4px;">
              <strong style="color: #1e40af;">Message from ${forwarderName}:</strong>
              <p style="margin: 8px 0 0 0; color: #1f2937; white-space: pre-wrap;">${message}</p>
            </div>
          ` : ''}
          
          <h3 style="color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 16px;">
            Ticket Details
          </h3>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 12px; background-color: #f9fafb; border: 1px solid #e5e7eb; font-weight: bold; width: 150px;">Ticket ID</td>
              <td style="padding: 8px 12px; border: 1px solid #e5e7eb;">${ticket.ticketId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; background-color: #f9fafb; border: 1px solid #e5e7eb; font-weight: bold;">Title</td>
              <td style="padding: 8px 12px; border: 1px solid #e5e7eb;">${ticket.title}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; background-color: #f9fafb; border: 1px solid #e5e7eb; font-weight: bold;">Status</td>
              <td style="padding: 8px 12px; border: 1px solid #e5e7eb;">${(ticket.status || 'open').toUpperCase()}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; background-color: #f9fafb; border: 1px solid #e5e7eb; font-weight: bold;">Priority</td>
              <td style="padding: 8px 12px; border: 1px solid #e5e7eb;">
                <span style="color: ${getPriorityColor(ticket.priority || 'medium')}; font-weight: bold;">
                  ${(ticket.priority || 'medium').toUpperCase()}
                </span>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; background-color: #f9fafb; border: 1px solid #e5e7eb; font-weight: bold;">Created</td>
              <td style="padding: 8px 12px; border: 1px solid #e5e7eb;">
                ${new Date(ticket.createdAt).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; background-color: #f9fafb; border: 1px solid #e5e7eb; font-weight: bold;">Created By</td>
              <td style="padding: 8px 12px; border: 1px solid #e5e7eb;">${ticket.createdBy?.name || ticket.createdBy?.email || 'Unknown'}</td>
            </tr>
          </table>
          
          <h3 style="color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 16px;">
            Original Message
          </h3>
          <div style="background-color: #f9fafb; padding: 16px; border-radius: 4px; margin-bottom: 20px;">
            <div style="color: #374151; white-space: pre-wrap; line-height: 1.6;">${ticket.description || 'No description provided'}</div>
          </div>
          
          ${commentsHtml ? `
            <h3 style="color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 16px;">
              Conversation History
            </h3>
            ${commentsHtml}
          ` : ''}
        </div>
        
        <div style="background-color: #f9fafb; padding: 16px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; text-align: center;">
          <p style="margin: 0; font-size: 12px; color: #6b7280;">
            This ticket was forwarded from Support Panel
          </p>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Forwarded ticket email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending forwarded ticket email:', error);
    throw error;
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
  sendPasswordResetEmail,
  sendForwardedTicket
};