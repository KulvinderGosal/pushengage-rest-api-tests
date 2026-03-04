import { describe, it, expect, beforeAll } from 'vitest';
import { PushEngageAPIClient } from '../src/api-client.js';

describe('Segments API Tests', () => {
  let apiClient;

  beforeAll(() => {
    apiClient = new PushEngageAPIClient();
  });

  describe('GET /segments', () => {
    it('should retrieve list of segments', async () => {
      const response = await apiClient.getSegments();
      
      expect(response).toBeDefined();
      expect(response.data).toBeDefined();
      expect(Array.isArray(response.data)).toBe(true);
    });

    it('should handle pagination for segments', async () => {
      const response = await apiClient.getSegments({ 
        limit: 5, 
        offset: 0 
      });
      
      expect(response).toBeDefined();
      expect(response.data.length).toBeLessThanOrEqual(5);
    });

    it('should verify segment structure', async () => {
      const response = await apiClient.getSegments({ limit: 1 });
      
      if (response.data.length > 0) {
        const segment = response.data[0];
        expect(segment).toHaveProperty('id');
        expect(segment).toHaveProperty('name');
        expect(segment).toHaveProperty('conditions');
      }
    });
  });
});
