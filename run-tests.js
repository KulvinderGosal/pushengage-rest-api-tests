#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const commands = {
  all: 'vitest run --reporter=verbose',
  watch: 'vitest',
  coverage: 'vitest run --coverage',
  ui: 'vitest --ui',
  subscribers: 'vitest run tests/subscribers.test.js --reporter=verbose',
  notifications: 'vitest run tests/notifications.test.js --reporter=verbose',
  campaigns: 'vitest run tests/campaigns.test.js --reporter=verbose',
  segments: 'vitest run tests/segments.test.js --reporter=verbose',
  stats: 'vitest run tests/stats.test.js --reporter=verbose',
  integration: 'vitest run tests/integration.test.js --reporter=verbose'
};

const args = process.argv.slice(2);
const testType = args[0] || 'all';

if (!commands[testType]) {
  console.error(`Invalid test type: ${testType}`);
  console.log('\nAvailable test types:');
  Object.keys(commands).forEach(key => {
    console.log(`  - ${key}`);
  });
  process.exit(1);
}

console.log(`\n🚀 Running ${testType} tests...\n`);

try {
  const { stdout, stderr } = await execAsync(commands[testType]);
  if (stdout) console.log(stdout);
  if (stderr) console.error(stderr);
  console.log(`\n✅ ${testType} tests completed successfully!\n`);
} catch (error) {
  console.error(`\n❌ ${testType} tests failed!\n`);
  console.error(error.stdout || error.message);
  process.exit(1);
}
