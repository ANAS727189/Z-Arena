# Stage 1: Build dependencies and compiler
FROM node:20 AS builder

# Installing build tools, LLVM, and Node.js development headers
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      llvm-dev \
      python3 \
      make \
      g++ \
      cmake \
      libnode-dev \
 && rm -rf /var/lib/apt/lists/*

# Set working directory for server
WORKDIR /app/server
COPY server/package.json server/package-lock.json ./
RUN npm ci

# Set working directory for compiler
WORKDIR /app/Compiler
COPY Compiler/package.json ./package.json
COPY Compiler/package-lock.json ./package-lock.json
RUN npm ci --ignore-scripts



# Manually copy node_api.h to cmake-js header directory
RUN mkdir -p /root/.cmake-js/node-x64/v20.0.0/include/node && \
    cp /usr/include/node/node_api.h /root/.cmake-js/node-x64/v20.0.0/include/node/ || \
    cp /usr/include/nodejs/src/node_api.h /root/.cmake-js/node-x64/v20.0.0/include/node/ || \
    echo "Failed to copy node_api.h"

# Compile llvm-bindings using cmake-js
RUN npm run compile-llvm --prefix .

# Copy compiler source
COPY Compiler/src ./src

# Stage 2: Final runtime 
FROM node:20-slim

RUN apt-get update && \
    apt-get install -y --no-install-recommends llvm && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app/server
COPY --from=builder /app/server/node_modules ./node_modules
COPY server/ .

WORKDIR /app
COPY --from=builder /app/Compiler ./Compiler

ENV COMPILER_PATH=/app/Compiler/src/index.js

CMD ["node", "server/src/server.js"]

