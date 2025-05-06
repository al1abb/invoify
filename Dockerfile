FROM ghcr.io/puppeteer/puppeteer:24.8.0 AS build

WORKDIR /app

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Ensure we're using root for the build process to avoid permission issues
USER root

# Copy package files first to leverage Docker cache
COPY package.json package-lock.json* ./
RUN npm ci

# Copy the rest of the application code
COPY . .

# Ensure the .next directory exists with proper permissions
RUN mkdir -p /app/.next && chmod -R 777 /app/.next

# Build the application
RUN npm run build

FROM ghcr.io/puppeteer/puppeteer:24.8.0 AS production

WORKDIR /app

ENV NODE_ENV=production \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Use root for setup operations
USER root

# Copy only necessary files from the build stage
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/package-lock.json* ./

# Install only production dependencies
RUN npm ci --only=production && \
    # Fix permissions for the pptruser
    chown -R pptruser:pptruser /app

# Add healthcheck to ensure the application is running properly
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Switch to pptruser for running the application
USER pptruser
EXPOSE 3000

CMD ["npm", "start"]

