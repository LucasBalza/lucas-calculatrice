# 🧮 Calculatrice - Application Full Stack

Application de calculatrice avec authentification utilisateur, backend Node.js/Express et frontend React/TypeScript.

## 📋 Structure du projet

```
projet/
├── backend/          # API Node.js + Express + MongoDB
├── frontend/         # Application React + TypeScript + Vite
├── openshift/        # Manifests Kubernetes pour OpenShift
├── docker-compose.yml
├── push-to-harbor.sh # Script pour pousser les images Harbor
├── .env              # Variables d'environnement locales
├── .env.example      # Exemple de configuration
└── README.md
```

## 🔐 Authentification

L'application nécessite une authentification utilisateur pour accéder à la calculatrice :
- **Inscription** : Créer un compte avec email et mot de passe
- **Connexion** : Se connecter avec ses identifiants
- **JWT** : Token JWT pour sécuriser les requêtes API (clé configurable via secrets Kubernetes)

## 🔧 Configuration

### Variables d'environnement
- **JWT_SECRET** : Clé secrète pour les tokens JWT (stockée dans un Secret Kubernetes)
- **MONGODB_URI** : URI de connexion MongoDB avec authSource=admin
- **MONGO_ROOT_USERNAME** : Utilisateur MongoDB (calculator_user)
- **MONGO_ROOT_PASSWORD** : Mot de passe MongoDB (SecurePass2026!)
- **NODE_ENV** : Environnement (development/production)

### Fichier .env
Copie `.env.example` vers `.env` et ajuste les valeurs :
```bash
cp .env.example .env
```

## 🚀 Démarrage rapide

### Option 1 : Avec Docker Compose

```bash
# Démarrer tous les services
docker-compose up --build

# En arrière-plan
docker-compose up -d --build

# Arrêter et nettoyer
docker-compose down -v
```

L'application sera accessible sur :
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000

### Option 2 : Déploiement OpenShift

Voir le guide dans `openshift/README.md`

### Option 3 : Avec Harbor (Registry)

#### Pousser les images vers Harbor
```bash
# Se connecter à Harbor
docker login harbor.kakor.ovh

# Builder et pousser le backend (depuis la racine du projet)
docker build -t harbor.kakor.ovh/ipim2il/lucas-calculator-backend:latest ./backend
docker push harbor.kakor.ovh/ipim2il/lucas-calculator-backend:latest

# Builder et pousser le frontend (depuis la racine du projet)
docker build -t harbor.kakor.ovh/ipim2il/lucas-calculator-frontend:latest ./frontend
docker push harbor.kakor.ovh/ipim2il/lucas-calculator-frontend:latest
```

#### Script automatique
```bash
# Utilisation simple (projet par défaut)
./push-to-harbor.sh

# Avec un nom de projet spécifique
./push-to-harbor.sh nom-du-projet
```

## 🔁 Intégration continue (GitHub Actions)

Le projet inclut un workflow GitHub Actions dans `.github/workflows/ci.yml`.
Ce pipeline exécute :
- les tests backend (`npm test` dans `backend`)
- la compilation frontend (`npm run build` dans `frontend`)
- la construction des images Docker backend et frontend
- le push vers Harbor si les secrets GitHub sont définis
- le déploiement sur OpenShift si les secrets OpenShift sont définis

Secrets GitHub recommandés pour le pipeline :
- `HARBOR_USERNAME`
- `HARBOR_PASSWORD`
- `OPENSHIFT_SERVER`
- `OPENSHIFT_TOKEN`
- `OPENSHIFT_PROJECT`

Le déploiement automatique s’exécute sur les pushes vers `main` ou `master`.

## 🧪 Tests

### Backend

```bash
cd backend
npm test
```

Les tests couvrent :
- Opérations arithmétiques (+, -, *, /)
- Gestion des erreurs (division par zéro, opération invalide)
- Validation des paramètres
- Authentification et autorisation

## 📡 API Backend

### Authentification

**POST** `/auth/register`
- Corps : `{ "username": "string", "email": "string", "password": "string" }`

**POST** `/auth/login`
- Corps : `{ "email": "string", "password": "string" }`

**GET** `/auth/verify`
- Headers : `Authorization: Bearer <token>`

### Calculatrice

**POST** `/calculate`
- Headers : `Authorization: Bearer <token>`
- Corps : `{ "operation": "+", "a": 5, "b": 3 }`

**Body:**
```json
{
  "operation": "+",
  "a": 5,
  "b": 3
}
```

**Réponse réussie (200):**
```json
{
  "result": 8
}
```

**Réponse d'erreur (400):**
```json
{
  "error": "Division par zéro impossible"
}
```

### Opérations supportées

- `+` : Addition
- `-` : Soustraction
- `*` : Multiplication
- `/` : Division

### Exemples

```bash
# Addition
curl -X POST http://localhost:3000/calculate \
  -H "Content-Type: application/json" \
  -d '{"operation": "+", "a": 10, "b": 5}'
# Résultat: {"result": 15}

# Division
curl -X POST http://localhost:3000/calculate \
  -H "Content-Type: application/json" \
  -d '{"operation": "/", "a": 20, "b": 4}'
# Résultat: {"result": 5}
```

## 🐳 Docker

### Build des images

```bash
# Backend
cd backend
docker build -t lucas-calculator-backend .

# Frontend
cd frontend
docker build -t lucas-calculator-frontend .
```

### Docker Compose

```bash
# Démarrer
docker-compose up

# Démarrer en arrière-plan
docker-compose up -d

# Arrêter
docker-compose down

# Rebuild et démarrer
docker-compose up --build

# Nettoyer les volumes (utile pour reset MongoDB)
docker-compose down -v
```

## 🛠️ Technologies utilisées

### Backend
- **Node.js** : Runtime JavaScript
- **Express** : Framework web
- **MongoDB** : Base de données NoSQL
- **Mongoose** : ODM MongoDB
- **JWT** : Authentification par token
- **Jest** : Framework de tests
- **Supertest** : Tests d'intégration HTTP

### Frontend
- **React** : Bibliothèque UI
- **TypeScript** : Typage statique
- **Vite** : Build tool et dev server
- **CSS** : Styles personnalisés

## 📝 Scripts disponibles

### Backend

- `npm start` : Démarrer en production
- `npm run dev` : Démarrer en développement (avec nodemon)
- `npm test` : Exécuter les tests

### Frontend

- `npm run dev` : Démarrer le serveur de développement
- `npm run build` : Build de production
- `npm run preview` : Prévisualiser le build

## 🎨 Interface utilisateur

L'interface comprend :
- Deux champs de saisie pour les nombres A et B
- Un menu déroulant pour sélectionner l'opération
- Un bouton "Calculer"
- Affichage du résultat ou des erreurs

## ⚠️ Gestion des erreurs

L'application gère :
- Division par zéro
- Paramètres manquants
- Opérations invalides
- Nombres invalides
- Erreurs réseau
- Erreurs d'authentification MongoDB

### Logs utiles

```bash
# Docker Compose
docker-compose logs -f

# OpenShift
oc logs -f deployment/<nom>

# MongoDB
docker-compose exec mongo mongosh -u $MONGO_ROOT_USERNAME -p $MONGO_ROOT_PASSWORD --authenticationDatabase admin
```

