#!/bin/sh
set -e

echo "🚀 Starting Optician Landing application..."

# Wait for database to be ready
echo "⏳ Waiting for database..."
until npx prisma db push --accept-data-loss 2>/dev/null || npx prisma migrate deploy 2>/dev/null; do
  echo "⏳ Database not ready, retrying in 2 seconds..."
  sleep 2
done

echo "✅ Database is ready!"

# Run migrations
echo "🔄 Running database migrations..."
npx prisma migrate deploy || echo "⚠️  Migrations may have already been applied"

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Seed database (ignore errors if already seeded)
echo "🌱 Seeding database..."
npm run db:seed 2>/dev/null || echo "ℹ️  Database already seeded or seed script failed (non-critical)"

echo "✅ Initialization complete!"
echo "🎉 Starting application..."

# Execute the CMD from Dockerfile
exec "$@"
