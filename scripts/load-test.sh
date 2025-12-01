#!/bin/bash

echo "🚀 Teste de carga (5 minutos)..."

for i in {1..300}; do
  curl -s -X POST http://localhost:3000/api/payments \
    -H "Content-Type: application/json" \
    -d "{\"amount\": $((RANDOM % 1000)), \"currency\": \"BRL\", \"customer_id\": \"load-$i\"}" > /dev/null
  
  if [ $((i % 20)) -eq 0 ]; then
    echo "✓ $i requisições enviadas..."
  fi
  
  sleep 1
done

echo "✅ Teste concluído!"
