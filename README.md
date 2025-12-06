# Optician Landing - Production CMS Platform

A modern, production-ready full-stack CMS built with Next.js 16, TypeScript, and PostgreSQL. Features a secure authentication system, role-based access control, and Docker deployment.

## 🚀 Quick Start

### Development
```bash
docker compose up --build
# App at http://localhost:3000
# Login: admin@optician.com / DevPassword123!
```

### Production
```bash
cp .env.production .env
# Edit .env with production credentials
docker compose up --build -d
```

## 🔐 Security

- ✅ NextAuth.js v5 with JWT sessions
- ✅ Bcrypt (12 rounds) password hashing
- ✅ Role-Based Access Control (ADMIN, WEBMASTER, EDITOR, VIEWER)
- ✅ Protected routes & middleware
- ✅ Environment secrets

See [SECURITY.md](./SECURITY.md) for full audit.

## 🛠 Stack

- Next.js 16.0.7 + Turbopack
- PostgreSQL 16 + Prisma 7
- NextAuth.js v5
- Docker + Compose

## 📦 Commands

```bash
npm run docker:up            # Start development
npm run docker:up:detached   # Background mode
npm run docker:down          # Stop
npm run docker:logs          # View logs
npm run docker:clean         # Reset all
```

## 📚 Docs

- [Docker Guide](./README.docker.md)
- [Security Audit](./SECURITY.md)

---

Built with ❤️ for modern web
