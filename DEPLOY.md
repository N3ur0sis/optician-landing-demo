# 🚀 Guide de Déploiement - Optician CMS

## Prérequis

- Docker et Docker Compose installés sur le serveur
- Git
- Accès SSH au VPS

## Déploiement Rapide

### 1. Cloner le repository

```bash
git clone <repository-url> optician-cms
cd optician-cms
```

### 2. Créer le fichier `.env`

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```bash
# Générer des secrets sécurisés :
# openssl rand -base64 32

# Base de données PostgreSQL
POSTGRES_USER=optician_user
POSTGRES_PASSWORD=<MOT_DE_PASSE_SECURE>
POSTGRES_DB=optician_db
DATABASE_URL=postgresql://optician_user:<MOT_DE_PASSE_SECURE>@db:5432/optician_db?schema=public

# Authentification NextAuth
NEXTAUTH_URL=https://votredomaine.com
NEXTAUTH_SECRET=<VOTRE_SECRET_NEXTAUTH>

# Production
NODE_ENV=production
```

> ⚠️ **Important** : Remplacez `<MOT_DE_PASSE_SECURE>` et `<VOTRE_SECRET_NEXTAUTH>` par des valeurs générées avec `openssl rand -base64 32`

### 3. Lancer l'application

```bash
docker compose up --build -d
```

C'est tout ! 🎉

L'application :
- Attend que PostgreSQL soit prêt
- Exécute automatiquement les migrations Prisma
- Seed la base de données avec les données initiales
- Démarre le serveur Next.js

### 4. Vérifier le statut

```bash
# Voir les logs
docker compose logs -f web

# Vérifier la santé
curl http://localhost:3000/api/health
```

---

## Accès à l'Administration

Une fois déployé, accédez à l'interface d'administration :

- **URL** : `https://votredomaine.com/admin/login`
- **Email** : `stefan@optic-developpement.com`
- **Mot de passe** : `admin123456`

> ⚠️ **Changez le mot de passe immédiatement après la première connexion !**

---

## Configuration Nginx (Reverse Proxy)

Si vous utilisez Nginx comme reverse proxy :

```nginx
server {
    listen 80;
    server_name votredomaine.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name votredomaine.com;

    ssl_certificate /path/to/fullchain.pem;
    ssl_certificate_key /path/to/privkey.pem;

    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Commandes Utiles

### Gestion des containers

```bash
# Démarrer
docker compose up -d

# Arrêter
docker compose down

# Redémarrer
docker compose restart

# Rebuild après modifications
docker compose up --build -d

# Voir les logs en temps réel
docker compose logs -f web
```

### Base de données

```bash
# Accéder à PostgreSQL
docker compose exec db psql -U optician_user -d optician_db

# Backup de la base
docker compose exec db pg_dump -U optician_user optician_db > backup.sql

# Restaurer un backup
cat backup.sql | docker compose exec -T db psql -U optician_user -d optician_db
```

### Réinitialiser la base de données

```bash
# Arrêter et supprimer les volumes
docker compose down -v

# Relancer (recreate tout)
docker compose up --build -d
```

---

## Variables d'Environnement

| Variable | Description | Requis |
|----------|-------------|--------|
| `DATABASE_URL` | URL de connexion PostgreSQL | ✅ |
| `NEXTAUTH_URL` | URL publique de l'application | ✅ |
| `NEXTAUTH_SECRET` | Secret pour les sessions | ✅ |
| `POSTGRES_USER` | Utilisateur PostgreSQL | ✅ |
| `POSTGRES_PASSWORD` | Mot de passe PostgreSQL | ✅ |
| `POSTGRES_DB` | Nom de la base de données | ✅ |
| `NODE_ENV` | Environment (production) | ✅ |
| `RUN_SEED` | Force le seeding (true/false) | ❌ |

---

## Dépannage

### Le container web ne démarre pas

```bash
# Vérifier les logs
docker compose logs web

# Vérifier que la DB est healthy
docker compose ps
```

### Erreur de connexion à la base

1. Vérifiez que `DATABASE_URL` correspond aux variables `POSTGRES_*`
2. Assurez-vous que le host est `db` (nom du service Docker)

### Les migrations échouent

```bash
# Relancer manuellement
docker compose exec web npx prisma migrate deploy
```

### Réinitialiser complètement

```bash
docker compose down -v
docker system prune -af
docker compose up --build -d
```

---

## Architecture

```
┌─────────────────┐     ┌─────────────────┐
│   Nginx/Caddy   │────▶│   optician-web  │
│  (port 80/443)  │     │   (port 3000)   │
└─────────────────┘     └────────┬────────┘
                                 │
                        ┌────────▼────────┐
                        │   optician-db   │
                        │  (PostgreSQL)   │
                        └─────────────────┘
```

---

## Support

Pour toute question technique, contactez l'équipe de développement.
