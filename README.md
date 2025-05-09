# 📘 Keymono

Keymono is a backend service built with **Node.js**, **Express**, and **TypeScript**, designed for managing loan-related operations with environment-based configurations and a clean development workflow.

---

# 🛠️ Tech Stack: Node.js + Express + TypeScript

## ✅ Prerequisites

- **Node.js**: Version `20.18.1` required  
  👉 [Download Node.js](https://nodejs.org/dist/v20.18.1/node-v20.18.1-x64.msi)  **or**  
  👉 [Download NVM for Windows](https://github.com/coreybutler/nvm-windows/releases/download/1.2.2/nvm-setup.exe)

To verify the version:

```bash
node -v
# Expected output: v20.18.1
```
---


## ⚙️ Local Setup

### 1. Install Dependencies

```bash
$ npm install
```

### 2. Configure Environment Variables
Create the following files in the project root:

.env.dev (Development)
```bash
PORT=3000
NODE_ENV=development
DB_URL=dbUrl
DB_NAME=dbname
```

.env.prod (Production)
```bash
PORT=3000
NODE_ENV=production
DB_URL=dbUrl
DB_NAME=dbname
```

### 3. Compile and Run the Project

```bash
# development mode 
$ npm run dev

# production mode
$ npm run prod
```

### 4. Generate Build

```bash
$ npm run build
```


## 📂 Project Structure

```bash
keymono/
├── client           # Frontend application (React + Vite + TS)
├── dist/            # Contains the production-ready bundled files for deployment.
├── node_modules/    # Stores all the dependencies required by the project.
├── src/             # Backend/Server Source code
│   ├── configs/     # Environment configs, DB config, etc.
│   ├── controllers/ # Route handler logic
│   ├── middlewares/ # Express middlewares (auth, error handling, etc.)
│   ├── routes/      # Express route definitions
│   ├── services/    # Business logic, third-party integrations
│   ├── utils/       # Helper utilities
│   └── server.ts    # Entry point for Express app
├── .env.dev         # Development environment variables
├── .env.prod        # Production environment variables
├── .gitignore       # Files and folders to ignore in Git
├── package.json     # PRoot project metadata and backend dependencies
├── tsconfig.json    # TypeScript configuration
└── README.md        # Project documentation


📦 The client/ directory contains the frontend application built with React.js + Vite + TypeScript. Refer to its README for setup.
```
---
<br />
<br />

# 📘 Keymono - Frontend

Keymono Frontend is a modern web application built with **React**, **Vite**, and **TypeScript**, providing a responsive and intuitive user interface for managing loan-related workflows.

---

# 🛠️ Tech Stack: React (Vite + TypeScript)

## ✅ Prerequisites

- **Node.js**: Version `20.18.1` required  
  👉 [Download Node.js](https://nodejs.org/dist/v20.18.1/node-v20.18.1-x64.msi)  **or**  
  👉 [Download NVM for Windows](https://github.com/coreybutler/nvm-windows/releases/download/1.2.2/nvm-setup.exe)

To verify the version:

```bash
node -v
# Expected output: v20.18.1
```
---


## ⚙️ Local Setup

### 1. Install Dependencies

```bash
$ npm install
```

### 2. Configure Environment Variables
Create the following files in the project client/ directory:

.env
```bash
VITE_API_BASE_URL=http://localhost:3000
```

### 3. Compile and Run the Project

```bash
$ npm run dev
```

### 4. Generate Build

```bash
$ npm run build
```
## 📂 Project Structure

```bash
keymono/
└── client/                       # Frontend application (React + Vite + TypeScript)
    ├── dist/                     # Contains the production-ready bundled files for deployment.
    ├── node_modules/             # Stores all the dependencies required by the project.
    ├── public/                   # Static assets (favicon, index.html, etc.)
    ├── src/                      # Application source code
    │   ├── api/                  # API services / Axios instances
    │   ├── assets/               # Images, fonts, static media
    │   ├── components/           # Reusable UI components
    │   ├── configs/              # App-level configuration (env, constants)
    │   ├── context/              # React Contexts (e.g., AuthContext)
    │   ├── hooks/                # Custom React hooks
    │   ├── models/               # TypeScript interfaces / data models
    │   ├── pages/                # Route-level components / screens
    │   ├── redux/                # Redux store, slices, actions
    │   ├── types/                # Global TypeScript types/interfaces
    │   ├── utils/                # Utility functions (pure logic)
    │   ├── App.css               # Global styles
    │   ├── App.tsx               # Root component
    │   ├── index.css             # Entry-point styles
    │   ├── index.tsx             # React DOM entry point
    │   ├── main.tsx              # Wraps App with providers (e.g., Router, Redux)
    │   └── vite-env.d.ts         # Vite environment types
    ├── .env                      # Default environment variables
    ├── .gitignore                # Files/folders to ignore in version control
    ├── eslint.config.js          # ESLint configuration
    ├── index.html                # Main HTML template
    ├── package.json              # Frontend dependencies and scripts
    ├── README.md                 # Frontend-specific documentation
    ├── tsconfig.app.json         # TypeScript config for app code
    ├── tsconfig.json             # Root TypeScript config
    ├── tsconfig.node.json        # TS config for Node-related tooling (like Vite)
    └── vite.config.ts            # Vite configuration

📦 The client/ directory contains the frontend application built with React (Vite + TypeScript).
```
---#   l o a n d e s k  
 