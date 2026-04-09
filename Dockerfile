# Use official Node.js image as base
FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3000

# Add a script to run migrations then start
CMD ["npm", "run", "migrate-and-start"]
