# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json ./

# Installer les dépendances
RUN npm install

# Copier le code source
COPY . .

# Build de l'application avec variable d'environnement
ARG VITE_API_URL=https://lucas-calculator-backend.apps.openshift.kakor.ovh
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Stage 2: Production avec serve
FROM node:20-alpine AS production

WORKDIR /app

# Installer serve globalement
RUN npm install -g serve

# Copier les fichiers buildés
COPY --from=builder /app/dist ./dist

EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173"]

