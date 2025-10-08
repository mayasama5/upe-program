# Instructions for Vercel Deployment Protection

## The backend is currently protected by Vercel Authentication

### To fix this, you need to:

1. Go to https://vercel.com/dashboard
2. Select your backend project (`upe`)
3. Go to Settings > Deployment Protection
4. Disable "Enable Deployment Protection"

### Alternative: Use bypass protection

Add this to your vercel.json:

```json
{
  "functions": {
    "src/app.js": {
      "maxDuration": 10
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type, Authorization"
        }
      ]
    }
  ]
}
```

### For production APIs, you should:
- Make the API publicly accessible (remove deployment protection)
- Use proper authentication within your app
- Not rely on Vercel's deployment protection for API security
