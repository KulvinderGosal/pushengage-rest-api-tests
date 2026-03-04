import { config } from 'dotenv';
import { PushEngageAPIClient } from './src/api-client.js';

config();

const sendLiveNotification = async () => {
  console.log('════════════════════════════════════════════════════════');
  console.log('  ⚠️  LIVE PUSH NOTIFICATION - WILL SEND TO SUBSCRIBERS  ');
  console.log('════════════════════════════════════════════════════════');
  console.log('');
  console.log('⚠️  WARNING: This will send REAL notifications to your subscribers!');
  console.log('');

  const client = new PushEngageAPIClient();

  try {
    // Live Notification 1: Simple welcome message
    console.log('📤 Sending Live Notification #1...');
    const notification1 = {
      title: '👋 Hello from PushEngage API!',
      message: 'This is a live test notification sent via REST API',
      url: 'https://www.pushengage.com',
      notification_type: 'now' // ← SENDS IMMEDIATELY!
    };

    const result1 = await client.sendNotification(notification1);
    console.log('✅ Sent successfully!');
    console.log('   Notification ID:', result1.notification_id);
    console.log('   Status:', result1.success ? 'SUCCESS' : 'FAILED');
    console.log('');

    // Live Notification 2: With image
    console.log('📤 Sending Live Notification #2 (with image)...');
    const notification2 = {
      title: '🎉 New Feature Alert!',
      message: 'Check out what\'s new in our latest update',
      url: 'https://www.pushengage.com/features',
      image_url: 'https://via.placeholder.com/400x300.png?text=New+Feature',
      notification_type: 'now'
    };

    const result2 = await client.sendNotification(notification2);
    console.log('✅ Sent successfully!');
    console.log('   Notification ID:', result2.notification_id);
    console.log('');

    // Live Notification 3: With action buttons
    console.log('📤 Sending Live Notification #3 (with action buttons)...');
    const notification3 = {
      title: '💬 Quick Question',
      message: 'Are you enjoying PushEngage so far?',
      url: 'https://www.pushengage.com',
      actions: [
        { title: '👍 Yes!', url: 'https://www.pushengage.com/feedback/yes' },
        { title: '👎 No', url: 'https://www.pushengage.com/feedback/no' }
      ],
      notification_type: 'now'
    };

    const result3 = await client.sendNotification(notification3);
    console.log('✅ Sent successfully!');
    console.log('   Notification ID:', result3.notification_id);
    console.log('');

    // Summary
    console.log('════════════════════════════════════════════════════════');
    console.log('🎉 SUCCESS! All live notifications sent!');
    console.log('════════════════════════════════════════════════════════');
    console.log('');
    console.log('📊 Sent Notifications:');
    console.log('   1. Welcome message           - ID:', result1.notification_id);
    console.log('   2. Feature alert with image  - ID:', result2.notification_id || 'Created');
    console.log('   3. Question with buttons     - ID:', result3.notification_id);
    console.log('');
    console.log('📱 Your subscribers should receive these notifications now!');
    console.log('');
    console.log('💡 Next steps:');
    console.log('   • Check your browser/device for the notifications');
    console.log('   • View analytics in your PushEngage dashboard');
    console.log('   • Monitor click rates and engagement');
    console.log('');

  } catch (error) {
    console.error('❌ Error sending notification:');
    console.error(error.message);
    console.log('');
    console.log('💡 Possible reasons:');
    console.log('   • No active subscribers on your site');
    console.log('   • API rate limiting');
    console.log('   • Network connectivity issue');
    console.log('');
    process.exit(1);
  }
};

// Run the script
console.log('');
console.log('Starting in 3 seconds... Press Ctrl+C to cancel');
console.log('');

setTimeout(() => {
  sendLiveNotification();
}, 3000);
