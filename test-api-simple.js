import { config } from 'dotenv';
config();

import axios from 'axios';

const testAPI = async () => {
  console.log('\n🔍 Testing PushEngage API Connection...\n');
  console.log('API Key:', process.env.PUSHENGAGE_API_KEY);
  console.log('Site ID:', process.env.PUSHENGAGE_SITE_ID);
  console.log('Base URL:', process.env.PUSHENGAGE_BASE_URL || 'https://clientapi.pushengage.com/apiv1');
  console.log('\n');

  try {
    // Test 1: Try to send a simple notification
    console.log('📤 Test 1: Attempting to send a test notification...\n');
    
    const formData = new URLSearchParams({
      site_id: process.env.PUSHENGAGE_SITE_ID,
      title: 'API Test Notification',
      message: 'Testing API connection from automated test suite',
      notification_url: 'https://example.com',
      notification_type: 'draft' // Create as draft so it doesn't actually send
    });

    const response = await axios.post(
      'https://clientapi.pushengage.com/apiv1/notifications',
      formData.toString(),
      {
        headers: {
          'api-key': process.env.PUSHENGAGE_API_KEY,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    console.log('✅ Success! API connection is working.\n');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    console.log('\n🎉 Your API credentials are configured correctly!\n');
    console.log('You can now run: npm test\n');
    
  } catch (error) {
    console.error('❌ API Connection Failed\n');
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('No response received from server');
      console.error('Request:', error.message);
    } else {
      console.error('Error:', error.message);
    }
    
    console.log('\n📝 Troubleshooting:');
    console.log('1. Verify your API key is correct in .env file');
    console.log('2. Verify your Site ID is correct in .env file');
    console.log('3. Check if your API key has proper permissions');
    console.log('4. Visit https://www.pushengage.com/api/rest-api/getting-started for API docs\n');
    
    process.exit(1);
  }
};

testAPI();
