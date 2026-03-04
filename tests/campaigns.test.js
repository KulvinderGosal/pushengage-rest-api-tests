import { describe, it, expect, beforeAll } from 'vitest';
import { PushEngageAPIClient } from '../src/api-client.js';

describe('Campaigns API Tests', () => {
  let apiClient;

  beforeAll(() => {
    apiClient = new PushEngageAPIClient();
  });

  describe('GET /campaigns', () => {
    it('should retrieve list of campaigns', async () => {
      const response = await apiClient.getCampaigns({ limit: 10 });
      
      expect(response).toBeDefined();
      expect(response.data).toBeDefined();
      expect(Array.isArray(response.data)).toBe(true);
    });

    it('should filter campaigns by type', async () => {
      const response = await apiClient.getCampaigns({ 
        type: 'drip' 
      });
      
      expect(response).toBeDefined();
    });

    it('should filter campaigns by status', async () => {
      const response = await apiClient.getCampaigns({ 
        status: 'active' 
      });
      
      expect(response).toBeDefined();
      if (response.data.length > 0) {
        expect(response.data[0]).toHaveProperty('status');
      }
    });
  });

  describe('GET /campaigns/:id', () => {
    it('should retrieve a specific campaign', async () => {
      const campaignsResponse = await apiClient.getCampaigns({ limit: 1 });
      
      if (campaignsResponse.data.length > 0) {
        const campaignId = campaignsResponse.data[0].id;
        const response = await apiClient.getCampaignById(campaignId);
        
        expect(response).toBeDefined();
        expect(response.data).toHaveProperty('id', campaignId);
        expect(response.data).toHaveProperty('name');
      }
    });
  });

  describe('POST /campaigns', () => {
    it('should create a new campaign', async () => {
      const campaign = {
        name: `Test Campaign ${Date.now()}`,
        type: 'drip',
        status: 'draft',
        notifications: [
          {
            title: 'Welcome',
            message: 'Thanks for subscribing!',
            url: 'https://example.com',
            delay: 0
          }
        ]
      };

      const response = await apiClient.createCampaign(campaign);
      
      expect(response).toBeDefined();
      expect(response.data).toHaveProperty('id');
      expect(response.data).toHaveProperty('name', campaign.name);
    });

    it('should validate required fields', async () => {
      const invalidCampaign = {
        type: 'drip'
      };

      await expect(
        apiClient.createCampaign(invalidCampaign)
      ).rejects.toThrow();
    });

    it('should create multi-step drip campaign', async () => {
      const campaign = {
        name: `Multi-step Campaign ${Date.now()}`,
        type: 'drip',
        status: 'draft',
        notifications: [
          {
            title: 'Step 1',
            message: 'Welcome!',
            url: 'https://example.com/step1',
            delay: 0
          },
          {
            title: 'Step 2',
            message: 'Day 2 message',
            url: 'https://example.com/step2',
            delay: 86400
          },
          {
            title: 'Step 3',
            message: 'Day 7 message',
            url: 'https://example.com/step3',
            delay: 604800
          }
        ]
      };

      const response = await apiClient.createCampaign(campaign);
      
      expect(response).toBeDefined();
      expect(response.data.notifications).toHaveLength(3);
    });
  });

  describe('PUT /campaigns/:id', () => {
    it('should update campaign details', async () => {
      const createResponse = await apiClient.createCampaign({
        name: `Update Test Campaign ${Date.now()}`,
        type: 'drip',
        status: 'draft'
      });

      const campaignId = createResponse.data.id;
      const updateData = {
        name: 'Updated Campaign Name',
        status: 'active'
      };

      const response = await apiClient.updateCampaign(campaignId, updateData);
      
      expect(response).toBeDefined();
      expect(response.data).toHaveProperty('id', campaignId);
      expect(response.data).toHaveProperty('name', updateData.name);
    });
  });

  describe('DELETE /campaigns/:id', () => {
    it('should delete a campaign', async () => {
      const createResponse = await apiClient.createCampaign({
        name: `Delete Test Campaign ${Date.now()}`,
        type: 'drip',
        status: 'draft'
      });

      const campaignId = createResponse.data.id;
      const deleteResponse = await apiClient.deleteCampaign(campaignId);
      
      expect(deleteResponse).toBeDefined();
      expect(deleteResponse.success).toBe(true);
    });
  });
});
