# PushEngage REST API Testing Framework

Automated testing framework for PushEngage REST APIs - replacing manual Postman testing with a comprehensive, maintainable test suite.

[![Tests](https://img.shields.io/badge/tests-passing-brightgreen.svg)](https://github.com/KulvinderGosal/pushengage-rest-api-tests)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 🚀 Features

- ✅ **Complete API Coverage** - Tests for Notifications, Subscribers, Campaigns, Segments, and Stats
- ✅ **Automated Testing** - Run 50+ tests in seconds instead of manual Postman testing
- ✅ **Live Examples** - Create real push notifications via REST API
- ✅ **CI/CD Ready** - GitHub Actions workflow included
- ✅ **Well Documented** - 7 comprehensive guides
- ✅ **Easy to Use** - Simple setup and intuitive API client

## 📊 Quick Stats

- **22 Files** - Complete testing framework
- **~1,500 Lines** of production-ready code
- **50+ Test Cases** covering all major endpoints
- **7 Documentation Guides** for easy onboarding

## ⚡ Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/KulvinderGosal/pushengage-rest-api-tests.git
cd pushengage-rest-api-tests
npm install
```

### 2. Configure Credentials

```bash
cp .env.example .env
# Edit .env and add your PushEngage API credentials
```

```env
PUSHENGAGE_API_KEY=your_api_key_here
PUSHENGAGE_SITE_ID=your_site_id_here
```

### 3. Verify Connection

```bash
npm run test:connection
```

### 4. Run Tests

```bash
npm test
```

## 📖 Documentation

- **[SUCCESS_SUMMARY.md](SUCCESS_SUMMARY.md)** - What's working and how to use it
- **[GETTING_STARTED.md](GETTING_STARTED.md)** - Complete quick start guide
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Commands and API reference
- **[MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)** - Migrate from Postman
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Complete project overview

## 💡 Usage Examples

### Create a Push Notification

```javascript
import { PushEngageAPIClient } from './src/api-client.js';

const client = new PushEngageAPIClient();

// Send notification
const result = await client.sendNotification({
  title: 'Hello World!',
  message: 'Test notification',
  url: 'https://example.com',
  notification_type: 'draft' // or 'now' to send immediately
});

console.log('Created:', result.notification_id);
```

### Run Quick Examples

```bash
# Create draft notifications (safe)
node create-push-notification.js

# Send live notifications
node send-live-notification.js

# Test API connection
node test-connection.js
```

## 🧪 Available Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests |
| `npm run test:watch` | Watch mode for development |
| `npm run test:coverage` | Generate coverage report |
| `npm run test:connection` | Verify API connection |
| `npm run test:notifications` | Test notification endpoints |
| `npm run test:campaigns` | Test campaign endpoints |
| `npm run test:integration` | Test end-to-end workflows |

## 📁 Project Structure

```
pushengage-rest-api-tests/
├── src/
│   └── api-client.js          # Reusable API client
├── tests/
│   ├── notifications.test.js  # Notification tests
│   ├── campaigns.test.js      # Campaign tests
│   ├── subscribers.test.js    # Subscriber tests
│   ├── segments.test.js       # Segment tests
│   ├── stats.test.js         # Analytics tests
│   └── integration.test.js    # E2E workflows
├── create-push-notification.js # Create draft notifications
├── send-live-notification.js   # Send live notifications
├── test-connection.js          # Verify API connection
└── .github/workflows/          # CI/CD configuration
```

## 🎯 What's Tested

### ✅ Notifications API
- Create notifications (draft, scheduled, live)
- Notifications with images
- Notifications with action buttons
- List sent/scheduled/draft notifications

### ✅ Subscribers API
- CRUD operations
- Pagination and filtering
- Attribute management

### ✅ Campaigns API
- Campaign lifecycle management
- Multi-step drip campaigns
- Filtering and search

### ✅ Segments API
- List and filter segments
- Segment operations

### ✅ Analytics & Stats
- Site statistics
- Date range filtering
- Attribute management

## 🚀 CI/CD Integration

GitHub Actions workflow included for automated testing:

```yaml
# .github/workflows/api-tests.yml
name: API Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm test
```

## 🔧 Configuration

### Environment Variables

```env
PUSHENGAGE_API_KEY=your_api_key
PUSHENGAGE_SITE_ID=your_site_id
PUSHENGAGE_BASE_URL=https://api.pushengage.com/apiv1
TEST_TIMEOUT=30000
TEST_RETRY_COUNT=2
```

### Test Configuration

Edit `vitest.config.js` to customize test behavior:

```javascript
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    testTimeout: 30000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
});
```

## 📊 Benefits Over Manual Testing

| Aspect | Manual Postman | This Framework |
|--------|---------------|----------------|
| **Time per run** | 5-10 minutes | 2-5 seconds |
| **Consistency** | Manual, error-prone | Automated, reliable |
| **CI/CD** | Not possible | ✅ Built-in |
| **Workflow Testing** | Difficult | ✅ Easy |
| **Team Collaboration** | Share collections | ✅ Version control |
| **Test History** | None | ✅ Full history |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `/docs` folder for detailed guides
- **Issues**: Open an issue on GitHub
- **PushEngage API Docs**: https://www.pushengage.com/api/rest-api/getting-started

## 👤 Author

**Kulvinder Singh Gosal**
- GitHub: [@KulvinderGosal](https://github.com/KulvinderGosal)
- Company: Awesomemotive Inc

## 🙏 Acknowledgments

- [PushEngage](https://www.pushengage.com) for the API
- [Vitest](https://vitest.dev) for the test framework
- [Axios](https://axios-http.com) for HTTP client

---

**⭐ Star this repo if you find it helpful!**

Built with ❤️ for automated API testing
