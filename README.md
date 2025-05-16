# 🚀 ALoanMatic

<div align="center">
  
![ALoanMatic Logo](https://via.placeholder.com/150/3498db/FFFFFF?text=ALoanMatic)

**A modern loan management system built with Node.js, Express, and TypeScript**

[![Node.js Version](https://img.shields.io/badge/node-v20.18.1-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.2-blue.svg)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.18.2-lightgrey.svg)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-18.2.0-61dafb.svg)](https://reactjs.org/)
[![Redis](https://img.shields.io/badge/Redis-7.0-red.svg)](https://redis.io/)

</div>

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Project Structure](#-project-structure)
- [Redis Configuration](#-redis-configuration)
- [Development Workflow](#-development-workflow)
- [Deployment](#-deployment)

## 🛠️ Tech Stack

### Backend

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **Redis** - In-memory data store

### Frontend

- **React** - UI library
- **Vite** - Build tool
- **TypeScript** - Type safety

## ✅ Prerequisites

- **Node.js**: `v20.18.1` (required)

  ```bash
  # Verify installation
  node -v
  # Expected output: v20.18.1
  ```

- **Installation Options**:
  - Direct download: [nodejs.org](https://nodejs.org/)
  - Using NVM (recommended): [nvm-windows](https://github.com/coreybutler/nvm-windows)

## 🚀 Getting Started

### Backend Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/aLoanMatic.git
   cd aLoanMatic
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**

   Create `.env.dev` for development:

   ```
   PORT=3000
   NODE_ENV=development
   DB_URL=dbUrl
   DB_NAME=dbname
   ```

   Create `.env.prod` for production:

   ```
   PORT=3000
   NODE_ENV=production
   DB_URL=dbUrl
   DB_NAME=dbname
   ```

4. **Run the project**

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm run prod
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

### Frontend Setup

1. **Navigate to client directory**

   ```bash
   cd client
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**

   Create `.env`:

   ```
   VITE_API_BASE_URL=http://localhost:3000
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 📂 Project Structure

### Backend Structure

```
aLoanMatic/
├── client/           # Frontend application
├── dist/             # Compiled production files
├── src/              # Backend source
│   ├── configs/      # Config files
│   ├── controllers/  # Route handlers
│   ├── middlewares/  # Middleware logic
│   ├── routes/       # API routes
│   ├── services/     # Business logic
│   ├── utils/        # Helpers
│   └── server.ts     # Entry point
├── .env.dev
├── .env.prod
├── package.json
└── tsconfig.json
```

### Frontend Structure

```
client/
├── public/             # Static assets
├── src/
│   ├── api/            # Axios services
│   ├── components/     # Reusable UI components
│   ├── configs/        # App configs
│   ├── context/        # Context providers
│   ├── hooks/          # Custom hooks
│   ├── models/         # Interfaces/types
│   ├── pages/          # Screens/views
│   ├── redux/          # Store setup
│   ├── types/          # Global types
│   ├── utils/          # Helpers
│   └── main.tsx        # App wrapper
├── .env
├── vite.config.ts
└── tsconfig.json
```

## 🔄 Redis Configuration

### Installation (Ubuntu)

```bash
curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg

echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list

sudo apt-get update
sudo apt-get install redis
```

### Authentication Setup

Configure Redis ACL (Access Control List):

```
# Open redis-cli or add to redis.conf
user default off
user hir on >pass ~\* +@all
```

This creates:

- A new user `hir` with password `pass`
- Full permissions (`+@all`)
- Disables the default user

## 💻 Development Workflow

1. **Start development servers**

   ```bash
   # Terminal 1 - Backend
   npm run dev

   # Terminal 2 - Frontend
   cd client && npm run dev
   ```

2. **Access the application**
   - Backend API: `http://localhost:3000`
   - Frontend UI: `http://localhost:5173`

## 🌐 Deployment

### Backend Deployment

1. Build the production files:

   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm run prod
   ```
