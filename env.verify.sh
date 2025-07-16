#!/bin/bash

echo ""
echo "🔍 Verifying Environment Variables for NotebookLM Directory..."
echo "--------------------------------------------------------------"

VARS=(
  STRIPE_SECRET_KEY
  SUPABASE_URL
  SUPABASE_ANON_KEY
  SUPABASE_SERVICE_ROLE_KEY
  SUPABASE_JWT_SECRET
  NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY
  POSTGRES_PRISMA_URL
  POSTGRES_URL_NON_POOLING
  SITE_NAME
  ENVIRONMENT
)

for VAR in "${VARS[@]}"; do
  VALUE="${!VAR}"
  if [[ -z "$VALUE" ]]; then
    echo "❌ $VAR is NOT set"
  else
    echo "✅ $VAR is set"
  fi
done

echo "--------------------------------------------------------------"
echo "🧪 Verification complete."
echo ""
