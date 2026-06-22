#!/usr/bin/env bash
# One-time setup to enable the server-side C++ judge (optional — C++ already
# works in-browser via the Compiler Explorer API). Requires a Supabase account.
#
# The Supabase CLI is used via npx, so nothing is installed globally.
set -euo pipefail

# 1. Log in (opens a browser for an access token).
npx -y supabase@latest login

# 2. Link this repo to your Supabase project (grab the ref from the dashboard
#    URL: app.supabase.com/project/<PROJECT_REF>).
read -r -p "Supabase project ref: " PROJECT_REF
npx -y supabase@latest link --project-ref "$PROJECT_REF"

# 3. Deploy the C++ and Java runners (verify_jwt=true per config.toml).
npx -y supabase@latest functions deploy run-cpp
npx -y supabase@latest functions deploy run-java

echo
echo "Done. Now set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (see"
echo ".env.local.example) and rebuild. C++ submissions will route through the"
echo "run-cpp Edge Function instead of calling Compiler Explorer directly."
