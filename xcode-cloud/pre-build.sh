#!/bin/bash
set -euo pipefail

# Evita iniciar o Metro no Cloud
export RCT_NO_LAUNCH_PACKAGER=true

# Ambiente de produção para bundling React Native / Expo
export NODE_ENV=production

echo "[Pre-build] Instalando dependências JS (npm ci ou yarn)"
if command -v npm >/dev/null 2>&1; then
  npm ci
elif command -v yarn >/dev/null 2>&1; then
  yarn install --frozen-lockfile
else
  echo "Node/npm/yarn não encontrados no runner. Verifique a imagem do Xcode Cloud."
  exit 1
fi

# CocoaPods
export GEM_HOME="$HOME/.gem"
export PATH="$GEM_HOME/bin:$PATH"
if ! command -v pod >/dev/null 2>&1; then
  echo "[Pre-build] Instalando CocoaPods"
  gem install cocoapods --no-document
fi

echo "[Pre-build] Instalando Pods"
cd ios
pod install --repo-update

echo "[Pre-build] OK"