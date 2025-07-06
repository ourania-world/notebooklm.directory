#!/bin/bash

echo "🚀 Deploying NotebookLM Directory Edge Functions..."

# Check if Supabase CLI is available
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first:"
    echo "npm install -g supabase"
    exit 1
fi

# Deploy all Edge Functions
echo "📦 Deploying create-checkout-session..."
supabase functions deploy create-checkout-session

echo "📦 Deploying stripe-webhook-handler..."
supabase functions deploy stripe-webhook-handler

echo "📦 Deploying manage-subscription..."
supabase functions deploy manage-subscription

echo "✅ All Edge Functions deployed successfully!"
echo ""
echo "🔧 Next steps:"
echo "1. Set environment variables in Supabase Dashboard"
echo "2. Configure Stripe webhook endpoints"
echo "3. Test the complete flow"