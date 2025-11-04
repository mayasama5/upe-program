#!/bin/bash

# Script para reemplazar todas las referencias a process.env.REACT_APP_BACKEND_URL
# con llamadas a getBackendUrl()

cd /home/iseeyou/Documents/upe-program/frontend/src

# Lista de archivos a procesar
FILES=$(find . -type f \( -name "*.jsx" -o -name "*.js" \) ! -path "*/node_modules/*" ! -name "*.backup" ! -name "App_new.js" -exec grep -l "process\.env\.REACT_APP_BACKEND_URL\|process\.env\.REACT_APP_API_URL" {} \;)

for file in $FILES; do
  echo "Processing: $file"

  # Hacer backup
  cp "$file" "$file.bak"

  # Reemplazar const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'fallback'
  # con const BACKEND_URL = getBackendUrl()
  sed -i -E "s/const BACKEND_URL = process\.env\.REACT_APP_BACKEND_URL \|\| [^;]+;/const BACKEND_URL = getBackendUrl();/g" "$file"
  sed -i -E "s/const BACKEND_URL = process\.env\.REACT_APP_BACKEND_URL\|\|[^;]+;/const BACKEND_URL = getBackendUrl();/g" "$file"

  # Similar para API
  sed -i -E "s/const API = process\.env\.REACT_APP_API_URL \|\| [^;]+;/const API = getBackendUrl();/g" "$file"

  echo "Done: $file"
done

echo "All files processed!"
