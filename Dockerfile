# ============================================
# OPTICIAN CMS - Production-Ready Dockerfile
# ============================================
# Multi-stage build for optimized production image
# 
# Build: docker build -t optician-cms .
# Run:   docker run -p 3000:3000 --env-file .env optician-cms
# ============================================

# =================================
# Base Stage - Common setup
# =================================
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Install system dependencies required by Prisma and Node
RUN apk add --no-cache \
    openssl \
    libc6-compat \
    && rm -rf /var/cache/apk/*

# =================================
# Dependencies Stage
# =================================
FROM base AS deps

# Copy package files
COPY package.json package-lock.json ./

# Install ALL dependencies (including devDependencies for build)
RUN npm ci --ignore-scripts && npm cache clean --force

# =================================
# Development Stage
# =================================
FROM base AS development

# Install netcat for health checks
RUN apk add --no-cache netcat-openbsd

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Copy and setup entrypoint
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "run", "dev"]

# =================================
# Builder Stage - Build application
# =================================
FROM base AS builder

# Set production environment for build
ENV NODE_ENV=production
# Dummy DATABASE_URL for Prisma generate (schema validation only)
ENV DATABASE_URL="postgresql://build:build@localhost:5432/build?schema=public"

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate --schema=prisma/schema.prisma

# Build Next.js application (standalone mode)
RUN npm run build

# Note: We keep devDependencies for tsx (needed for seed script)
# The standalone build is self-contained, so extra node_modules won't affect it

# =================================
# Production Stage - Minimal runtime
# =================================
FROM node:20-alpine AS production

# Labels for container metadata
LABEL org.opencontainers.image.title="Optician CMS"
LABEL org.opencontainers.image.description="CMS for Optician Landing Page"
LABEL org.opencontainers.image.version="1.0.0"

WORKDIR /app

# Production environment
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

# Install minimal runtime dependencies
RUN apk add --no-cache \
    openssl \
    libc6-compat \
    netcat-openbsd \
    dumb-init \
    && rm -rf /var/cache/apk/*

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 --ingroup nodejs nextjs

# Copy package.json and package-lock.json for npm/npx
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./
COPY --from=builder --chown=nextjs:nodejs /app/package-lock.json ./

# Copy Next.js standalone build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy public assets
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy Prisma files (schema, migrations, generated client, config)
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma.config.ts ./
COPY --from=builder --chown=nextjs:nodejs /app/tsconfig.json ./

# Copy ALL node_modules for Prisma CLI (Prisma 7 has many transitive dependencies)
# This ensures migrations and seed work correctly
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

# Copy entrypoint script
COPY --chown=nextjs:nodejs docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Create uploads directory with correct permissions
RUN mkdir -p /app/public/uploads \
    && chown -R nextjs:nodejs /app/public/uploads

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Use dumb-init as PID 1 for proper signal handling
ENTRYPOINT ["/usr/bin/dumb-init", "--", "docker-entrypoint.sh"]
CMD ["node", "server.js"]
