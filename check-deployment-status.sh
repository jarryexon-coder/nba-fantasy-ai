#!/bin/bash

echo "🚀 NBA Fantasy App - Deployment Status Check"
echo "============================================"
echo "Date: $(date)"
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}📊 CURRENT STATUS${NC}"
echo "================"

# Check 1: Backend Status
echo -e "\n🔧 ${BLUE}1. BACKEND (~/nba-backend)${NC}"
echo "------------------"
if [ -d ~/nba-backend ]; then
  echo "✅ Backend directory exists"
  
  # Check Railway deployment
  echo -n "   Checking Railway backend..."
  if curl -s https://pleasing-determination-production.up.railway.app/health > /dev/null 2>&1; then
    echo -e " ${GREEN}✅ ONLINE${NC}"
    echo "   URL: https://pleasing-determination-production.up.railway.app"
  else
    echo -e " ${RED}❌ OFFLINE${NC}"
    echo "   Run: cd ~/nba-backend && railway up"
  fi
else
  echo -e "❌ Backend directory not found"
fi

# Check 2: Analytics Dashboard
echo -e "\n📈 ${BLUE}2. ANALYTICS DASHBOARD${NC}"
echo "----------------------"
if [ -d ~/analytics-dashboard ]; then
  echo "✅ Dashboard directory exists"
  
  # Check if built
  if [ -d ~/analytics-dashboard/dist ]; then
    echo "✅ Dashboard is built (dist folder exists)"
  else
    echo -e "${YELLOW}⚠️  Dashboard not built${NC}"
    echo "   Run: cd ~/analytics-dashboard && npm run build"
  fi
  
  # Check Railway deployment for dashboard
  echo -n "   Checking Railway dashboard deployment..."
  if which railway > /dev/null; then
    echo -e " ${GREEN}✅ Railway CLI installed${NC}"
  else
    echo -e " ${YELLOW}⚠️  Install Railway CLI${NC}"
    echo "   Run: npm install -g @railway/cli"
  fi
else
  echo -e "${RED}❌ Analytics dashboard not created${NC}"
  echo "   Run the analytics dashboard setup from earlier steps"
fi

# Check 3: Frontend Status
echo -e "\n📱 ${BLUE}3. FRONTEND (~/nba-fantasy-fresh)${NC}"
echo "-------------------------"
echo "Metro Error Status:"
if grep -q "ERR_PACKAGE_PATH_NOT_EXPORTED" /tmp/metro-error.log 2>/dev/null; then
  echo -e "${RED}❌ Metro build error detected${NC}"
  echo "   This needs to be fixed BEFORE production build"
else
  echo -e "${GREEN}✅ No metro errors detected${NC}"
fi

# Check package versions
echo -e "\n📦 Package Versions:"
cd ~/nba-fantasy-fresh
if [ -f package.json ]; then
  REACT_VERSION=$(node -p "require('./package.json').dependencies.react" 2>/dev/null || echo "Not found")
  RN_VERSION=$(node -p "require('./package.json').dependencies['react-native']" 2>/dev/null || echo "Not found")
  EXPO_VERSION=$(node -p "require('./package.json').dependencies.expo" 2>/dev/null || echo "Not found")
  
  echo "   React: $REACT_VERSION"
  echo "   React Native: $RN_VERSION"
  echo "   Expo: $EXPO_VERSION"
  
  # Check compatibility
  if [[ "$REACT_VERSION" == *"19"* ]]; then
    echo -e "   ${RED}❌ React 19 detected - will cause issues!${NC}"
  else
    echo -e "   ${GREEN}✅ React version OK${NC}"
  fi
fi

# Check 4: Environment Configuration
echo -e "\n⚙️  ${BLUE}4. ENVIRONMENT CONFIGURATION${NC}"
echo "----------------------------"
if [ -f ~/nba-fantasy-fresh/.env.production ]; then
  echo "✅ Production .env file exists"
  BACKEND_URL=$(grep "EXPO_PUBLIC_API_BASE_URL" ~/nba-fantasy-fresh/.env.production | cut -d '=' -f2)
  echo "   Backend URL: $BACKEND_URL"
else
  echo -e "${YELLOW}⚠️  No production .env file${NC}"
fi

# Check 5: Firebase Configuration
echo -e "\n🔥 ${BLUE}5. FIREBASE CONFIGURATION${NC}"
echo "--------------------------"
if [ -f ~/nba-fantasy-fresh/src/services/firebase-service.js ]; then
  echo "✅ Firebase service file exists"
  if grep -q "your-project-id" ~/nba-fantasy-fresh/src/services/firebase-service.js; then
    echo -e "   ${RED}❌ Firebase not configured (still has placeholder)${NC}"
  else
    echo -e "   ${GREEN}✅ Firebase appears configured${NC}"
  fi
else
  echo -e "${YELLOW}⚠️  Firebase service not created${NC}"
fi

