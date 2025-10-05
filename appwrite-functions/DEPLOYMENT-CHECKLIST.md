# 🚀 Quick Deployment Checklist

## Before Running Deployment

### 1. ✅ Install Appwrite CLI (Done)
```bash
npm install -g appwrite-cli
```

### 2. 🔑 Login to Appwrite
```bash
appwrite login
```
- **Endpoint**: `https://nyc.cloud.appwrite.io/v1`
- Use your Appwrite account credentials

### 3. 🔐 Create API Key
1. Go to [Appwrite Console](https://nyc.cloud.appwrite.io/console)
2. Select project: **Z-Challenge Client** (`68debdc70018c2c2a3f3`)
3. Go to **Settings** → **API Keys**
4. Click **Create API Key**
5. Set permissions:
   - ✅ `databases.read`
   - ✅ `databases.write` 
   - ✅ `functions.read`
   - ✅ `functions.write`
   - ✅ `functions.execute`
6. **Copy the API key**

### 4. 📝 Update Configuration
Edit `/appwrite-functions/appwrite.json` and replace `""` with your API key:
```json
"APPWRITE_FUNCTION_API_KEY": "YOUR_API_KEY_HERE"
```

### 5. 🏃‍♂️ Run Deployment
```bash
cd /mnt/MasterDrive/Z-Studio-appwrite/Z-challenger/appwrite-functions
./deploy.sh
```

## 🎯 What Gets Deployed

1. **challenge-seeder** 🌱
   - Runs weekly (Sundays at midnight)
   - Seeds challenges from JSON files
   
2. **submission-processor** 📝
   - Triggered on new submissions
   - Updates user stats and achievements
   
3. **leaderboard-updater** 🏆
   - Runs every 15 minutes
   - Updates rankings and leaderboards

## 🔍 Verification Steps

1. **Check Console**: Go to Functions tab in Appwrite Console
2. **Test Function**: `appwrite functions createExecution --functionId challenge-seeder`  
3. **View Logs**: `appwrite functions listExecutions --functionId challenge-seeder`

## 🐛 If Something Goes Wrong

1. **Check API Key**: Ensure it has all required permissions
2. **Verify Project ID**: Should be `68debdc70018c2c2a3f3`
3. **Database ID**: Should be `68debe350002d7856a53`
4. **Collections**: Ensure all collections exist in your database

## 📞 Need Help?

Run this to see deployment details:
```bash
cat /mnt/MasterDrive/Z-Studio-appwrite/Z-challenger/docs/appwrite-functions-deployment.md
```