# Visual Testing Flow Guide

## 🎯 How It All Works

```
┌─────────────────────────────────────────────────────────────┐
│                     YOUR WORKFLOW                            │
└─────────────────────────────────────────────────────────────┘
                             │
                             ▼
        ┌────────────────────────────────────┐
        │  1. Configure Credentials          │
        │     Create .env file with          │
        │     API Key & Site ID              │
        └────────────────────────────────────┘
                             │
                             ▼
        ┌────────────────────────────────────┐
        │  2. Verify Connection              │
        │     npm run test:connection        │
        │     ✅ Connection successful       │
        └────────────────────────────────────┘
                             │
                             ▼
        ┌────────────────────────────────────┐
        │  3. Run Tests                      │
        │     npm test                       │
        └────────────────────────────────────┘
                             │
                             ▼
        ┌────────────────────────────────────┐
        │  4. Review Results                 │
        │     ✓ 45 tests passed              │
        │     Coverage: 85%                  │
        └────────────────────────────────────┘
```

## 📋 Test Execution Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    TEST EXECUTION                             │
└──────────────────────────────────────────────────────────────┘

npm test
   │
   ├─► Load Environment (.env)
   │
   ├─► Initialize API Client (src/api-client.js)
   │     │
   │     ├─► Set Base URL
   │     ├─► Add Authentication Headers
   │     └─► Configure Timeouts
   │
   ├─► Run Test Suites
   │     │
   │     ├─► Subscribers Tests (tests/subscribers.test.js)
   │     │     ├─ GET /subscribers
   │     │     ├─ POST /subscribers
   │     │     ├─ PUT /subscribers/:id
   │     │     └─ DELETE /subscribers/:id
   │     │
   │     ├─► Notifications Tests (tests/notifications.test.js)
   │     │     ├─ POST /notifications (send)
   │     │     ├─ POST /notifications (schedule)
   │     │     ├─ GET /notifications/sent
   │     │     └─ GET /notifications/:id
   │     │
   │     ├─► Campaigns Tests (tests/campaigns.test.js)
   │     │     ├─ GET /campaigns
   │     │     ├─ POST /campaigns
   │     │     ├─ PUT /campaigns/:id
   │     │     └─ DELETE /campaigns/:id
   │     │
   │     ├─► Segments Tests (tests/segments.test.js)
   │     │     └─ GET /segments
   │     │
   │     ├─► Stats Tests (tests/stats.test.js)
   │     │     ├─ GET /stats
   │     │     └─ GET /attributes
   │     │
   │     └─► Integration Tests (tests/integration.test.js)
   │           ├─ Complete notification workflow
   │           ├─ Complete campaign workflow
   │           └─ Subscriber management workflow
   │
   └─► Generate Report
         ├─ Test Results
         ├─ Coverage Data
         └─ Performance Metrics
```

## 🔄 API Client Architecture

```
┌────────────────────────────────────────────────────────────┐
│            PushEngageAPIClient (src/api-client.js)          │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  Constructor                                                │
│  ├─ apiKey (from .env)                                     │
│  ├─ siteId (from .env)                                     │
│  ├─ baseURL (PushEngage API)                              │
│  └─ axios instance with interceptors                       │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐ │
│  │             Request Interceptor                       │ │
│  │  Automatically adds:                                  │ │
│  │  • Authorization: Bearer <API_KEY>                   │ │
│  │  • Content-Type: application/json                    │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐ │
│  │            Response Interceptor                       │ │
│  │  Handles:                                             │ │
│  │  • Success responses → return data                   │ │
│  │  • Error responses → format error message            │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                             │
│  Subscriber Methods                                         │
│  ├─ getSubscribers(params)                                │
│  ├─ getSubscriberById(id)                                 │
│  ├─ addSubscriber(data)                                   │
│  ├─ updateSubscriber(id, data)                            │
│  └─ deleteSubscriber(id)                                  │
│                                                             │
│  Notification Methods                                       │
│  ├─ sendNotification(data)                                │
│  ├─ getSentNotifications(params)                          │
│  ├─ getScheduledNotifications(params)                     │
│  ├─ getDraftNotifications(params)                         │
│  ├─ getNotificationById(id)                               │
│  └─ deleteNotification(id)                                │
│                                                             │
│  Campaign Methods                                           │
│  ├─ getCampaigns(params)                                  │
│  ├─ getCampaignById(id)                                   │
│  ├─ createCampaign(data)                                  │
│  ├─ updateCampaign(id, data)                              │
│  └─ deleteCampaign(id)                                    │
│                                                             │
│  Other Methods                                              │
│  ├─ getSegments(params)                                   │
│  ├─ getSiteAttributes()                                   │
│  └─ getSiteStats(params)                                  │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

