# ModelLab Dockerfile
# Multi-stage build for production deployment

# Stage 1: Build frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./

# Install frontend dependencies
RUN npm ci --only=production

# Copy frontend source
COPY frontend/ ./

# Build frontend
RUN npm run build

# Stage 2: Production image
FROM node:18-alpine

# Install production dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    sqlite

# Create app user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install backend dependencies
RUN npm ci --only=production

# Copy backend source
COPY server.js ./
COPY api/ ./api/
COPY lib/ ./lib/

# Copy built frontend from builder stage
COPY --from=frontend-builder /app/frontend/build ./frontend/build

# Create data directories
RUN mkdir -p data modellab-data/datasets modellab-data/artifacts && \
    chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3001/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); })"

# Start server
CMD ["node", "server.js"]
