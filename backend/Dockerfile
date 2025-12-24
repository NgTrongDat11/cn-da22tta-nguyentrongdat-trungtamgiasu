FROM node:18-alpine

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy prisma schema
COPY prisma ./prisma/

# Generate Prisma Client
RUN npm run prisma:generate

# Copy source code
COPY . .

EXPOSE 5000

# Default command (can be overridden)
CMD ["npm", "run", "dev"]
