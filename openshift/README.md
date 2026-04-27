# Déploiement sur OpenShift

## Prérequis
- Accès à un cluster OpenShift
- `oc` CLI installé et connecté
- **Images poussées sur Harbor** (voir script `push-to-harbor.sh` à la racine du projet)
- Secrets configurés pour accéder au registry Harbor si nécessaire

## Étapes de déploiement

### 1. Créer un nouveau projet
```bash
oc new-project lucas-calculatrice
```

### 2. Déployer les applications depuis Harbor

#### Backend
```bash
oc new-app harbor.kakor.ovh/ipim2il/lucas-calculator-backend:latest --name=lucas-calculator-backend
```

#### Frontend
```bash
oc new-app harbor.kakor.ovh/ipim2il/lucas-calculator-frontend:latest --name=lucas-calculator-frontend
```

### 2. Alternative : Build et pousser les images (si pas encore fait)

Si les images ne sont pas disponibles sur Harbor, OpenShift peut builder directement depuis GitHub :

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

## Dépannage

### Images Harbor non accessibles
Si OpenShift ne peut pas tirer les images Harbor :
1. Vérifier que les images existent : `docker pull harbor.kakor.ovh/projet/lucas-calculator-backend:latest`
2. Créer un secret d'accès au registry (voir section Configuration du Registry Harbor)
3. Vérifier les permissions du projet Harbor

### Erreur "field is immutable"
```bash
oc delete deployment,service,route lucas-calculator-backend --ignore-not-found=true
oc apply -f backend.yaml
```

### Pods en CrashLoopBackOff
```bash
oc logs -f deployment/lucas-calculator-backend
oc describe pod <nom-du-pod>
```