# Docker Quick Start

## Development Mode (Default)

Simply run:

```bash
docker compose up --build
```

Or use the npm script:

```bash
npm run docker:up
```

The application will:
- ✅ Start PostgreSQL database
- ✅ Wait for database to be ready
- ✅ Run migrations automatically
- ✅ Seed the database with admin user
- ✅ Start Next.js in development mode with hot-reload
- ✅ Be available at http://localhost:3000

**Admin Login:**
- Email: `admin@optician.com`
- Password: `DevPassword123!`

## Production Mode

1. Copy the production environment file:
```bash
cp .env.production .env
```

2. Edit `.env` and set secure passwords and secrets:
```bash
# Generate a secure NextAuth secret:
openssl rand -base64 32

# Update these values:
POSTGRES_PASSWORD=your_secure_password
NEXTAUTH_SECRET=your_generated_secret
NEXTAUTH_URL=https://yourdomain.com
ADMIN_PASSWORD=your_secure_admin_password
```

3. Run with production build:
```bash
docker compose up --build
```

The Dockerfile will automatically use the `production` target based on `BUILD_TARGET` in your `.env`.

## Available Commands

```bash
# Start containers (builds if needed)
npm run docker:up
docker compose up --build

# Start in detached mode (background)
npm run docker:up:detached
docker compose up --build -d

# Stop containers
npm run docker:down
docker compose down

# View logs (follow mode)
npm run docker:logs
docker compose logs -f

# Restart containers
npm run docker:restart
docker compose restart

# Clean up (removes volumes/data)
npm run docker:clean
docker compose down -v
```

## Environment Switching

The same `docker-compose.yml` and `Dockerfile` work for both development and production.

**Development** (default):
- Uses `.env.development` or `.env` with `BUILD_TARGET=development`
- Mounts source code for hot-reload
- Runs `npm run dev`
- Development dependencies included

**Production**:
- Uses `.env.production` or `.env` with `BUILD_TARGET=production`
- Optimized standalone build
- Runs compiled `node server.js`
- Minimal image size, no dev dependencies

Just change your `.env` file to switch between modes:
```bash
# Development
BUILD_TARGET=development

# Production
BUILD_TARGET=production
```

## Architecture

```
┌─────────────────────────────────────┐
│  Next.js App (port 3000)            │
│  - Auto migrations on startup        │
│  - Auto seeding                      │
│  - Hot reload (dev mode)             │
└──────────────┬──────────────────────┘
               │
               │ Docker Network
               │
┌──────────────▼──────────────────────┐
│  PostgreSQL 16 (port 5432)          │
│  - Persistent volume                 │
│  - Health checks                     │
└─────────────────────────────────────┘
```

## Troubleshooting

**Containers not starting?**
```bash
docker compose down -v
docker compose up --build
```

**Database connection issues?**
Check the `DATABASE_URL` uses `@db:5432` (not `@localhost:5432`) in `.env`

**Need to reset everything?**
```bash
npm run docker:clean  # Removes all data
npm run docker:up     # Fresh start
```

## Development Workflow

1. Start Docker: `npm run docker:up`
2. Edit code - changes auto-reload
3. Database changes: Edit `prisma/schema.prisma` then restart containers
4. View logs: `npm run docker:logs` (in separate terminal)

## VPS Deployment

For VPS deployment, use the production configuration:

1. Copy `.env.production` to your VPS
2. Update all passwords and secrets
3. Set `NEXTAUTH_URL` to your domain
4. Run `docker compose up -d --build`

The same `docker-compose.yml` and `Dockerfile` work on your VPS without changes.
