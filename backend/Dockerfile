FROM node:20-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json ./

# Installer les dépendances de production
RUN npm install --only=production

# Copier le code source
COPY . .

# Exposer le port
EXPOSE 3000

# Démarrer l'application
CMD ["node", "src/app.js"]

