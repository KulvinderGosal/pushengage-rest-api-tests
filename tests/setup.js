import { config } from 'dotenv';
import { beforeAll, afterAll } from 'vitest';

beforeAll(() => {
  config();
  
  const requiredEnvVars = ['PUSHENGAGE_API_KEY', 'PUSHENGAGE_SITE_ID'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn(`Warning: Missing environment variables: ${missingVars.join(', ')}`);
    console.warn('Please copy .env.example to .env and fill in your credentials');
  }
});

afterAll(() => {
  console.log('\nTest suite completed');
});
