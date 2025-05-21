# Use an official Node.js base image
FROM node:22-slim

# Install FFmpeg (for video transcoding)
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    apt-get clean

# Create and set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port (optional, if your backend has an HTTP server)
# EXPOSE 3000

# Default command to run your SQS listener or other entry point
CMD ["node", "index.js"]
