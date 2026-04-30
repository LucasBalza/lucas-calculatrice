# Déploiement sur OpenShift

## 🧭 Vue d’ensemble

Ce projet utilise une pipeline CI/CD GitHub Actions pour :

* exécuter les tests backend
* builder le frontend
* construire les images Docker
* pousser les images sur Harbor
* déployer automatiquement sur OpenShift via des manifests YAML

Le déploiement repose **exclusivement sur des images Docker hébergées sur Harbor** et des fichiers déclaratifs situés dans le dossier `openshift/`.

---

## ⚙️ Prérequis

* Accès à un cluster OpenShift
* CLI `oc` installée (uniquement pour un déploiement manuel)
* Un projet OpenShift existant
* Un registry Harbor accessible
* Un repository GitHub avec les secrets configurés

---

## 🔐 Configuration des secrets GitHub

Pour activer le pipeline complet (build + push + déploiement), les secrets suivants doivent être configurés :

### Harbor

* `HARBOR_USERNAME`
* `HARBOR_PASSWORD`

### OpenShift

* `OPENSHIFT_SERVER`
* `OPENSHIFT_TOKEN`
* `OPENSHIFT_PROJECT`

⚠️ Sans ces secrets :

* les images ne seront **pas poussées**
* le déploiement OpenShift ne sera **pas exécuté**

---

## 🚀 Fonctionnement de la pipeline

La pipeline se déclenche sur :

* `push` vers `main` ou `master`
* `pull_request` vers `main` ou `master`

### Étapes exécutées

#### 1. Tests backend

* installation des dépendances
* exécution des tests (`npm test`)

#### 2. Build frontend

* installation des dépendances
* compilation (`npm run build`)

#### 3. Build Docker

* construction des images backend et frontend
* génération de tags temporaires (`ci-<run_number>`)

#### 4. Push vers Harbor (uniquement sur push)

* push des images avec le tag `latest`

#### 5. Déploiement OpenShift (uniquement sur push)

* connexion au cluster
* sélection du projet
* application des manifests :

```bash
oc apply -f openshift/secrets.yaml
oc apply -f openshift/mongo.yaml
oc apply -f openshift/backend.yaml
oc apply -f openshift/frontend.yaml
```

---

## 📦 Structure des manifests OpenShift

Tous les manifests utilisés par la CI sont situés dans :

```bash
openshift/
├── secrets.yaml
├── mongo.yaml
├── backend.yaml
└── frontend.yaml
```

Ces fichiers définissent :

* les deployments
* les services
* les routes
* les variables d’environnement via secrets

---

## 🧪 Déploiement manuel (optionnel)

Si nécessaire, le déploiement peut être reproduit manuellement :

```bash
oc login <server> --token=<token>
oc project <project>

oc apply -f openshift/secrets.yaml
oc apply -f openshift/mongo.yaml
oc apply -f openshift/backend.yaml
oc apply -f openshift/frontend.yaml
```

⚠️ Les images utilisées doivent déjà être disponibles sur Harbor avec le tag `latest`.

---

## 🔧 Variables d’environnement

Les variables sensibles sont stockées dans un Secret Kubernetes :

* `JWT_SECRET`
* `MONGO_USERNAME`
* `MONGO_PASSWORD`

### Mise à jour

```bash
echo -n 'nouvelle-valeur' | base64
oc edit secret lucas-calculator-secrets
```

Puis redémarrer le backend :

```bash
oc rollout restart deployment lucas-calculator-backend
```

---

## 🔐 Sécurité

* Modifier `JWT_SECRET` en production
* Ne jamais exposer les mots de passe en clair
* Utiliser les Secrets Kubernetes
* Configurer HTTPS via les routes OpenShift

---

## 🛠️ Dépannage

### Images Harbor non accessibles

* Vérifier l’existence des images :

```bash
docker pull harbor.kakor.ovh/ipim2il/lucas-calculator-backend:latest
```

* Vérifier les credentials Harbor
* Configurer un `imagePullSecret` si nécessaire

---

### Pods non mis à jour après un déploiement

Si les pods ne prennent pas la nouvelle image :

```bash
oc rollout restart deployment lucas-calculator-backend
oc rollout restart deployment lucas-calculator-frontend
```

---

### Pods en erreur

```bash
oc logs -f deployment/lucas-calculator-backend
oc describe pod <nom-du-pod>
```

---

## 📌 Bonnes pratiques

* Utiliser des tags versionnés en complément de `latest`
* Mettre en place une stratégie de rollback
* Surveiller les logs après chaque déploiement
* Ajouter des probes (`liveness` / `readiness`) dans les deployments

---

## 🧠 Résumé

* CI/CD = GitHub Actions
* Images = Harbor
* Déploiement = manifests YAML (`openshift/`)
* Aucune construction d’image côté OpenShift
* Pipeline conditionnelle aux secrets

---