## 🧪 Test Structure Pattern

```
tests/[feature].test.js
│
├─► describe('[Feature] API Tests', () => {
│     │
│     ├─► beforeAll(() => {
│     │     // Initialize API client once for all tests
│     │     apiClient = new PushEngageAPIClient();
│     │   })
│     │
│     ├─► describe('GET /endpoint', () => {
│     │     │
│     │     ├─► it('should retrieve data', async () => {
│     │     │     const response = await apiClient.getData();
│     │     │     expect(response).toBeDefined();
│     │     │   })
│     │     │
│     │     └─► it('should handle pagination', async () => {
│     │           const response = await apiClient.getData({ limit: 5 });
│     │           expect(response.data.length).toBeLessThanOrEqual(5);
│     │         })
│     │   })
│     │
│     ├─► describe('POST /endpoint', () => {
│     │     │
│     │     ├─► it('should create resource', async () => {
│     │     │     const data = { name: 'test' };
│     │     │     const response = await apiClient.createData(data);
│     │     │     expect(response.data).toHaveProperty('id');
│     │     │   })
│     │     │
│     │     └─► it('should validate required fields', async () => {
│     │           await expect(
│     │             apiClient.createData({})
│     │           ).rejects.toThrow();
│     │         })
│     │   })
│     │
│     └─► describe('DELETE /endpoint/:id', () => {
│           it('should delete resource', async () => {
│             // Create → Delete → Verify
│           })
│         })
│   })
```

## 🚀 CI/CD Pipeline Flow

```
GitHub Push/PR
      │
      ▼
┌─────────────────────────────────────────┐
│      GitHub Actions Triggered            │
│  (.github/workflows/api-tests.yml)       │
└─────────────────────────────────────────┘
      │
      ├─► Checkout Code
      │
      ├─► Setup Node.js
      │
      ├─► Install Dependencies (npm ci)
      │
      ├─► Run Tests
      │     └─► Load secrets from GitHub
      │         ├─ PUSHENGAGE_API_KEY
      │         └─ PUSHENGAGE_SITE_ID
      │
      ├─► Generate Coverage Report
      │
      ├─► Upload Coverage to Codecov
      │
      └─► ✅ Pass/❌ Fail
            └─► Update PR Status
```

## 📊 Test Coverage Map

