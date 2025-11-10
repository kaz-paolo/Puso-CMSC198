# Title

## Overview

Description

## Other Links

- **Figma Mockup**: [View Design File](https://www.figma.com/design/FvVDrJhLVxRPhs8Tk7Y3RC/Mockup-Draft?node-id=0-1&t=4THzSBLInwln5jKt-1)
- **Overleaf Latex**: 

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd cmsc198
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
   - Create `.env` with Firebase configuration:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Start development server
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint checks
- `npm run preview` - Preview production build locally

## Tech Stack

### Frontend
- **React** (v19.1.1) - UI library
- **Vite** (v7.1.7) - Build tool and dev server
- **React Router DOM** (v7.9.5) - Client-side routing
- **Mantine** (v8.3.7) - UI component library

### Backend
- **Firebase** (v12.5.0)'

### Developmentt Tools
- **Vite PWA Plugin** (v1.1.0) - Progressive Web App support

## Project Structure

```
.
├── .vscode/                 # VS Code settings
├── firebase/                # Firebase configuration
│   ├── functions/          # Cloud Functions
│   │   ├── index.js
│   │   └── package.json
│   ├── database.rules.json # Realtime Database rules
│   ├── firebase.js         # Firebase SDK initialization
│   ├── firestore.rules     # Firestore security rules
│   ├── firestore.indexes.json
│   └── storage.rules       # Cloud Storage rules
├── src/                     # Source code
│   ├── assets/             # Images, fonts, etc.
│   ├── pages/              # Page components
│   ├── App.jsx             # Main app component with routing
│   └── main.jsx            # Entry point
├── .env                    # Environment variables for firebase config
├── .firebaserc             # Firebase project config
├── .gitignore
├── eslint.config.js        # ESLint config
├── firebase.json           # Firebase config
├── index.html              # Main HTML file
├── package.json
├── README.md
└── vite.config.js          # Vite & PWA config
```