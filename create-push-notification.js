import { config } from 'dotenv';
import { PushEngageAPIClient } from './src/api-client.js';

config();

const createPushNotification = async () => {
  console.log('🚀 Creating a Push Notification via REST API...\n');

  const client = new PushEngageAPIClient();

  try {
    // Example 1: Create a draft notification (safe for testing)
    console.log('📝 Example 1: Creating a DRAFT notification (safe - won\'t send)');
    const draftNotification = {
      title: 'Test Notification from API',
      message: 'This is a test push notification created via REST API!',
      url: 'https://www.pushengage.com',
      notification_type: 'draft' // Creates as draft, won't actually send
    };

    const draftResult = await client.sendNotification(draftNotification);
    console.log('✅ Draft notification created successfully!');
    console.log('   Notification ID:', draftResult.notification_id);
    console.log('   Response:', JSON.stringify(draftResult, null, 2));
    console.log('');

    // Example 2: Create notification with image
    console.log('📸 Example 2: Creating notification WITH IMAGE');
    const imageNotification = {
      title: 'New Feature Released! 🎉',
      message: 'Check out our latest feature update',
      url: 'https://www.pushengage.com/features',
      image_url: 'https://via.placeholder.com/400x300.png?text=Feature+Update',
      notification_type: 'draft'
    };

    const imageResult = await client.sendNotification(imageNotification);
    console.log('✅ Image notification created!');
    console.log('   Notification ID:', imageResult.notification_id);
    console.log('');

    // Example 3: Create notification with action buttons
    console.log('🔘 Example 3: Creating notification WITH ACTION BUTTONS');
    const actionNotification = {
      title: 'Limited Time Offer!',
      message: 'Special discount available now. Interested?',
      url: 'https://www.pushengage.com/pricing',
      actions: [
        { title: 'Yes, Show Me', url: 'https://www.pushengage.com/pricing' },
        { title: 'Maybe Later', url: 'https://www.pushengage.com' }
      ],
      notification_type: 'draft'
    };

    const actionResult = await client.sendNotification(actionNotification);
    console.log('✅ Action button notification created!');
    console.log('   Notification ID:', actionResult.notification_id);
    console.log('');

    // Example 4: Schedule a notification for later
    console.log('⏰ Example 4: Creating SCHEDULED notification');
    const futureDate = new Date();
    futureDate.setHours(futureDate.getHours() + 2);
    const scheduledTime = futureDate.toISOString().replace('T', ' ').substring(0, 19);

    const scheduledNotification = {
      title: 'Scheduled Reminder',
      message: 'This notification is scheduled for 2 hours from now',
      url: 'https://www.pushengage.com',
      notification_type: 'later',
      valid_from_utc: scheduledTime
    };

    const scheduledResult = await client.sendNotification(scheduledNotification);
    console.log('✅ Scheduled notification created!');
    console.log('   Notification ID:', scheduledResult.notification_id);
    console.log('   Scheduled for:', scheduledTime);
    console.log('');

    // Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 SUCCESS! All notifications created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('📊 Summary:');
    console.log('   ✓ Draft notification:         ID', draftResult.notification_id);
    console.log('   ✓ Image notification:         ID', imageResult.notification_id);
    console.log('   ✓ Action button notification: ID', actionResult.notification_id);
    console.log('   ✓ Scheduled notification:     ID', scheduledResult.notification_id);
    console.log('');
    console.log('💡 Next steps:');
    console.log('   • Check your PushEngage dashboard to see these notifications');
    console.log('   • Edit the draft notifications and send them when ready');
    console.log('   • Run automated tests: npm test');
    console.log('');

  } catch (error) {
    console.error('❌ Error creating notification:');
    console.error(error.message);
    console.log('');
    console.log('💡 Troubleshooting:');
    console.log('   1. Verify your API key is correct');
    console.log('   2. Check your internet connection');
    console.log('   3. Visit your PushEngage dashboard to verify site status');
    process.exit(1);
  }
};

console.log('═══════════════════════════════════════════════════');
console.log('  PushEngage REST API - Create Push Notifications  ');
console.log('═══════════════════════════════════════════════════');
console.log('');

createPushNotification();
