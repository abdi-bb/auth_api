# Node build stage
FROM docker.io/node:22-bookworm-slim AS node-build-stage

WORKDIR /app/frontend

# Copy frontend files, including package.json
COPY ./frontend/package.json ./

# Install dependencies
RUN npm install --include=dev

# Copy the remaining files
COPY ./frontend .

# build it
RUN npm run build

# Node 'run' stage
FROM docker.io/node:22-bookworm-slim AS node-run-stage

WORKDIR /app/frontend

# Install required system dependencies
RUN apt-get update && apt-get install --no-install-recommends -y \
    # Add any necessary dependencies here
    wait-for-it \
    # cleaning up unused files
    && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
    && rm -rf /var/lib/apt/lists/*

# Copy build artifacts and node_modules from the build stage
COPY --from=node-build-stage /app/frontend .

# Add scripts for entrypoint and start
COPY --chown=node:node ./compose/production/next/entrypoint /entrypoint
RUN sed -i 's/\r$//g' /entrypoint
RUN chmod +x /entrypoint

COPY --chown=node:node ./compose/production/next/start /start
RUN sed -i 's/\r$//g' /start
RUN chmod +x /start

# copy application code to WORKDIR
COPY . /app/frontend

# Expose port for standalone server
EXPOSE 3000

ENTRYPOINT ["/entrypoint"]
