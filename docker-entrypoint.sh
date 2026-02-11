#!/bin/sh
# ============================================
# OPTICIAN CMS - Production Entrypoint Script
# ============================================
# This script handles:
# - Database connection waiting
# - Running migrations
# - Seeding initial data
# - Starting the application
# ============================================

set -e

# Colors for output (if terminal supports it)
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo "${GREEN}[SUCCESS]${NC} $1"
}

log_warn() {
    echo "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo "${RED}[ERROR]${NC} $1"
}

echo "============================================"
echo "🚀 OPTICIAN CMS - Starting Application"
echo "============================================"
echo "Environment: ${NODE_ENV:-development}"
echo "Port: ${PORT:-3000}"
echo ""

# =================================
# Database Connection Check
# =================================
wait_for_database() {
    log_info "Waiting for database connection..."
    
    # Extract host and port from DATABASE_URL
    # Format: postgresql://user:password@host:port/database
    if [ -z "$DATABASE_URL" ]; then
        log_error "DATABASE_URL is not set!"
        exit 1
    fi
    
    # Parse DATABASE_URL
    DB_HOST=$(echo "$DATABASE_URL" | sed -n 's|.*@\([^:/]*\).*|\1|p')
    DB_PORT=$(echo "$DATABASE_URL" | sed -n 's|.*:\([0-9]*\)/.*|\1|p')
    
    # Default port if not found
    DB_PORT=${DB_PORT:-5432}
    
    log_info "Database host: $DB_HOST:$DB_PORT"
    
    max_retries=30
    retry_count=0
    retry_interval=2
    
    while ! nc -z "$DB_HOST" "$DB_PORT" 2>/dev/null; do
        retry_count=$((retry_count + 1))
        
        if [ $retry_count -ge $max_retries ]; then
            log_error "Could not connect to database after ${max_retries} attempts"
            log_error "Please check that the database is running and accessible"
            exit 1
        fi
        
        log_warn "Database not ready, retrying in ${retry_interval}s... (${retry_count}/${max_retries})"
        sleep $retry_interval
    done
    
    log_success "Database is accepting connections!"
    
    # Give PostgreSQL a moment to be fully ready
    sleep 2
}

# =================================
# Run Database Migrations
# =================================
run_migrations() {
    log_info "Running database migrations..."
    
    # Run Prisma 7 migrations using npx (reads from prisma.config.ts)
    if npx prisma migrate deploy 2>&1; then
        log_success "Migrations applied successfully"
    else
        log_warn "Migration may have failed - check database connectivity"
    fi
}

# =================================
# Seed Database
# =================================
seed_database() {
    log_info "Checking if database needs seeding..."
    
    # Run Prisma 7 seed using npx (reads seed command from prisma.config.ts)
    if npx prisma db seed 2>&1; then
        log_success "Database seeded successfully"
    else
        log_info "Database already seeded or seed skipped"
    fi
}

# =================================
# Main Execution
# =================================
main() {
    # Wait for database to be ready
    wait_for_database
    
    echo ""
    
    # Run migrations
    run_migrations
    
    echo ""
    
    # Seed database ONLY when explicitly requested (first deployment only!)
    # WARNING: seed.ts uses deleteMany() — it will WIPE existing data!
    if [ "$RUN_SEED" = "true" ]; then
        seed_database
    else
        log_info "Skipping database seed (set RUN_SEED=true to force)"
    fi
    
    echo ""
    echo "============================================"
    log_success "Initialization complete!"
    echo "🎉 Starting application server..."
    echo "============================================"
    echo ""
    
    # Execute the main command (passed as arguments)
    exec "$@"
}

# Run main function with all script arguments
main "$@"
