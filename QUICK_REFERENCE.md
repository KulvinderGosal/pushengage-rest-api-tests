# ⚡ Quick Reference Card

> **Keep this handy while working with the testing framework**

---

## 🚀 Essential Commands

```bash
# Setup
cp .env.example .env                # Create environment file
npm install                         # Install dependencies (already done)
npm run test:connection            # Verify API connection

# Testing
npm test                           # Run all tests
npm run test:watch                 # Watch mode (auto-rerun on changes)
npm run test:coverage              # Generate coverage report
npm run test:ui                    # Interactive test UI

# Specific Test Suites
npm run test:subscribers           # Test subscribers only
npm run test:notifications         # Test notifications only
npm run test:campaigns             # Test campaigns only
npm run test:integration           # Test workflows only
```

---

## 📋 API Client Methods

```javascript
import { PushEngageAPIClient } from './src/api-client.js';
const client = new PushEngageAPIClient();

// Subscribers
await client.getSubscribers({ limit, offset, status })
await client.getSubscriberById(id)
await client.addSubscriber({ subscription_token, device, browser })
await client.updateSubscriber(id, { attributes })
await client.deleteSubscriber(id)

// Notifications
await client.sendNotification({ title, message, url, image, actions })
await client.getSentNotifications({ limit, start_date, end_date })
await client.getScheduledNotifications()
await client.getDraftNotifications()
await client.getNotificationById(id)
await client.deleteNotification(id)

// Campaigns
await client.getCampaigns({ limit, type, status })
await client.getCampaignById(id)
await client.createCampaign({ name, type, status, notifications })
await client.updateCampaign(id, { name, status })
await client.deleteCampaign(id)

// Other
await client.getSegments({ limit, offset })
await client.getSiteAttributes()
await client.getSiteStats({ start_date, end_date })
```

---

## ✍️ Test Patterns

### Basic Test Structure
```javascript
import { describe, it, expect, beforeAll } from 'vitest';
import { PushEngageAPIClient } from '../src/api-client.js';

describe('Feature Tests', () => {
  let apiClient;
  
  beforeAll(() => {
    apiClient = new PushEngageAPIClient();
  });
  
  it('should test something', async () => {
    const response = await apiClient.someMethod();
    expect(response).toBeDefined();
  });
});
```

### Common Assertions
```javascript
expect(response).toBeDefined()
expect(response).toHaveProperty('id')
expect(response.data).toHaveLength(5)
expect(response.status).toBe('active')
expect(Array.isArray(response.data)).toBe(true)
await expect(apiClient.method()).rejects.toThrow()
```

---

## 📂 File Locations

```
Key Files:
├─ src/api-client.js              # All API methods
├─ tests/*.test.js                # Test files
├─ .env                           # Your credentials (create this!)
├─ vitest.config.js              # Test configuration
└─ test-connection.js            # Connection verifier

Documentation:
├─ PROJECT_SUMMARY.md            # This summary
├─ GETTING_STARTED.md            # Quick start
├─ SETUP.md                      # Setup guide
├─ MIGRATION_GUIDE.md            # Postman → Automated
├─ VISUAL_GUIDE.md               # Flow diagrams
└─ README.md                     # Complete docs
```

---

## 🔧 Environment Variables

```bash
# Required in .env file:
PUSHENGAGE_API_KEY=your_api_key_here
PUSHENGAGE_SITE_ID=your_site_id_here
PUSHENGAGE_BASE_URL=https://api.pushengage.com/apiv1

# Optional:
TEST_TIMEOUT=30000
TEST_RETRY_COUNT=2
```

---

## 💡 Common Tasks

### Adding a New Test
1. Create `tests/my-feature.test.js`
2. Import API client and Vitest utilities
3. Write tests using `describe` and `it`
4. Run: `npm run test:specific -- my-feature.test.js`

### Adding a New Endpoint
1. Add method to `src/api-client.js`
2. Create tests in appropriate test file
3. Run tests to verify
4. Update documentation

### Debugging a Failing Test
1. Run: `npm run test:connection` (verify connection)
2. Run specific test: `npm run test:specific -- filename.test.js`
3. Check error message and response data
4. Verify credentials and endpoint URL
5. Check API documentation for changes

---

## 🎯 Test Organization

```
tests/
├─ setup.js                  # Global test setup
├─ subscribers.test.js       # Subscriber CRUD + errors
├─ notifications.test.js     # Send, schedule, validate
├─ campaigns.test.js         # Campaign lifecycle
├─ segments.test.js          # Segments and filtering
├─ stats.test.js            # Analytics and attributes
├─ integration.test.js       # E2E workflows
└─ advanced-patterns.test.js # Advanced examples
```

---

## 🐛 Troubleshooting Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Missing `.env` | `cp .env.example .env` then add credentials |
| 401/403 errors | Verify API key in `.env` |
| Tests timeout | Increase timeout in test file |
| Connection fails | Run `npm run test:connection` |
| Old dependencies | Run `npm install` |

---

## 📊 Test Coverage Goals

- ✅ All endpoints have at least 1 test
- ✅ Happy path scenarios covered
- ✅ Error scenarios covered
- ✅ Edge cases covered
- ✅ Integration workflows tested
- ✅ 80%+ code coverage

---

## 🔗 Quick Links

- **PushEngage API Docs**: https://www.pushengage.com/api/rest-api/getting-started
- **Vitest Docs**: https://vitest.dev/
- **Axios Docs**: https://axios-http.com/

---

## 💼 CI/CD Setup

1. Add secrets to GitHub:
   - `PUSHENGAGE_API_KEY`
   - `PUSHENGAGE_SITE_ID`
2. Push code to repository
3. GitHub Actions runs automatically
4. Check Actions tab for results

---

## 📈 Performance Tips

1. Use `test:watch` during development
2. Run specific test files instead of all tests
3. Use `beforeAll` instead of `beforeEach` when possible
4. Clean up test data in `afterAll`
5. Mock external dependencies when appropriate

---

## 🎓 Best Practices

- ✅ Keep tests independent
- ✅ Use descriptive test names
- ✅ Clean up test data
- ✅ Test both success and error cases
- ✅ Use meaningful assertions
- ✅ Document complex test logic
- ✅ Run tests before committing

---

## 🚦 Test Status Indicators

```bash
# Test output symbols:
✓  Test passed
✗  Test failed
⏭  Test skipped
↻  Test retrying
```

---

## ⌨️ Keyboard Shortcuts (Test UI)

When running `npm run test:ui`:
- `f` - Filter tests
- `r` - Re-run tests
- `c` - Clear console
- `q` - Quit

---

## 📞 Getting Help

1. Check documentation files
2. Review example tests
3. Run connection test
4. Check error messages
5. Review PushEngage API docs

---

**Print this page for quick reference!** 📄

**File**: `QUICK_REFERENCE.md` | **Framework**: Vitest + Axios | **Language**: JavaScript (ESM)
