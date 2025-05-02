FROM node:18-alpine

RUN mkdir -p /var/log/loandesk_logs && chown -R node:node /var/log/loandesk_logs

WORKDIR /app
# Install ssh
RUN apk add --no-cache bash curl mongodb-tools

# Optional: install ngrok (manual method)
## Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy typescript config
COPY tsconfig.json ./

# Copy source code
COPY src/ ./src/

# Build TypeScript
RUN npm run build
# Expose port
EXPOSE 3000



# Set non-root user
USER node

# Start the application with connection checking
CMD ["/bin/sh", "-c", "npm start"]
