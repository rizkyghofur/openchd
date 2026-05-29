#!/bin/bash
# OpenCHD Installation Script
# ============================

echo "Installing OpenCHD dependencies..."

# Check for npm/node
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is required but not installed."
    exit 1
fi

# Install pnpm if not available
if ! command -v pnpm &> /dev/null; then
    echo "Installing pnpm..."
    npm install -g pnpm
fi

# Install dependencies
echo "Installing project dependencies..."
pnpm install

# Build shared packages first
echo "Building packages..."
pnpm build

echo ""
echo "Installation complete!"
echo ""
echo "To start development:"
echo "  pnpm dev"
echo ""
echo "To build for production:"
echo "  pnpm build"