```
┌──────────────────────────────────────────────────────────┐
│                    API COVERAGE                           │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  Subscribers API                  [████████████] 100%   │
│  ├─ List subscribers              ✓                      │
│  ├─ Get by ID                     ✓                      │
│  ├─ Add subscriber                ✓                      │
│  ├─ Update subscriber             ✓                      │
│  ├─ Delete subscriber             ✓                      │
│  └─ Error cases                   ✓                      │
│                                                           │
│  Notifications API                [████████████] 100%   │
│  ├─ Send notification             ✓                      │
│  ├─ Schedule notification         ✓                      │
│  ├─ Get sent notifications        ✓                      │
│  ├─ Get scheduled notifications   ✓                      │
│  ├─ Get draft notifications       ✓                      │
│  ├─ Get by ID                     ✓                      │
│  ├─ Delete notification           ✓                      │
│  ├─ With images                   ✓                      │
│  ├─ With action buttons           ✓                      │
│  └─ Validation                    ✓                      │
│                                                           │
│  Campaigns API                    [████████████] 100%   │
│  ├─ List campaigns                ✓                      │
│  ├─ Get by ID                     ✓                      │
│  ├─ Create campaign               ✓                      │
│  ├─ Update campaign               ✓                      │
│  ├─ Delete campaign               ✓                      │
│  ├─ Multi-step drip campaigns     ✓                      │
│  └─ Filtering                     ✓                      │
│                                                           │
│  Segments API                     [██████████  ] 80%    │
│  ├─ List segments                 ✓                      │
│  └─ Pagination                    ✓                      │
│                                                           │
│  Stats & Analytics API            [████████████] 100%   │
│  ├─ Get site stats                ✓                      │
│  ├─ Date range filtering          ✓                      │
│  └─ Get site attributes           ✓                      │
│                                                           │
│  Integration Workflows            [████████████] 100%   │
│  ├─ Complete notification flow    ✓                      │
│  ├─ Complete campaign flow        ✓                      │
│  ├─ Subscriber lifecycle          ✓                      │
│  ├─ Rate limiting                 ✓                      │
│  └─ Error handling                ✓                      │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

## 🎮 Interactive Development Flow

```
Terminal 1: Watch Mode
┌────────────────────────────────────┐
│ $ npm run test:watch               │
│                                     │
│ Watching for file changes...       │
│                                     │
│ File changed: subscribers.test.js  │
│ Re-running tests...                │
│                                     │
│ ✓ GET /subscribers (5ms)          │
│ ✓ POST /subscribers (120ms)       │
│                                     │
│ Tests passed! Watching...          │
└────────────────────────────────────┘

Terminal 2: Code Editor
┌────────────────────────────────────┐
│ Edit test file...                  │
│ Save → Auto-runs tests            │
│ Immediate feedback                 │
└────────────────────────────────────┘
```

## 🔍 Debugging Flow

```
Test Fails ❌
   │
   ├─► Read Error Message
   │     • What failed?
   │     • Expected vs Actual
   │
   ├─► Check API Client
   │     • Is endpoint URL correct?
   │     • Are parameters formatted correctly?
   │
   ├─► Check Environment
   │     • Are credentials valid?
   │     • Is API accessible?
   │
   ├─► Run Connection Test
   │     npm run test:connection
   │
   ├─► Run Single Test
   │     npm run test:specific -- subscribers.test.js
   │
   └─► Fix Issue → Re-run → Pass ✅
```

## 💡 Common Use Cases

### Use Case 1: Daily Development
```bash
npm run test:watch   # Keep running in background
# Edit code → Tests auto-run → Immediate feedback
```

### Use Case 2: Pre-Deployment Check
```bash
npm test            # Run all tests
npm run test:coverage  # Check coverage
# All pass → Deploy with confidence
```

### Use Case 3: Debugging API Issue
```bash
npm run test:connection      # Verify connection
npm run test:notifications   # Test specific endpoint
# Identify issue → Fix → Re-test
```

### Use Case 4: Adding New Feature
```bash
# 1. Add endpoint to src/api-client.js
# 2. Create test in tests/new-feature.test.js
# 3. npm run test:watch
# 4. Implement → Test → Iterate
```

## 📚 Documentation Navigation

```
Starting Out?
  ↓
GETTING_STARTED.md → Quick overview and next steps
  ↓
SETUP.md → Configure credentials and verify
  ↓
README.md → Complete documentation
  ↓
Coming from Postman?
  ↓
MIGRATION_GUIDE.md → Convert Postman tests
  ↓
Need Advanced Patterns?
  ↓
tests/advanced-patterns.test.js → Examples
```

---

## 🎯 Key Takeaways

1. **Simple Setup**: Just configure `.env` and run
2. **Comprehensive Coverage**: All major endpoints tested
3. **Fast Feedback**: Tests run in seconds
4. **CI/CD Ready**: GitHub Actions included
5. **Well Documented**: Multiple guides available
6. **Extensible**: Easy to add new tests
7. **Production Ready**: Used in real projects

**Start testing in 3 commands:**
```bash
cp .env.example .env        # Add credentials
npm run test:connection     # Verify setup
npm test                    # Run all tests
```
