# Appwrite Functions for Z-Challenger

This directory contains server-side functions that run within the Appwrite ecosystem to handle business logic, database operations, and background tasks.

## 🏗️ Architecture Philosophy

### **Appwrite Functions** 🚀
- **Database Operations**: Direct access to Appwrite databases
- **Background Tasks**: Scheduled operations and event-driven processes
- **Business Logic**: User statistics, achievements, rankings
- **Event-Driven**: Triggered by database changes or schedules

### **Express Server** ⚡
- **Code Execution**: Real-time compilation and testing
- **External APIs**: Judge0, third-party integrations
- **Performance Critical**: Low-latency operations
- **Real-time Features**: WebSocket connections, live collaboration

## 📊 Functions Overview

### 1. **Challenge Seeder** 🌱
- **Trigger**: Weekly schedule (Sundays at midnight)
- **Purpose**: Automatically seed new challenges from `/challenges` directory
- **Operations**:
  - Read challenge JSON files
  - Validate against schema
  - Insert into Appwrite database
  - Update challenge statistics

### 2. **Submission Processor** 📝
- **Trigger**: Database event (new submission created)
- **Purpose**: Process submission results and update user statistics
- **Operations**:
  - Calculate user points and rankings
  - Update solving streaks
  - Check for achievements
  - Generate notifications

### 3. **Leaderboard Updater** 🏆
- **Trigger**: Every 15 minutes
- **Purpose**: Maintain real-time leaderboards and rankings
- **Operations**:
  - Calculate global/weekly/monthly rankings
  - Update user ranking positions
  - Cache leaderboard data
  - Archive historical rankings

### 4. **Achievement Processor** 🎯
- **Trigger**: User statistics changes
- **Purpose**: Award achievements and badges
- **Operations**:
  - Monitor achievement criteria
  - Award badges and titles
  - Send achievement notifications
  - Update user profiles

### 5. **Analytics Aggregator** 📈
- **Trigger**: Daily schedule
- **Purpose**: Generate usage statistics and insights
- **Operations**:
  - User activity analytics
  - Challenge popularity metrics
  - Performance statistics
  - Growth metrics

## 🔧 Development Workflow

### Setup
```bash
# Install Appwrite CLI
npm install -g appwrite-cli

# Login to Appwrite
appwrite login

# Deploy functions
appwrite deploy function
```

### Local Development
```bash
# Run function locally
appwrite run function challenge-seeder

# Test with mock events
appwrite test function submission-processor --data '{"userId":"123","challengeId":"hello-world"}'
```

### Environment Variables
Each function requires:
- `APPWRITE_FUNCTION_ENDPOINT`
- `APPWRITE_FUNCTION_API_KEY`
- `APPWRITE_FUNCTION_PROJECT_ID`

## 📋 Database Collections Access

Functions have direct access to:
- `users` - User profiles and statistics
- `submissions` - Code submission records
- `user_achievements` - Achievement tracking
- `user_rankings` - Historical ranking data
- `leaderboard` - Cached leaderboard data
- `stars` - Star level definitions

## 🚀 Benefits of This Architecture

1. **Separation of Concerns**: Business logic vs execution engine
2. **Scalability**: Appwrite auto-scales functions based on load
3. **Event-Driven**: Automatic triggers for database changes
4. **Security**: Functions run with elevated permissions
5. **Monitoring**: Built-in logging and error tracking
6. **Cost Effective**: Pay per execution model

## 📊 Performance Considerations

- **Function Timeout**: Set appropriate timeouts (60s-300s)
- **Memory Limits**: Monitor memory usage for large operations
- **Batch Operations**: Process multiple records efficiently
- **Caching**: Use leaderboard collection for cached data
- **Error Handling**: Implement robust error recovery

## 🔒 Security Best Practices

- Use API keys with minimal required permissions
- Validate all input data
- Implement rate limiting where needed
- Log security-relevant events
- Handle sensitive data appropriately
