#!/bin/sh
set -e

echo "🧹 Limpando pastas nativas antigas..."
rm -rf android ios

echo "📦 Verificando dependências..."
if [ ! -f "yarn.lock" ]; then
  echo "yarn.lock não encontrado, gerando..."
  yarn install
fi

# REMOVIDO: eas login --token ... 
# O EAS CLI detecta a variável EXPO_TOKEN automaticamente.

# Opcional: Executar o prebuild manualmente antes para garantir o Autolinking
echo "⚙️  Executando Expo Prebuild..."
npx expo prebuild --platform android --no-install

echo "🚀 Iniciando EAS build local..."
eas build \
  --local \
  --platform android \
  --profile preview \
  --non-interactive

echo "📂 Copiando APK gerado..."
mkdir -p /app/release_outputs
find . -maxdepth 3 -name "*.apk" -exec cp {} /app/release_outputs/app-release.apk \;

echo "✅ Sucesso!"