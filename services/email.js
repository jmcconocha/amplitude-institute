const sgMail = require('@sendgrid/mail');

class EmailService {
  constructor() {
    console.log('📧 Initializing SendGrid email service with:', {
      apiKey: process.env.SENDGRID_API_KEY ? `${process.env.SENDGRID_API_KEY.substring(0, 8)}***` : 'not set',
      fromEmail: process.env.FROM_EMAIL || 'not set'
    });

    if (!process.env.SENDGRID_API_KEY) {
      console.error('❌ SENDGRID_API_KEY environment variable is not set');
      return;
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    this.fromEmail = process.env.FROM_EMAIL || 'info@amplitudeinstitute.com';

    console.log('✅ SendGrid email service initialized');
  }

  async sendRegistrationNotification(userDetails) {
    const { email, first_name, last_name, organization, registration_reason } = userDetails;

    const msg = {
      to: process.env.ADMIN_EMAIL,
      from: `"The Amplitude Institute" <${this.fromEmail}>`,
      subject: '🔐 New User Registration Request - The Amplitude Institute',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
            .user-info { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .btn { display: inline-block; background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 5px; }
            .btn-approve { background: #10b981; }
            .btn-deny { background: #ef4444; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>🏢 The Amplitude Institute</h2>
              <h3>New User Registration Request</h3>
            </div>
            <div class="content">
              <p>A new user has registered and is requesting access to The Amplitude Institute platform:</p>

              <div class="user-info">
                <h4>User Details:</h4>
                <p><strong>Name:</strong> ${first_name} ${last_name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Organization:</strong> ${organization || 'Not provided'}</p>
                <p><strong>Registration Reason:</strong></p>
                <p style="padding: 10px; background: #f0f0f0; border-radius: 3px;">${registration_reason || 'Not provided'}</p>
              </div>

              <p>Please review this registration request and take appropriate action:</p>

              <div style="text-align: center; margin: 20px 0;">
                <a href="https://www.amplitudeinstitute.com/admin" class="btn btn-approve">Review in Admin Panel</a>
              </div>

              <p><em>You can approve or deny this registration request from the admin panel.</em></p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      console.log('📧 Sending registration notification with SendGrid:', {
        from: msg.from,
        to: msg.to,
        subject: msg.subject
      });

      const response = await sgMail.send(msg);
      console.log('📧 Registration notification sent via SendGrid:', response[0].statusCode);
      return { success: true, messageId: response[0].headers['x-message-id'] };
    } catch (error) {
      console.error('❌ Failed to send registration notification via SendGrid:', error);
      console.error('❌ Mail options were:', {
        from: msg.from,
        to: msg.to,
        subject: msg.subject
      });
      return { success: false, error: error.message };
    }
  }

  async sendApprovalNotification(userEmail, userName) {
    const msg = {
      to: userEmail,
      from: `"The Amplitude Institute" <${this.fromEmail}>`,
      subject: '✅ Registration Approved - The Amplitude Institute',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
            .btn { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>🏢 The Amplitude Institute</h2>
              <h3>Welcome to Our Community!</h3>
            </div>
            <div class="content">
              <p>Dear ${userName},</p>

              <p>🎉 <strong>Congratulations!</strong> Your registration request has been approved.</p>

              <p>You now have access to The Amplitude Institute's platform featuring:</p>
              <ul>
                <li>🚀 30-day Lean Agile innovation cycles</li>
                <li>🔬 Innovation sprints (5-day intensive sessions)</li>
                <li>📊 Success metrics and validated learning</li>
                <li>🤝 Collaborative research community</li>
                <li>💡 Patent generation opportunities</li>
              </ul>

              <div style="text-align: center;">
                <a href="https://www.amplitudeinstitute.com/login" class="btn">Login to Your Account</a>
              </div>

              <p>If you have any questions, please don't hesitate to reach out.</p>

              <p>Welcome to the future of innovation!</p>

              <p>Best regards,<br>The Amplitude Institute Team</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      console.log('📧 Sending approval notification with SendGrid:', {
        from: msg.from,
        to: msg.to,
        subject: msg.subject
      });

      const response = await sgMail.send(msg);
      console.log('📧 Approval notification sent via SendGrid:', response[0].statusCode);
      return { success: true, messageId: response[0].headers['x-message-id'] };
    } catch (error) {
      console.error('❌ Failed to send approval notification via SendGrid:', error);
      console.error('❌ Mail options were:', {
        from: msg.from,
        to: msg.to,
        subject: msg.subject
      });
      return { success: false, error: error.message };
    }
  }

  async sendDenialNotification(userEmail, userName, reason = '') {
    const msg = {
      to: userEmail,
      from: `"The Amplitude Institute" <${this.fromEmail}>`,
      subject: '❌ Registration Request Update - The Amplitude Institute',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>🏢 The Amplitude Institute</h2>
              <h3>Registration Request Update</h3>
            </div>
            <div class="content">
              <p>Dear ${userName},</p>

              <p>Thank you for your interest in The Amplitude Institute.</p>

              <p>After careful review, we are unable to approve your registration request at this time.</p>

              ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}

              <p>If you believe this was an error or would like to discuss this decision, please feel free to contact us directly at ${process.env.ADMIN_EMAIL}.</p>

              <p>We appreciate your interest and wish you the best in your innovation endeavors.</p>

              <p>Best regards,<br>The Amplitude Institute Team</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      console.log('📧 Sending denial notification with SendGrid:', {
        from: msg.from,
        to: msg.to,
        subject: msg.subject
      });

      const response = await sgMail.send(msg);
      console.log('📧 Denial notification sent via SendGrid:', response[0].statusCode);
      return { success: true, messageId: response[0].headers['x-message-id'] };
    } catch (error) {
      console.error('❌ Failed to send denial notification via SendGrid:', error);
      console.error('❌ Mail options were:', {
        from: msg.from,
        to: msg.to,
        subject: msg.subject
      });
      return { success: false, error: error.message };
    }
  }

  // Test method for SendGrid verification
  async sendTestEmail(toEmail = 'test@example.com') {
    const msg = {
      to: toEmail,
      from: `"The Amplitude Institute" <${this.fromEmail}>`,
      subject: 'SendGrid Integration Test - The Amplitude Institute',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>🏢 The Amplitude Institute</h2>
              <h3>SendGrid Integration Test</h3>
            </div>
            <div class="content">
              <p>This is a test email to verify SendGrid integration is working correctly.</p>
              <p><strong>From:</strong> ${this.fromEmail}</p>
              <p><strong>Time:</strong> ${new Date().toISOString()}</p>
              <p>If you receive this email, the SendGrid integration is working! 🎉</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      console.log('📧 Sending test email with SendGrid:', {
        from: msg.from,
        to: msg.to,
        subject: msg.subject
      });

      const response = await sgMail.send(msg);
      console.log('📧 Test email sent via SendGrid:', response[0].statusCode);
      return { success: true, messageId: response[0].headers['x-message-id'] };
    } catch (error) {
      console.error('❌ Failed to send test email via SendGrid:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();