# Check 6: RevenueCat Configuration
echo -e "\n💰 ${BLUE}6. REVENUECAT CONFIGURATION${NC}"
echo "------------------------------"
if [ -f ~/nba-fantasy-fresh/src/services/revenuecat-service.js ]; then
  echo "✅ RevenueCat service file exists"
  if grep -q "appl_eDwUHlFEtBYuVyjQVzJaNpYuDAR" ~/nba-fantasy-fresh/src/services/revenuecat-service.js; then
    echo -e "   ${YELLOW}⚠️  Using default RevenueCat keys${NC}"
  else
    echo -e "   ${GREEN}✅ RevenueCat appears configured${NC}"
  fi
else
  echo -e "${YELLOW}⚠️  RevenueCat service not created${NC}"
fi

# Check 7: Test Suite Status
echo -e "\n🧪 ${BLUE}7. TEST SUITE STATUS${NC}"
echo "------------------------"
if [ -f ~/nba-fantasy-fresh/test-runner.sh ]; then
  echo "✅ Test runner exists"
  cd ~/nba-fantasy-fresh
  if ./test-runner.sh 2>&1 | grep -q "ALL TESTS PASSED"; then
    echo -e "   ${GREEN}✅ All tests passing${NC}"
  else
    echo -e "   ${YELLOW}⚠️  Some tests may be failing${NC}"
  fi
else
  echo -e "${YELLOW}⚠️  Test runner not found${NC}"
fi

echo -e "\n${BLUE}📋 REMAINING TASKS${NC}"
echo "================"

echo -e "\n${RED}🚨 URGENT - FIX BEFORE PRODUCTION BUILD:${NC}"
echo "1. Metro build error (ERR_PACKAGE_PATH_NOT_EXPORTED)"
echo "2. React 19 incompatibility (downgrade to React 18)"
echo ""

echo -e "${YELLOW}🔧 HIGH PRIORITY:${NC}"
echo "3. Configure Firebase with real project credentials"
echo "4. Configure RevenueCat with production keys"
echo "5. Create production .env file with correct backend URL"
echo ""

echo -e "${GREEN}📅 MEDIUM PRIORITY:${NC}"
echo "6. Deploy analytics dashboard to Railway"
echo "7. Set up Firebase Analytics dashboard"
echo "8. Configure RevenueCat webhooks"
echo ""

echo -e "${BLUE}📈 ONCE ABOVE ARE COMPLETE:${NC}"
echo "9. Create production builds with Expo EAS"
echo "10. Submit to App Store and Google Play"
echo ""

# Fix suggestions
echo -e "${BLUE}🔧 QUICK FIXES${NC}"
echo "-------------"
echo "1. Fix Metro error:"
echo "   rm -rf ~/nba-fantasy-fresh/node_modules"
echo "   npm install --legacy-peer-deps"
echo ""
echo "2. Downgrade React:"
echo "   npm install react@18.2.0 react-native@0.72.10 --legacy-peer-deps"
echo ""
echo "3. Deploy analytics dashboard:"
echo "   cd ~/analytics-dashboard"
echo "   railway up"
echo ""

# Generate summary
echo -e "${BLUE}📊 DEPLOYMENT READINESS SCORE${NC}"
echo "----------------------------"

SCORE=0
TOTAL=10

[ -d ~/nba-backend ] && ((SCORE++))
curl -s https://pleasing-determination-production.up.railway.app/health > /dev/null && ((SCORE++))
[ -d ~/analytics-dashboard ] && ((SCORE++))
[ -f ~/nba-fantasy-fresh/.env.production ] && ((SCORE++))
[ -f ~/nba-fantasy-fresh/src/services/firebase-service.js ] && ((SCORE++))
[ -f ~/nba-fantasy-fresh/src/services/revenuecat-service.js ] && ((SCORE++))
[ -f ~/nba-fantasy-fresh/test-runner.sh ] && ((SCORE++))
! grep -q "19" <<< "$REACT_VERSION" && ((SCORE++))
[ -f ~/nba-fantasy-fresh/package.json ] && ((SCORE++))
[ -f ~/analytics-dashboard/package.json ] && ((SCORE++))

PERCENTAGE=$((SCORE * 10))
echo "Completion: $SCORE/$TOTAL ($PERCENTAGE%)"

if [ $PERCENTAGE -ge 80 ]; then
  echo -e "${GREEN}🎉 Ready for production build!${NC}"
elif [ $PERCENTAGE -ge 60 ]; then
  echo -e "${YELLOW}⚠️  Close to ready - fix urgent issues first${NC}"
else
  echo -e "${RED}❌ Need significant work before production${NC}"
fi

echo -e "\n${BLUE}🚀 NEXT STEP RECOMMENDATION:${NC}"
if [[ "$REACT_VERSION" == *"19"* ]] || [ -z "$REACT_VERSION" ]; then
  echo "Fix React version and Metro error first"
elif [ ! -f ~/nba-fantasy-fresh/.env.production ]; then
  echo "Create production .env file"
elif ! curl -s https://pleasing-determination-production.up.railway.app/health > /dev/null; then
  echo "Ensure backend is deployed and healthy"
else
  echo "You're ready to create a production build!"
fi

echo -e "\n${GREEN}✅ Run this command for detailed metro error fix:${NC}"
echo "cd ~/nba-fantasy-fresh && ./fix-metro-error.sh"
