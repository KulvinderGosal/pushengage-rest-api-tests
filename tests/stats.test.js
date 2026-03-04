import { describe, it, expect, beforeAll } from 'vitest';
import { PushEngageAPIClient } from '../src/api-client.js';

describe('Stats and Analytics API Tests', () => {
  let apiClient;

  beforeAll(() => {
    apiClient = new PushEngageAPIClient();
  });

  describe('GET /stats', () => {
    it('should retrieve site statistics', async () => {
      const response = await apiClient.getSiteStats();
      
      expect(response).toBeDefined();
      expect(response.data).toBeDefined();
    });

    it('should retrieve stats for date range', async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      const response = await apiClient.getSiteStats({
        start_date: startDate.toISOString(),
        end_date: new Date().toISOString()
      });
      
      expect(response).toBeDefined();
      expect(response.data).toHaveProperty('subscribers');
      expect(response.data).toHaveProperty('notifications_sent');
    });

    it('should verify stats contain expected metrics', async () => {
      const response = await apiClient.getSiteStats();
      
      expect(response.data).toBeDefined();
      if (Object.keys(response.data).length > 0) {
        expect(response.data).toHaveProperty('subscribers');
        expect(typeof response.data.subscribers).toBe('number');
      }
    });
  });

  describe('GET /attributes', () => {
    it('should retrieve site attributes', async () => {
      const response = await apiClient.getSiteAttributes();
      
      expect(response).toBeDefined();
      expect(response.data).toBeDefined();
      expect(Array.isArray(response.data)).toBe(true);
    });

    it('should verify attributes structure', async () => {
      const response = await apiClient.getSiteAttributes();
      
      if (response.data.length > 0) {
        const attribute = response.data[0];
        expect(attribute).toHaveProperty('key');
        expect(attribute).toHaveProperty('type');
      }
    });
  });
});
