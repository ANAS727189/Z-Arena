#!/bin/bash

# Z-Challenger Appwrite Functions Deployment Script

echo "🚀 Z-Challenger Appwrite Functions Deployment"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if appwrite CLI is installed
if ! command -v appwrite &> /dev/null; then
    print_error "Appwrite CLI is not installed"
    echo "Install it with: npm install -g appwrite-cli"
    exit 1
fi

print_status "Appwrite CLI is installed"

# Check if we're in the right directory
if [ ! -f "appwrite.json" ]; then
    print_error "appwrite.json not found. Make sure you're in the appwrite-functions directory"
    exit 1
fi

print_status "Found appwrite.json configuration"

# Since you've already run appwrite init project and are logged in, let's proceed
print_status "Using existing appwrite.json configuration"

# Check if API key is set
if grep -q '"APPWRITE_FUNCTION_API_KEY": ""' appwrite.json; then
    print_error "API key not set in appwrite.json"
    echo ""
    echo "Please:"
    echo "1. Go to Appwrite Console → Settings → API Keys"
    echo "2. Create a new API key with database and functions permissions"  
    echo "3. Update the APPWRITE_FUNCTION_API_KEY in appwrite.json"
    exit 1
fi

print_status "API key is configured"

# Install dependencies for each function
print_info "Installing dependencies for functions..."

for func_dir in challenge-seeder submission-processor leaderboard-updater; do
    if [ -d "$func_dir" ]; then
        print_info "Installing dependencies for $func_dir..."
        cd "$func_dir"
        npm install --production
        cd ..
        print_status "Dependencies installed for $func_dir"
    fi
done

# Deploy functions
print_info "Deploying functions to Appwrite..."

# Deploy all functions using the new CLI command
if appwrite push functions; then
    print_status "All functions deployed successfully!"
    
    echo ""
    echo "🎉 Deployment Complete!"
    echo "====================="
    echo ""
    echo "Next steps:"
    echo "1. Check Appwrite Console → Functions to verify deployment"
    echo "2. Test functions with: appwrite functions createExecution --functionId FUNCTION_ID"
    echo "3. Monitor function logs for any issues"
    echo ""
    echo "Functions deployed:"
    echo "• challenge-seeder (Weekly schedule)"
    echo "• submission-processor (Database events)"  
    echo "• leaderboard-updater (Every 15 minutes)"
    
else
    print_error "Deployment failed"
    echo ""
    echo "Common issues:"
    echo "• Check API key permissions"
    echo "• Verify project ID is correct"
    echo "• Ensure all collections exist in database"
    exit 1
fi