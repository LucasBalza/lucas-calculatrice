# Déploiement sur OpenShift

## Prérequis
- Accès à un cluster OpenShift
- `oc` CLI installé et connecté

## Étapes de déploiement

### 1. Créer un nouveau projet
```bash
oc new-project lucas-calculatrice
```

### 2. Build et pousser les images

#### Backend
```bash
oc new-app nodejs:18-ubi8~https://github.com/LucasBalza/lucas-calculatrice --name=lucas-calculator-backend
```

#### Frontend
```bash
oc new-app nodejs:18-ubi8~https://github.com/LucasBalza/lucas-calculatrice --name=lucas-calculator-frontend
```

### 3. Créer les secrets
```bash
oc apply -f secrets.yaml
```

### 4. Déployer MongoDB
```bash
oc apply -f mongo.yaml
```

### 5. Déployer le Backend
```bash
oc apply -f backend.yaml
```

### 6. Déployer le Frontend
```bash
oc apply -f frontend.yaml
```

### 7. Accéder à l'application
```bash
# Obtenir l'URL du frontend
oc get routes calculator-frontend
```

## Variables d'environnement

Les variables sensibles sont stockées dans un Secret Kubernetes :
- **JWT_SECRET** : Clé secrète pour les tokens JWT
- **MONGO_USERNAME** : Utilisateur MongoDB
- **MONGO_PASSWORD** : Mot de passe MongoDB

Pour changer ces valeurs en production :
1. Encoder en base64 : `echo -n 'nouvelle-valeur' | base64`
2. Mettre à jour le secret : `oc edit secret lucas-calculator-secrets`
3. Redémarrer les pods : `oc rollout restart deployment lucas-calculator-backend`

## Sécurité
- Changer le JWT_SECRET en production
- Utiliser des secrets pour les mots de passe
- Configurer HTTPS via les routes OpenShift