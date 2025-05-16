# 📘 ALoanMatic

ALoanMatic Frontend is a modern web application built with **React**, **Vite**, and **TypeScript**, providing a responsive and intuitive user interface for managing loan-related workflows.

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
aLoanMatic/
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

---
.
# 🔧 Advanced ESLint Configuration

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
