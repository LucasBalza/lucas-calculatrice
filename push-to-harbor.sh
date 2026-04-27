#!/bin/bash
set -e

PROJECT_NAME=${1:-ipim2il}
REGISTRY="harbor.kakor.ovh/${PROJECT_NAME}"

echo "Connexion à Harbor..."
docker login harbor.kakor.ovh

echo "Build backend..."
docker build -t ${REGISTRY}/lucas-calculator-backend:latest ./backend

echo "Build frontend..."
docker build -t ${REGISTRY}/lucas-calculator-frontend:latest ./frontend

echo "Push backend..."
docker push ${REGISTRY}/lucas-calculator-backend:latest

echo "Push frontend..."
docker push ${REGISTRY}/lucas-calculator-frontend:latest

echo "Images poussées vers Harbor"
echo "Vérifie sur : https://harbor.kakor.ovh/harbor/projects/${PROJECT_NAME}/repositories"

echo "Images poussées vers Harbor"
echo "Vérifie sur : https://harbor.kakor.ovh/harbor/projects/5/repositories"