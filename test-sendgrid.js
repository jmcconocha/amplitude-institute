require('dotenv').config();

// Environment variables should be set in your .env file or Render dashboard:
// SENDGRID_API_KEY=your-sendgrid-api-key-here
// FROM_EMAIL=info@amplitudeinstitute.com
// ADMIN_EMAIL=jmcconocha@abydosone.ltd

const emailService = require('./services/email');

async function testSendGrid() {
  console.log('🧪 Testing SendGrid integration...');

  try {
    // Send test email to admin email
    const result = await emailService.sendTestEmail(process.env.ADMIN_EMAIL);

    if (result.success) {
      console.log('✅ Test email sent successfully!');
      console.log('📧 Message ID:', result.messageId);
      console.log('🎯 Check your email at:', process.env.ADMIN_EMAIL);
    } else {
      console.error('❌ Test email failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Error during test:', error);
  }
}

testSendGrid();