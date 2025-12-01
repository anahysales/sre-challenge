FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache curl

COPY package*.json ./
COPY tsconfig.json ./

RUN npm ci --only=production

COPY src ./src

RUN npm install -D typescript @types/node @types/express @types/uuid && \
    npm run build && \
    npm prune --production

EXPOSE 3000

CMD ["npm", "start"]
