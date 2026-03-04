import { config } from 'dotenv';
import { PushEngageAPIClient } from './src/api-client.js';

config();

const testConnection = async () => {
  console.log('🔍 Testing PushEngage API Connection...\n');

  if (!process.env.PUSHENGAGE_API_KEY) {
    console.error('❌ PUSHENGAGE_API_KEY is not set in .env file');
    console.log('Please copy .env.example to .env and add your credentials\n');
    process.exit(1);
  }

  try {
    const client = new PushEngageAPIClient();
    
    console.log('📊 Testing API by creating a draft notification...');
    const notification = await client.sendNotification({
      title: 'API Connection Test',
      message: 'Testing automated test suite connection',
      url: 'https://example.com',
      notification_type: 'draft'
    });
    
    console.log('✅ Successfully connected to PushEngage API!\n');
    console.log('Response:', JSON.stringify(notification, null, 2));
    console.log('\n🎉 Your API connection is working correctly!\n');
    console.log('✨ Next steps:');
    console.log('   1. Run all tests: npm test');
    console.log('   2. Watch mode: npm run test:watch');
    console.log('   3. Run specific tests: npm run test:notifications\n');
    
  } catch (error) {
    console.error('❌ Failed to connect to PushEngage API\n');
    console.error('Error:', error.message);
    console.log('\nPlease check:');
    console.log('1. Your API key is correct (currently: ' + process.env.PUSHENGAGE_API_KEY.substring(0, 8) + '...)');
    console.log('2. Your Site ID is correct (currently: ' + process.env.PUSHENGAGE_SITE_ID + ')');
    console.log('3. Your credentials have proper permissions');
    console.log('4. Your internet connection is working\n');
    process.exit(1);
  }
};

testConnection();
