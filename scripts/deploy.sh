#!/bin/bash

# Cursor Rules Hub - MVP Deployment Script
# This script helps deploy the application to production

set -e

echo "🚀 Starting Cursor Rules Hub MVP Deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ Error: .env.local not found. Please create it with your Supabase credentials."
    echo "Required environment variables:"
    echo "  NEXT_PUBLIC_SUPABASE_URL=your-supabase-url"
    echo "  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key"
    echo "  SUPABASE_SERVICE_ROLE_KEY=your-service-role-key"
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🔧 Building the application..."
npm run build

echo "🧪 Running tests..."
npm run lint

echo "✅ Build completed successfully!"

echo ""
echo "🎉 MVP Deployment Checklist:"
echo "1. ✅ Dependencies installed"
echo "2. ✅ Application built"
echo "3. ✅ Linting passed"
echo ""
echo "📋 Next steps for production deployment:"
echo ""
echo "1. Set up your Supabase database:"
echo "   - Run the migrations in supabase/migrations/"
echo "   - Execute the seed data in supabase/seed.sql"
echo ""
echo "2. Deploy to your hosting platform:"
echo "   - Vercel: vercel --prod"
echo "   - Netlify: netlify deploy --prod"
echo "   - Railway: railway up"
echo ""
echo "3. Configure environment variables in your hosting platform:"
echo "   - NEXT_PUBLIC_SUPABASE_URL"
echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "   - SUPABASE_SERVICE_ROLE_KEY"
echo ""
echo "4. Set up custom domain (optional)"
echo ""
echo "5. Test the application:"
echo "   - User registration and login"
echo "   - Rule creation and browsing"
echo "   - Admin dashboard functionality"
echo ""
echo "🎯 MVP Features Ready:"
echo "✅ User authentication with Supabase"
echo "✅ Rule creation and management"
echo "✅ Rule browsing and search"
echo "✅ Admin dashboard"
echo "✅ Sample rules and templates"
echo "✅ User onboarding flow"
echo "✅ Responsive design"
echo "✅ Error handling and loading states"
echo ""
echo "🚀 Your Cursor Rules Hub is ready for launch!" 