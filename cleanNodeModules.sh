#!/bin/bash

# Encontra todas as pastas node_modules em subdiretórios e as remove
find . -name "node_modules" -type d -prune -exec rm -rf '{}' +

echo "Todas as pastas node_modules foram removidas."