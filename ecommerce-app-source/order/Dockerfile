# Use an official Node.js runtime as a parent image
FROM node:16.13-alpine

# Set the working directory to /app
WORKDIR /app

# Install curl for testing APIs
RUN apk add --no-cache curl

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm ci

# Copy the rest of the application files to the container
COPY . .

# Set the command to start the app
CMD [ "npm", "start" ]