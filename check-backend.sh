#!/bin/bash
# Check if Railway backend is healthy

BACKEND_URL="https://modellab-api-production.up.railway.app"

echo "🔍 Checking backend health at $BACKEND_URL/api/health..."
echo ""

response=$(curl -s -w "\n%{http_code}" "$BACKEND_URL/api/health")
http_code=$(echo "$response" | tail -n 1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" = "200" ]; then
  echo "✅ Backend is healthy!"
  echo ""
  echo "Response:"
  echo "$body" | jq . 2>/dev/null || echo "$body"
  echo ""
  echo "🎉 Ready to deploy frontend!"
  exit 0
else
  echo "❌ Backend healthcheck failed (HTTP $http_code)"
  echo ""
  echo "Response:"
  echo "$body"
  echo ""
  echo "💡 Make sure PostgreSQL database is added in Railway"
  exit 1
fi
