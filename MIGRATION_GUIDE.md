# Migrating from Postman to Automated Testing

This guide helps you transition from manual Postman testing to automated tests with this framework.

## Why Automate?

### Problems with Manual Postman Testing:
- ❌ Time-consuming to run tests manually
- ❌ Easy to forget to test certain endpoints
- ❌ No historical test results
- ❌ Difficult to test complex workflows
- ❌ Can't integrate with CI/CD pipelines
- ❌ Hard to share and collaborate on tests

### Benefits of Automated Testing:
- ✅ Run all tests in seconds
- ✅ Consistent test coverage
- ✅ Automatic regression testing
- ✅ Easy to integrate with CI/CD
- ✅ Version-controlled test cases
- ✅ Clear test documentation

## Migration Steps

### Step 1: Export Your Postman Collection

1. Open Postman
2. Right-click on your PushEngage collection
3. Export as Collection v2.1
4. Save the JSON file for reference

### Step 2: Identify Your Test Scenarios

Look through your Postman requests and identify:
- What endpoints are you testing?
- What are the expected responses?
- What validations are you performing?
- What are the test data requirements?

### Step 3: Map Postman Tests to Vitest

#### Example: Postman Test

```javascript
// Postman Test
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has subscribers array", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('data');
    pm.expect(jsonData.data).to.be.an('array');
});
```

#### Equivalent Vitest Test

```javascript
// Vitest Test
it('should retrieve list of subscribers', async () => {
  const response = await apiClient.getSubscribers({ limit: 10 });
  
  expect(response).toBeDefined();
  expect(response).toHaveProperty('data');
  expect(Array.isArray(response.data)).toBe(true);
});
```

### Step 4: Convert Common Postman Patterns

#### Authentication
**Postman:**
```javascript
pm.request.headers.add({
    key: 'Authorization',
    value: 'Bearer {{api_key}}'
});
```

**Vitest (Already handled in API Client):**
```javascript
const apiClient = new PushEngageAPIClient();
// Authentication is automatic via .env configuration
```

#### Environment Variables
**Postman:**
```javascript
pm.environment.get("api_key")
pm.environment.get("site_id")
```

**Vitest:**
```javascript
process.env.PUSHENGAGE_API_KEY
process.env.PUSHENGAGE_SITE_ID
```

#### Response Validation
**Postman:**
```javascript
pm.test("Check notification ID exists", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data.id).to.exist;
});
```

**Vitest:**
```javascript
it('should return notification with ID', async () => {
  const response = await apiClient.sendNotification(notificationData);
  expect(response.data).toHaveProperty('id');
});
```

### Step 5: Common Test Patterns

#### Testing List Endpoints

**Postman Collection:**
```
GET /subscribers
Tests:
- Status is 200
- Response is array
- Array has items
```

**Automated Test:**
```javascript
describe('GET /subscribers', () => {
  it('should retrieve list of subscribers', async () => {
    const response = await apiClient.getSubscribers({ limit: 10 });
    
    expect(response).toBeDefined();
    expect(response).toHaveProperty('data');
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data.length).toBeGreaterThan(0);
  });
});
```

#### Testing Create Endpoints

**Postman Collection:**
```
POST /notifications
Body: { title: "Test", message: "Test message", url: "https://example.com" }
Tests:
- Status is 201
- Response has ID
- Title matches input
```

**Automated Test:**
```javascript
describe('POST /notifications', () => {
  it('should create a notification', async () => {
    const notification = {
      title: 'Test',
      message: 'Test message',
      url: 'https://example.com'
    };
    
    const response = await apiClient.sendNotification(notification);
    
    expect(response.data).toHaveProperty('id');
    expect(response.data).toHaveProperty('title', notification.title);
  });
});
```

#### Testing Update Endpoints

**Postman Collection:**
```
PUT /campaigns/{{campaign_id}}
Body: { status: "active" }
Tests:
- Status is 200
- Status field updated
```

**Automated Test:**
```javascript
describe('PUT /campaigns/:id', () => {
  it('should update campaign status', async () => {
    const campaignId = 'test-campaign-id';
    const updateData = { status: 'active' };
    
    const response = await apiClient.updateCampaign(campaignId, updateData);
    
    expect(response.data).toHaveProperty('id', campaignId);
    expect(response.data).toHaveProperty('status', 'active');
  });
});
```

