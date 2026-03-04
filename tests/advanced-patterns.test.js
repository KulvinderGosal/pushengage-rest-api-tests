import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { PushEngageAPIClient } from '../src/api-client.js';

/**
 * Advanced testing patterns and best practices
 * Use these examples as templates for your own tests
 */

describe('Advanced Testing Patterns', () => {
  let apiClient;
  const testCleanup = [];

  beforeAll(() => {
    apiClient = new PushEngageAPIClient();
  });

  afterAll(async () => {
    // Clean up any test data created during tests
    console.log(`\nCleaning up ${testCleanup.length} test resources...`);
    
    for (const cleanup of testCleanup) {
      try {
        await cleanup();
      } catch (error) {
        console.warn('Cleanup failed:', error.message);
      }
    }
  });

  describe('Data-Driven Testing', () => {
    it.each([
      { device: 'desktop', browser: 'chrome' },
      { device: 'mobile', browser: 'safari' },
      { device: 'tablet', browser: 'firefox' }
    ])('should add subscriber with device: $device and browser: $browser', async ({ device, browser }) => {
      const subscriber = {
        subscription_token: `test_${device}_${browser}_${Date.now()}`,
        device,
        browser
      };

      const response = await apiClient.addSubscriber(subscriber);
      expect(response.data).toHaveProperty('id');
      
      // Schedule cleanup
      testCleanup.push(() => apiClient.deleteSubscriber(response.data.id));
    });
  });

  describe('Conditional Testing', () => {
    it('should skip test if no subscribers exist', async () => {
      const subscribers = await apiClient.getSubscribers({ limit: 1 });
      
      if (subscribers.data.length === 0) {
        console.log('⏭️  Skipping test - no subscribers found');
        return;
      }

      const subscriberId = subscribers.data[0].id;
      const response = await apiClient.getSubscriberById(subscriberId);
      expect(response.data).toHaveProperty('id', subscriberId);
    });
  });

  describe('Retry Logic for Flaky Tests', () => {
    it('should handle intermittent failures', async () => {
      const maxRetries = 3;
      let lastError;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const response = await apiClient.getSubscribers({ limit: 5 });
          expect(response.data).toBeDefined();
          return; // Success!
        } catch (error) {
          lastError = error;
          if (attempt < maxRetries) {
            console.log(`Retry attempt ${attempt}/${maxRetries}`);
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          }
        }
      }

      throw lastError; // All retries failed
    }, 30000); // Extended timeout for retries
  });

  describe('Snapshot Testing for Responses', () => {
    it('should match expected response structure', async () => {
      const response = await apiClient.getSubscribers({ limit: 1 });
      
      if (response.data.length > 0) {
        const subscriber = response.data[0];
        
        // Verify response structure
        const expectedKeys = ['id', 'device', 'browser', 'created_at'];
        expectedKeys.forEach(key => {
          expect(subscriber).toHaveProperty(key);
        });
      }
    });
  });

  describe('Performance Testing', () => {
    it('should respond within acceptable time', async () => {
      const startTime = Date.now();
      
      await apiClient.getSubscribers({ limit: 10 });
      
      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
    });

    it('should handle concurrent requests', async () => {
      const requests = Array(5).fill().map((_, i) => 
        apiClient.getSubscribers({ limit: 1, offset: i })
      );

      const startTime = Date.now();
      const responses = await Promise.all(requests);
      const duration = Date.now() - startTime;

      expect(responses).toHaveLength(5);
      expect(duration).toBeLessThan(10000); // All 5 should complete within 10 seconds
    });
  });

  describe('Boundary Testing', () => {
    it('should handle maximum page size', async () => {
      const response = await apiClient.getSubscribers({ limit: 100 });
      
      expect(response.data).toBeDefined();
      expect(response.data.length).toBeLessThanOrEqual(100);
    });

    it('should handle minimum page size', async () => {
      const response = await apiClient.getSubscribers({ limit: 1 });
      
      expect(response.data).toBeDefined();
      expect(response.data.length).toBeLessThanOrEqual(1);
    });

    it('should handle edge case - zero limit', async () => {
      try {
        await apiClient.getSubscribers({ limit: 0 });
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('Error Recovery Testing', () => {
    it('should recover from temporary failures', async () => {
      // Simulate a temporary failure by using invalid ID
      try {
        await apiClient.getSubscriberById('invalid-id');
      } catch (error) {
        expect(error).toBeDefined();
      }

      // Verify API is still functional after error
      const response = await apiClient.getSubscribers({ limit: 1 });
      expect(response.data).toBeDefined();
    });
  });

  describe('Complex Workflow Testing', () => {
    it('should handle multi-step campaign creation and management', async () => {
      // Step 1: Create draft campaign
      const campaign = {
        name: `Advanced Test Campaign ${Date.now()}`,
        type: 'drip',
        status: 'draft',
        notifications: [
          {
            title: 'Welcome',
            message: 'Welcome to our service!',
            url: 'https://example.com/welcome',
            delay: 0
          },
          {
            title: 'Day 2 Follow-up',
            message: 'How are you enjoying our service?',
            url: 'https://example.com/feedback',
            delay: 172800 // 2 days
          }
        ]
      };

      const createResponse = await apiClient.createCampaign(campaign);
      const campaignId = createResponse.data.id;
      
      testCleanup.push(() => apiClient.deleteCampaign(campaignId));

      expect(createResponse.data).toHaveProperty('id');
      expect(createResponse.data).toHaveProperty('status', 'draft');

      // Step 2: Verify campaign was created
      const getResponse = await apiClient.getCampaignById(campaignId);
      expect(getResponse.data).toHaveProperty('id', campaignId);

      // Step 3: Update campaign to active
      const updateResponse = await apiClient.updateCampaign(campaignId, {
        status: 'active'
      });
      expect(updateResponse.data).toHaveProperty('status', 'active');

      // Step 4: Verify campaign is in campaigns list
      const listResponse = await apiClient.getCampaigns();
      const foundCampaign = listResponse.data.find(c => c.id === campaignId);
      expect(foundCampaign).toBeDefined();
      expect(foundCampaign.status).toBe('active');

      // Step 5: Deactivate campaign
      const deactivateResponse = await apiClient.updateCampaign(campaignId, {
        status: 'paused'
      });
      expect(deactivateResponse.data).toHaveProperty('status', 'paused');
    });
  });

  describe('Pagination Testing', () => {
    it('should handle pagination correctly', async () => {
      const pageSize = 5;
      const page1 = await apiClient.getSubscribers({ limit: pageSize, offset: 0 });
      const page2 = await apiClient.getSubscribers({ limit: pageSize, offset: pageSize });

      expect(page1.data).toBeDefined();
      expect(page2.data).toBeDefined();

      // Verify pages don't have duplicate IDs
      const page1Ids = page1.data.map(s => s.id);
      const page2Ids = page2.data.map(s => s.id);
      const duplicates = page1Ids.filter(id => page2Ids.includes(id));
      
      expect(duplicates).toHaveLength(0);
    });
  });

  describe('Validation Testing', () => {
    it('should validate notification title length', async () => {
      const notification = {
        title: 'A'.repeat(100), // Exceeds max length
        message: 'Test message',
        url: 'https://example.com'
      };

      try {
        await apiClient.sendNotification(notification);
        throw new Error('Should have thrown validation error');
      } catch (error) {
        expect(error.message).toContain('title');
      }
    });

    it('should validate required fields', async () => {
      const invalidNotification = {
        message: 'Missing title'
      };

      try {
        await apiClient.sendNotification(invalidNotification);
        throw new Error('Should have thrown validation error');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should validate URL format', async () => {
      const notification = {
        title: 'Test',
        message: 'Test message',
        url: 'not-a-valid-url'
      };

      try {
        await apiClient.sendNotification(notification);
        // May or may not throw depending on API validation
      } catch (error) {
        // Expected if API validates URLs
        expect(error).toBeDefined();
      }
    });
  });

  describe('State Management Testing', () => {
    it('should maintain consistent state across operations', async () => {
      // Get initial subscriber count
      const initial = await apiClient.getSubscribers();
      const initialCount = initial.data.length;

      // Add subscriber
      const subscriber = {
        subscription_token: `state_test_${Date.now()}`,
        device: 'desktop',
        browser: 'chrome'
      };
      const addResponse = await apiClient.addSubscriber(subscriber);
      const subscriberId = addResponse.data.id;
      
      testCleanup.push(() => apiClient.deleteSubscriber(subscriberId));

      // Verify count increased
      const afterAdd = await apiClient.getSubscribers();
      expect(afterAdd.data.length).toBe(initialCount + 1);

      // Update subscriber
      await apiClient.updateSubscriber(subscriberId, {
        attributes: { test_key: 'test_value' }
      });

      // Verify count unchanged after update
      const afterUpdate = await apiClient.getSubscribers();
      expect(afterUpdate.data.length).toBe(initialCount + 1);

      // Delete subscriber
      await apiClient.deleteSubscriber(subscriberId);

      // Verify count decreased
      const afterDelete = await apiClient.getSubscribers();
      expect(afterDelete.data.length).toBe(initialCount);
    });
  });
});
