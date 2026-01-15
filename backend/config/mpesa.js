// M-Pesa Configuration Module
module.exports = {
  MPESA_ENV: process.env.MPESA_ENV || 'sandbox',
  
  MPESA_BASE_URL: process.env.MPESA_ENV === 'production'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke',
  
  MPESA_SHORTCODE: process.env.MPESA_SHORTCODE || '174379',
  
  MPESA_CONSUMER_KEY: process.env.MPESA_CONSUMER_KEY,
  
  MPESA_CONSUMER_SECRET: process.env.MPESA_CONSUMER_SECRET,
  
  MPESA_PASSKEY: process.env.MPESA_PASSKEY,
  
  MPESA_CALLBACK_URL: process.env.MPESA_CALLBACK_URL,
  
  // Test credentials (for development)
  TEST_CREDENTIALS: {
    consumerKey: 'YOUR_CONSUMER_KEY',
    consumerSecret: 'YOUR_CONSUMER_SECRET',
    shortcode: '174379',
    passkey: 'YOUR_PASSKEY',
  },
};
