#!/bin/sh

cd /app

echo "Gerando cliente Prisma..."
npx prisma generate

echo "Aplicando migrações do Prisma..."
npx prisma migrate deploy

echo "Iniciando o servidor FastAPI..."
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload