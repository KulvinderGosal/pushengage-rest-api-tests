# Quick Start Guide

## 1. Get Your PushEngage Credentials

### Finding Your API Key:
1. Log in to your PushEngage dashboard
2. Navigate to **Settings** → **API**
3. Copy your API Key

### Finding Your Site ID:
1. In PushEngage dashboard, go to **Settings** → **Site Details**
2. Your Site ID is typically shown in the URL or Site Settings
3. Alternatively, check **Settings** → **API** section

## 2. Set Up Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Then edit `.env` and replace with your actual credentials:

```env
PUSHENGAGE_API_KEY=pe_live_abc123def456...
PUSHENGAGE_SITE_ID=12345
PUSHENGAGE_BASE_URL=https://api.pushengage.com/apiv1
```

## 3. Run Your First Test

```bash
# Run all tests
npm test

# Or run a specific test suite
npm run test:specific -- subscribers.test.js
```

## 4. Verify Setup

If everything is configured correctly, you should see test results like:

```
✓ tests/subscribers.test.js (5 tests)
✓ tests/notifications.test.js (8 tests)
✓ tests/campaigns.test.js (7 tests)
...
```

## Common Issues

### "Missing environment variables" warning
- Ensure `.env` file exists in project root
- Check that variable names match exactly
- Verify no extra spaces in `.env` file

### Authentication errors (401/403)
- Verify API key is correct and active
- Check that Site ID matches your account
- Ensure API key has proper permissions in PushEngage dashboard

### Network errors
- Check your internet connection
- Verify PushEngage API is accessible from your network
- Try accessing `https://api.pushengage.com` in your browser

## Next Steps

1. **Customize Tests**: Modify test files in `tests/` folder for your specific use cases
2. **Add CI/CD**: Use the provided GitHub Actions workflow for automated testing
3. **Monitor Coverage**: Run `npm run test:coverage` to see test coverage
4. **Create Custom Workflows**: Build on the API client in `src/api-client.js`

## Need Help?

- PushEngage API Docs: https://www.pushengage.com/api/rest-api/getting-started
- Check the main README.md for detailed documentation
- Review test files for usage examples
