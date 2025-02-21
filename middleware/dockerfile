# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first for dependency caching
COPY package*.json ./

# Install only production dependencies (if you want dev dependencies, remove --production)
RUN npm install --production

# Copy the rest of your application code
COPY . .

# Expose the port your server listens on (here, 8000)
EXPOSE 8000

# Start the Node.js server
CMD ["node", "server.js"]
