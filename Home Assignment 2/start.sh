#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}  Mini Project Manager Startup${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# Kill any existing processes
echo -e "${YELLOW}Cleaning up existing processes...${NC}"
lsof -ti:5102 | xargs kill -9 2>/dev/null
lsof -ti:5173 | xargs kill -9 2>/dev/null
lsof -ti:5174 | xargs kill -9 2>/dev/null
sleep 2

# Start backend
echo -e "${GREEN}Starting Backend API...${NC}"
cd ProjectManagerAPI
dotnet run &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 5

# Start frontend
echo -e "${GREEN}Starting Frontend...${NC}"
cd project-manager-frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Wait a moment
sleep 3

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}  Both servers are starting!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo -e "${BLUE}Backend API:${NC}      http://localhost:5102"
echo -e "${BLUE}Swagger UI:${NC}       http://localhost:5102/swagger"
echo -e "${BLUE}Frontend:${NC}         http://localhost:5173 (or :5174)"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop both servers${NC}"
echo ""

# Wait for user interrupt
wait $BACKEND_PID $FRONTEND_PID
