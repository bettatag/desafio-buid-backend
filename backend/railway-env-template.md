# 🚀 Railway Environment Variables Template

## 📋 Variables to Configure in Railway Dashboard

Copy and configure these environment variables in your Railway project:

### 🔐 **Database (Automatically provided by Railway PostgreSQL)**
```bash
DATABASE_URL=postgresql://postgres:password@containers-us-west-1.railway.app:5432/railway
```

### 🔑 **JWT Configuration (CRITICAL - Change in production!)**
```bash
JWT_SECRET=your-super-secure-jwt-secret-key-at-least-32-characters-long-for-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
JWT_ISSUER=evolution-api-prod
JWT_AUDIENCE=whatsapp-bot-prod
```

### ⚙️ **Server Configuration**
```bash
NODE_ENV=production
PORT=3000
```

### 🚦 **Rate Limiting**
```bash
RATE_LIMIT_TTL=60000
RATE_LIMIT_LIMIT=100
```

### 🌐 **CORS (Add your frontend domains)**
```bash
CORS_ORIGIN=https://your-frontend-domain.com,https://www.your-frontend-domain.com
```

### 📡 **Evolution API**
```bash
EVOLUTION_API_URL=https://api.evolution-api.com/v2
EVOLUTION_API_KEY=your-production-evolution-api-key
```

### 🤖 **OpenAI**
```bash
OPENAI_API_KEY=sk-proj-your-production-openai-api-key
OPENAI_DEFAULT_MODEL=gpt-4-turbo
```

### 🔗 **Webhook Configuration**
```bash
WEBHOOK_BASE_URL=https://your-api-domain.railway.app
WEBHOOK_SECRET=your-production-webhook-secret-key
```

### 📝 **Logging**
```bash
LOG_LEVEL=info
```

### 🔒 **Security (Optional)**
```bash
BCRYPT_ROUNDS=12
SESSION_SECRET=your-session-secret-for-cookies
```

## 🎯 **How to Set Up in Railway**

1. Go to your Railway project dashboard
2. Click on your service
3. Go to "Variables" tab
4. Add each variable above with your production values
5. Deploy your service

## ⚠️ **IMPORTANT SECURITY NOTES**

- **JWT_SECRET**: Must be at least 32 characters, random and unique
- **WEBHOOK_SECRET**: Use a strong random string
- **DATABASE_URL**: Will be automatically provided by Railway PostgreSQL
- **API Keys**: Use your actual production API keys
- **CORS_ORIGIN**: Only include your actual frontend domains

## 🔄 **Auto-Deployment**

Once configured, Railway will automatically:
1. Build your Docker image
2. Run database migrations
3. Start your application
4. Provide HTTPS endpoints
