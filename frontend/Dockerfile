# Frontend Dockerfile - Development Mode
FROM node:18-alpine

WORKDIR /app

# Install dependencies first (cache layer)
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose Vite dev server port
EXPOSE 3000

# Run dev server with host flag for Docker
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
