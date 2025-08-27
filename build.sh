#!/bin/bash
# Build script for Render

# Install dependencies
npm install

# Build the application
npm run build

# Serve static files (using sirv-cli)
npm install -g sirv-cli
sirv dist --port $PORT --host 0.0.0.0 --single
