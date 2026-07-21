# Stage 1: Build React Frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Flask Backend
FROM python:3.10-slim
WORKDIR /app

# Headless container setup (no graphical GUI dependencies required)

COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy source files
COPY backend/ ./backend/
COPY --from=frontend-builder /frontend/dist ./frontend/dist

# Create compatibility symlink inside /app/backend to handle cached --chdir backend commands
RUN cd ./backend && ln -s . backend

EXPOSE 8080
WORKDIR /app/backend
CMD sh -c "gunicorn --bind 0.0.0.0:${PORT:-8080} app:app"
