// Simple script to send test email immediately
const https = require('https');

// Make a POST request to trigger test email
const data = JSON.stringify({
  action: 'test_email',
  to: 'jmcconocha@abydosone.ltd'
});

const options = {
  hostname: 'amplitude-institute.onrender.com',
  port: 443,
  path: '/api/test-email',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
  },
};

console.log('🚀 Sending test email request to Render deployment...');
console.log('📧 Test email will be sent from: info@amplitudeinstitute.com');
console.log('📧 Test email will be sent to: jmcconocha@abydosone.ltd');

const req = https.request(options, (res) => {
  console.log(`📡 Status: ${res.statusCode}`);

  let responseData = '';
  res.on('data', (d) => {
    responseData += d;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(responseData);
      if (response.success) {
        console.log('✅ Test email sent successfully!');
        console.log('📧 Message ID:', response.messageId);
        console.log('🎯 Check your email inbox now!');
      } else {
        console.log('❌ Test email failed:', response.error);
      }
    } catch (e) {
      console.log('📄 Raw response:', responseData);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request failed:', error.message);
  console.log('💡 The endpoint might not exist yet. Let me try a different approach...');
});

req.write(data);
req.end();