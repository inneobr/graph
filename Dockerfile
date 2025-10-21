# Etapa 1: Build da aplicação
FROM node:20-alpine AS builder

WORKDIR /app

# Copia package.json e package-lock.json (se existir)
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia todo o código da aplicação
COPY . .

# Build da aplicação Next.js
RUN npm run build

# Etapa 2: Produção
FROM node:20-alpine

WORKDIR /app

# Copia os arquivos de node_modules do builder
COPY --from=builder /app/node_modules ./node_modules

# Copia os arquivos necessários para rodar a aplicação
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

# Expõe a porta padrão do Next.js
EXPOSE 3000

# Comando para rodar a aplicação em produção
CMD ["npm", "start"]
