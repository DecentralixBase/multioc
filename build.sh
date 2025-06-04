#!/bin/bash
echo "Starting build process..."
npm install
echo "Dependencies installed. Building project..."
npx vite build
echo "Build completed." 