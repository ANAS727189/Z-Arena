# 🚀 Appwrite Functions Deployment Guide

## 📋 Prerequisites

### 1. Install Appwrite CLI
```bash
# Install globally via npm
npm install -g appwrite-cli

# Or install via curl (Linux/macOS)
curl -sL https://appwrite.io/cli/install.sh | bash

# Verify installation
appwrite --version
```

### 2. Login to Appwrite
```bash
# Login to your Appwrite instance
appwrite login

# Follow the prompts:
# - Enter your Appwrite endpoint: https://nyc.cloud.appwrite.io/v1
# - Enter your email and password
```

## 🔑 Setup API Key

### 1. Create API Key in Appwrite Console
1. Go to [Appwrite Console](https://nyc.cloud.appwrite.io/console)
2. Select your project: **Z-Challenge Client**
3. Navigate to **Settings** → **API Keys**
4. Click **Create API Key**
5. Configure permissions:
   ```
   Name: Functions API Key
   Scopes:
   ✅ databases.read
   ✅ databases.write
   ✅ functions.read
   ✅ functions.write
   ✅ functions.execute
   ```
6. **Copy the API key** - you'll need it next!

### 2. Update Function Configuration
Update the API key in `/appwrite-functions/appwrite.json`:

```json
{
  "vars": {
    "APPWRITE_FUNCTION_API_KEY": "YOUR_API_KEY_HERE"
  }
}
```

## 📁 Project Structure Check

Ensure your directory structure looks like this:
```
/mnt/MasterDrive/Z-Studio-appwrite/Z-challenger/
├── appwrite-functions/
│   ├── appwrite.json ✅
│   ├── challenge-seeder/
│   │   ├── package.json ✅
│   │   └── src/main.js ✅
│   ├── submission-processor/
│   │   ├── package.json ✅
│   │   └── src/main.js ✅
│   └── leaderboard-updater/
│       ├── package.json ✅
│       └── src/main.js ✅
├── challenges/ ✅ (43+ JSON files)
└── client/.env ✅ (with project IDs)
```

## 🚀 Deployment Steps

### Step 1: Navigate to Functions Directory
```bash
cd /mnt/MasterDrive/Z-Studio-appwrite/Z-challenger/appwrite-functions
```

### Step 2: Initialize Appwrite Project
```bash
# Initialize project (if not already done)
appwrite projects list

# Set current project
appwrite projects use 68debdc70018c2c2a3f3
```

### Step 3: Deploy Functions

#### Option A: Deploy All Functions at Once
```bash
# Deploy all functions from appwrite.json
appwrite deploy

# This will:
# - Create functions if they don't exist
# - Deploy code for each function
# - Set up schedules and event triggers
# - Configure environment variables
```

#### Option B: Deploy Individual Functions
```bash
# Deploy challenge seeder
appwrite deploy function challenge-seeder

# Deploy submission processor  
appwrite deploy function submission-processor

# Deploy leaderboard updater
appwrite deploy function leaderboard-updater
```

### Step 4: Configure Challenge Files Mount

For the challenge-seeder function to access your JSON files, you need to:

1. **Upload challenges to Appwrite Storage:**
```bash
# Create challenges bucket in Appwrite Console
# Or via CLI:
appwrite storage createBucket \
  --bucketId challenges \
  --name "Challenge Files" \
  --permissions read("any")

# Upload challenge files
cd ../challenges
for file in *.json; do
  appwrite storage createFile \
    --bucketId challenges \
    --fileId unique() \
    --file "$file"
done
```

2. **Update challenge-seeder to read from storage** (Alternative approach)

### Step 5: Set Up Database Collections

Ensure all required collections exist:
```bash
# Check existing collections
appwrite databases listCollections --databaseId 68debe350002d7856a53

# Create missing collections if needed
appwrite databases createCollection \
  --databaseId 68debe350002d7856a53 \
  --collectionId user_rankings \
  --name "User Rankings"
```

## 🔧 Testing Deployment

### 1. Test Functions Individually
```bash
# Test challenge seeder
appwrite functions createExecution \
  --functionId challenge-seeder

# Test submission processor (requires submission data)
appwrite functions createExecution \
  --functionId submission-processor \
  --data '{"submissionId":"test123"}'

# Test leaderboard updater
appwrite functions createExecution \
  --functionId leaderboard-updater
```

### 2. View Function Logs
```bash
# View execution logs
appwrite functions listExecutions --functionId challenge-seeder

# Get specific execution details
appwrite functions getExecution \
  --functionId challenge-seeder \
  --executionId EXECUTION_ID
```

### 3. Monitor Function Status
```bash
# List all functions
appwrite functions list

# Get function details
appwrite functions get --functionId challenge-seeder
```

## 📊 Verify Deployment

### 1. Check Appwrite Console
1. Go to **Functions** tab in your project
2. Verify all 3 functions are listed:
   - ✅ challenge-seeder (Schedule: Weekly)
   - ✅ submission-processor (Trigger: Database events)
   - ✅ leaderboard-updater (Schedule: Every 15 minutes)

### 2. Test Database Events
1. Create a test submission in your app
2. Check if submission-processor executes automatically
3. Verify user stats are updated

### 3. Check Scheduled Functions
1. Wait for next scheduled run
2. Or manually trigger: `appwrite functions createExecution --functionId leaderboard-updater`
3. Verify leaderboard data is updated

## 🐛 Troubleshooting

### Common Issues:

#### 1. API Key Permissions
```bash
# Error: "Missing scope: databases.write"
# Solution: Update API key permissions in Appwrite Console
```

#### 2. Database ID Mismatch
```bash
# Error: "Database not found"
# Solution: Verify DATABASE_ID in function code matches your actual database ID
```

#### 3. Collection Not Found
```bash
# Error: "Collection 'users' not found"
# Solution: Create missing collections in Appwrite Console
```

#### 4. Function Timeout
```bash
# Error: "Function execution timed out"
# Solution: Increase timeout in appwrite.json or optimize function code
```

### Debug Commands:
```bash
# View function logs
appwrite functions listExecutions --functionId FUNCTION_ID

# Get detailed execution info
appwrite functions getExecution --functionId FUNCTION_ID --executionId EXECUTION_ID

# Update function configuration
appwrite functions update --functionId FUNCTION_ID --timeout 300
```

## 🔄 Update Functions

### After Code Changes:
```bash
# Redeploy specific function
appwrite deploy function challenge-seeder

# Or redeploy all functions
appwrite deploy
```

### Update Environment Variables:
```bash
# Update via CLI
appwrite functions updateVariable \
  --functionId challenge-seeder \
  --key APPWRITE_FUNCTION_API_KEY \
  --value NEW_API_KEY
```
