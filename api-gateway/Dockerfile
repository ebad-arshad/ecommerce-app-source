# Stage 1
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

# ---------------------------------------------------------

# Stage 2
FROM gcr.io/distroless/nodejs20-debian12
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/index.js ./index.js
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/config ./config
COPY --from=builder /app/middlewares ./middlewares

# Use the built-in non-privileged user for security
EXPOSE 5000
USER nonroot

# Start the app directly. Note: No "npm start" here!
CMD ["index.js"]