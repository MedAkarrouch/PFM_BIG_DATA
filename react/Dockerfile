# Use official Node.js image
FROM node:18

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the Vite app (creates /dist)
RUN npm run build

# Install a static file server
RUN npm install -g serve

# Serve the build folder on port 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
