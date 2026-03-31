#!/bin/bash

echo "🚀 FlowTest Setup Script"
echo "========================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'.' -f1 | sed 's/v//')
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18 or higher. Current: $(node -v)"
    exit 1
fi

echo "✓ Node.js $(node -v) detected"
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Backend installation failed"
    exit 1
fi
cd ..
echo "✓ Backend dependencies installed"
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Frontend installation failed"
    exit 1
fi
cd ..
echo "✓ Frontend dependencies installed"
echo ""

echo "✅ Setup complete!"
echo ""
echo "To start FlowTest:"
echo ""
echo "  Terminal 1:"
echo "    cd backend && npm start"
echo ""
echo "  Terminal 2:"
echo "    cd frontend && npm run dev"
echo ""
echo "  Then open: http://localhost:5173"
echo ""
echo "Happy testing! 🎯"