#### Testing Error Cases

**Postman Collection:**
```
POST /subscribers
Body: { /* missing required fields */ }
Tests:
- Status is 400
- Error message exists
```

**Automated Test:**
```javascript
describe('POST /subscribers - Error Cases', () => {
  it('should reject invalid subscriber data', async () => {
    const invalidData = { device: 'desktop' }; // missing required fields
    
    await expect(
      apiClient.addSubscriber(invalidData)
    ).rejects.toThrow();
  });
});
```

### Step 6: Workflow Testing

One of the biggest advantages over Postman is testing complete workflows:

```javascript
describe('Complete Campaign Workflow', () => {
  it('should create, activate, and delete a campaign', async () => {
    // Step 1: Create
    const createResponse = await apiClient.createCampaign({
      name: 'Test Campaign',
      type: 'drip',
      status: 'draft'
    });
    const campaignId = createResponse.data.id;
    expect(campaignId).toBeDefined();
    
    // Step 2: Activate
    const updateResponse = await apiClient.updateCampaign(campaignId, {
      status: 'active'
    });
    expect(updateResponse.data.status).toBe('active');
    
    // Step 3: Verify
    const getResponse = await apiClient.getCampaignById(campaignId);
    expect(getResponse.data.status).toBe('active');
    
    // Step 4: Cleanup
    const deleteResponse = await apiClient.deleteCampaign(campaignId);
    expect(deleteResponse.success).toBe(true);
  });
});
```

## Practical Example: Converting a Full Postman Collection

Let's say you have a Postman collection with these requests:

1. **Get Subscribers** (GET /subscribers)
2. **Add Subscriber** (POST /subscribers)
3. **Send Notification** (POST /notifications)
4. **Get Notification Stats** (GET /stats)

### Postman Approach:
1. Manually click "Get Subscribers"
2. Wait for response
3. Manually click "Add Subscriber"
4. Copy subscriber ID from response
5. Manually paste ID somewhere
6. Click "Send Notification"
7. Copy notification ID
8. Click "Get Notification Stats"
9. Verify results manually

**Time: 5-10 minutes per test run**

### Automated Approach:

```javascript
describe('Complete User Journey', () => {
  it('should handle subscriber addition and notification', async () => {
    // 1. Get existing subscribers
    const initialSubscribers = await apiClient.getSubscribers();
    const initialCount = initialSubscribers.data.length;
    
    // 2. Add new subscriber
    const newSubscriber = {
      subscription_token: `test_${Date.now()}`,
      device: 'desktop',
      browser: 'chrome'
    };
    const addResponse = await apiClient.addSubscriber(newSubscriber);
    expect(addResponse.data).toHaveProperty('id');
    
    // 3. Verify subscriber count increased
    const updatedSubscribers = await apiClient.getSubscribers();
    expect(updatedSubscribers.data.length).toBe(initialCount + 1);
    
    // 4. Send notification
    const notification = {
      title: 'Welcome!',
      message: 'Thanks for subscribing',
      url: 'https://example.com'
    };
    const notifResponse = await apiClient.sendNotification(notification);
    expect(notifResponse.data).toHaveProperty('id');
    
    // 5. Get stats
    const stats = await apiClient.getSiteStats();
    expect(stats.data.subscribers).toBeGreaterThan(0);
  });
});
```

**Run command:** `npm test`  
**Time: 2-5 seconds per test run**

## Tips for Successful Migration

1. **Start Small**: Begin with your most critical API endpoints
2. **Group Related Tests**: Use `describe` blocks to organize tests
3. **Use Setup/Teardown**: Clean up test data in `afterEach` hooks
4. **Mock External Dependencies**: Focus on testing your API integration
5. **Run Tests Frequently**: Use watch mode during development
6. **Document Test Cases**: Add clear descriptions to each test

## Running Your Migrated Tests

```bash
# Run all tests
npm test

# Run specific test file
npm run test:subscribers

# Watch mode for active development
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Next Steps

1. ✅ Create your `.env` file with credentials
2. ✅ Run `npm run test:connection` to verify setup
3. ✅ Convert your most critical Postman tests first
4. ✅ Run tests and iterate on failures
5. ✅ Add more test coverage over time
6. ✅ Set up CI/CD with GitHub Actions

## Need Help?

Check the example tests in the `tests/` folder for reference implementations of common patterns.
