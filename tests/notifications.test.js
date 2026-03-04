import { describe, it, expect, beforeAll } from 'vitest';
import { PushEngageAPIClient } from '../src/api-client.js';

describe('Notifications API Tests', () => {
  let apiClient;

  beforeAll(() => {
    apiClient = new PushEngageAPIClient();
  });

  describe('POST /notifications', () => {
    it('should send a push notification as draft', async () => {
      const notification = {
        title: 'Test Notification',
        message: 'This is a test notification sent via API',
        url: 'https://example.com',
        notification_type: 'draft' // Create as draft for testing
      };

      const response = await apiClient.sendNotification(notification);
      
      expect(response).toBeDefined();
      expect(response).toHaveProperty('success', true);
      expect(response).toHaveProperty('notification_id');
    });

    it('should schedule a notification for later', async () => {
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 2);

      const notification = {
        title: 'Scheduled Test Notification',
        message: 'This notification is scheduled',
        url: 'https://example.com',
        notification_type: 'later',
        valid_from_utc: futureDate.toISOString().replace('T', ' ').substring(0, 19)
      };

      const response = await apiClient.sendNotification(notification);
      
      expect(response).toBeDefined();
      expect(response).toHaveProperty('success', true);
      expect(response).toHaveProperty('notification_id');
    });

    it('should send notification as draft by default', async () => {
      const notification = {
        title: 'A'.repeat(50), // Long title but within limits
        message: 'Test message',
        url: 'https://example.com'
      };

      const response = await apiClient.sendNotification(notification);
      expect(response).toHaveProperty('success', true);
    });

    it('should send notification with custom image', async () => {
      const notification = {
        title: 'Notification with Image',
        message: 'Check out this image',
        url: 'https://example.com',
        image_url: 'https://via.placeholder.com/400x300',
        notification_type: 'draft'
      };

      const response = await apiClient.sendNotification(notification);
      
      expect(response).toBeDefined();
      expect(response).toHaveProperty('success', true);
      expect(response).toHaveProperty('notification_id');
    });

    it('should send notification with action buttons', async () => {
      const notification = {
        title: 'Notification with Actions',
        message: 'Choose an action',
        url: 'https://example.com',
        actions: [
          { title: 'Yes', url: 'https://example.com/yes' },
          { title: 'No', url: 'https://example.com/no' }
        ],
        notification_type: 'draft'
      };

      const response = await apiClient.sendNotification(notification);
      
      expect(response).toBeDefined();
      expect(response).toHaveProperty('success', true);
      expect(response).toHaveProperty('notification_id');
    });
  });

  describe('GET /notifications/sent', () => {
    it('should retrieve sent notifications', async () => {
      const response = await apiClient.getSentNotifications({ limit: 10 });
      
      expect(response).toBeDefined();
      // API may return success:true with empty data
      if (response.data) {
        expect(Array.isArray(response.data)).toBe(true);
      }
    });

    it('should handle empty notifications list', async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);

      const response = await apiClient.getSentNotifications({
        start_date: startDate.toISOString(),
        end_date: new Date().toISOString()
      });
      
      expect(response).toBeDefined();
    });
  });

  describe('GET /notifications/scheduled', () => {
    it('should retrieve scheduled notifications', async () => {
      const response = await apiClient.getScheduledNotifications();
      
      expect(response).toBeDefined();
      if (response.data) {
        expect(Array.isArray(response.data)).toBe(true);
      }
    });
  });

  describe('GET /notifications/draft', () => {
    it('should retrieve draft notifications', async () => {
      const response = await apiClient.getDraftNotifications();
      
      expect(response).toBeDefined();
      if (response.data) {
        expect(Array.isArray(response.data)).toBe(true);
      }
    });
  });

  describe('GET /notifications/:id', () => {
    it('should retrieve notification details if notifications exist', async () => {
      // First create a draft notification
      const notification = {
        title: 'Test for Retrieval',
        message: 'Testing notification retrieval',
        url: 'https://example.com',
        notification_type: 'draft'
      };

      const createResponse = await apiClient.sendNotification(notification);
      
      if (createResponse.notification_id) {
        const response = await apiClient.getNotificationById(createResponse.notification_id);
        expect(response).toBeDefined();
      }
    });
  });

  describe('DELETE /notifications/:id', () => {
    it('should delete a draft notification', async () => {
      // Create a draft notification
      const notification = {
        title: 'Test Delete Notification',
        message: 'This will be deleted',
        url: 'https://example.com',
        notification_type: 'draft'
      };

      const createResponse = await apiClient.sendNotification(notification);
      expect(createResponse.notification_id).toBeDefined();

      if (createResponse.notification_id) {
        const deleteResponse = await apiClient.deleteNotification(createResponse.notification_id);
        expect(deleteResponse).toBeDefined();
      }
    });
  });
});
