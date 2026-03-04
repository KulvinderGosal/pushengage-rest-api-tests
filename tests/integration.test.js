import { describe, it, expect, beforeAll } from 'vitest';
import { PushEngageAPIClient } from '../src/api-client.js';

describe('Integration Tests - End-to-End Workflows', () => {
  let apiClient;

  beforeAll(() => {
    apiClient = new PushEngageAPIClient();
  });

  describe('Complete Notification Workflow', () => {
    it('should create, send, and verify a notification', async () => {
      const notification = {
        title: 'E2E Test Notification',
        message: 'Testing complete workflow',
        url: 'https://example.com/e2e-test',
        notification_type: 'broadcast',
        send_to: 'all'
      };

      const sendResponse = await apiClient.sendNotification(notification);
      expect(sendResponse.data).toHaveProperty('id');

      const notificationId = sendResponse.data.id;

      await new Promise(resolve => setTimeout(resolve, 2000));

      const getResponse = await apiClient.getNotificationById(notificationId);
      expect(getResponse.data).toHaveProperty('id', notificationId);
      expect(getResponse.data).toHaveProperty('title', notification.title);
    });
  });

  describe('Complete Campaign Workflow', () => {
    it('should create, update, and manage a campaign', async () => {
      const campaign = {
        name: `E2E Campaign ${Date.now()}`,
        type: 'drip',
        status: 'draft',
        notifications: [
          {
            title: 'Welcome Message',
            message: 'Thanks for joining!',
            url: 'https://example.com/welcome',
            delay: 0
          }
        ]
      };

      const createResponse = await apiClient.createCampaign(campaign);
      expect(createResponse.data).toHaveProperty('id');

      const campaignId = createResponse.data.id;

      const updateData = {
        status: 'active'
      };
      const updateResponse = await apiClient.updateCampaign(campaignId, updateData);
      expect(updateResponse.data).toHaveProperty('status', 'active');

      await new Promise(resolve => setTimeout(resolve, 1000));

      const getResponse = await apiClient.getCampaignById(campaignId);
      expect(getResponse.data).toHaveProperty('id', campaignId);
      expect(getResponse.data).toHaveProperty('status', 'active');

      const deleteResponse = await apiClient.deleteCampaign(campaignId);
      expect(deleteResponse.success).toBe(true);
    });
  });

  describe('Subscriber Management Workflow', () => {
    it('should add, update, and delete a subscriber', async () => {
      const subscriber = {
        subscription_token: `e2e_test_${Date.now()}`,
        device: 'desktop',
        browser: 'chrome',
        country: 'US'
      };

      const createResponse = await apiClient.addSubscriber(subscriber);
      expect(createResponse.data).toHaveProperty('id');

      const subscriberId = createResponse.data.id;

      const updateData = {
        attributes: {
          test_field: 'test_value'
        }
      };
      const updateResponse = await apiClient.updateSubscriber(subscriberId, updateData);
      expect(updateResponse.data).toHaveProperty('id', subscriberId);

      const getResponse = await apiClient.getSubscriberById(subscriberId);
      expect(getResponse.data).toHaveProperty('id', subscriberId);

      const deleteResponse = await apiClient.deleteSubscriber(subscriberId);
      expect(deleteResponse.success).toBe(true);
    });
  });

  describe('Rate Limiting and Error Handling', () => {
    it('should handle rate limits gracefully', async () => {
      const requests = Array(5).fill().map(() => 
        apiClient.getSubscribers({ limit: 1 })
      );

      const responses = await Promise.allSettled(requests);
      const successful = responses.filter(r => r.status === 'fulfilled').length;
      
      expect(successful).toBeGreaterThan(0);
    });

    it('should handle network errors', async () => {
      const clientWithBadURL = new PushEngageAPIClient({
        baseURL: 'https://invalid-url-that-does-not-exist.com',
        apiKey: 'test-key',
        siteId: 'test-site'
      });

      await expect(
        clientWithBadURL.getSubscribers()
      ).rejects.toThrow();
    });

    it('should handle authentication errors', async () => {
      const clientWithBadAuth = new PushEngageAPIClient({
        apiKey: 'invalid-api-key',
        siteId: 'invalid-site-id'
      });

      await expect(
        clientWithBadAuth.getSubscribers()
      ).rejects.toThrow();
    });
  });
});
