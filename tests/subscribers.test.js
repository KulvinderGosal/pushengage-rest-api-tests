import { describe, it, expect, beforeAll } from 'vitest';
import { PushEngageAPIClient } from '../src/api-client.js';

describe('Subscribers API Tests', () => {
  let apiClient;

  beforeAll(() => {
    apiClient = new PushEngageAPIClient();
  });

  describe('GET /subscribers', () => {
    it('should retrieve list of subscribers', async () => {
      const response = await apiClient.getSubscribers({ limit: 10 });
      
      expect(response).toBeDefined();
      expect(response).toHaveProperty('data');
      expect(Array.isArray(response.data)).toBe(true);
    });

    it('should handle pagination parameters', async () => {
      const response = await apiClient.getSubscribers({ 
        limit: 5, 
        offset: 0 
      });
      
      expect(response).toBeDefined();
      expect(response.data.length).toBeLessThanOrEqual(5);
    });

    it('should filter subscribers by status', async () => {
      const response = await apiClient.getSubscribers({ 
        status: 'active' 
      });
      
      expect(response).toBeDefined();
      if (response.data.length > 0) {
        expect(response.data[0]).toHaveProperty('status');
      }
    });
  });

  describe('GET /subscribers/:id', () => {
    it('should retrieve a specific subscriber by ID', async () => {
      const subscribersResponse = await apiClient.getSubscribers({ limit: 1 });
      
      if (subscribersResponse.data.length > 0) {
        const subscriberId = subscribersResponse.data[0].id;
        const response = await apiClient.getSubscriberById(subscriberId);
        
        expect(response).toBeDefined();
        expect(response.data).toHaveProperty('id', subscriberId);
      }
    });

    it('should return 404 for non-existent subscriber', async () => {
      await expect(
        apiClient.getSubscriberById('non-existent-id-12345')
      ).rejects.toThrow();
    });
  });

  describe('POST /subscribers', () => {
    it('should add a new subscriber', async () => {
      const newSubscriber = {
        subscription_token: `test_token_${Date.now()}`,
        device: 'desktop',
        browser: 'chrome',
        country: 'US'
      };

      const response = await apiClient.addSubscriber(newSubscriber);
      
      expect(response).toBeDefined();
      expect(response.data).toHaveProperty('id');
    });

    it('should validate required fields', async () => {
      const invalidSubscriber = {
        device: 'desktop'
      };

      await expect(
        apiClient.addSubscriber(invalidSubscriber)
      ).rejects.toThrow();
    });
  });

  describe('PUT /subscribers/:id', () => {
    it('should update subscriber attributes', async () => {
      const subscribersResponse = await apiClient.getSubscribers({ limit: 1 });
      
      if (subscribersResponse.data.length > 0) {
        const subscriberId = subscribersResponse.data[0].id;
        const updateData = {
          attributes: {
            custom_field: 'updated_value'
          }
        };

        const response = await apiClient.updateSubscriber(subscriberId, updateData);
        
        expect(response).toBeDefined();
        expect(response.data).toHaveProperty('id', subscriberId);
      }
    });
  });

  describe('DELETE /subscribers/:id', () => {
    it('should delete a subscriber', async () => {
      const newSubscriber = {
        subscription_token: `test_delete_${Date.now()}`,
        device: 'mobile',
        browser: 'safari'
      };

      const createResponse = await apiClient.addSubscriber(newSubscriber);
      const subscriberId = createResponse.data.id;

      const deleteResponse = await apiClient.deleteSubscriber(subscriberId);
      
      expect(deleteResponse).toBeDefined();
      expect(deleteResponse.success).toBe(true);
    });
  });
});
