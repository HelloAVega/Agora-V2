# Dockerfile - Production Build
FROM node:22-alpine as builder

WORKDIR /app

# Copy root package files (only package.json required)
COPY package.json ./
RUN test -f package-lock.json && cp package-lock.json ./ || true

# Install root dependencies
RUN npm install

# Copy server and client
COPY server ./server
COPY client ./client

# Install server dependencies
WORKDIR /app/server
RUN test -f package-lock.json && cp package-lock.json ./ || true
RUN npm install --production=false

# Install client dependencies and build
WORKDIR /app/client
RUN test -f package-lock.json && cp package-lock.json ./ || true
RUN npm install --production=false && npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Copy root package files
COPY package.json ./
RUN npm install --production

# Copy server
COPY server ./server

# Copy client dist from builder
COPY --from=builder /app/client/dist ./client/dist

# Copy environment template
COPY .env.example .env

EXPOSE 5000

CMD ["npm", "start"]
