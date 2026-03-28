# PULSO (Pahinungod Unified Lingkod System for Operations)

## Overview

PULSO is a web-based volunteer and event management system designed for the UP Visayas Ugnayan ng Pahinungód. This platform streamlines the process of volunteer application, event management, task delegation, resource sharing, and post-event evaluations for both administrators and student volunteers.

---

## Important Links

- **Figma Mockup:** [View Design File](https://www.figma.com/design/FvVDrJhLVxRPhs8Tk7Y3RC/Mockup-Draft?node-id=0-1&t=4THzSBLInwln5jKt-1)
- **Overleaf Latex:**

---

## Tech Stack

- **Frontend:** React.js, Vite, Mantine UI, React Router
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (containerized via Docker)
- **Authentication:** Custom JWT-based Authentication

---

## Architecture Design

The backend API follows a modular, 3-tier architecture:

1. **`*.routes.js` (Routes):** Defines the API endpoints and HTTP methods. Parses the incoming request and maps it to the appropriate controllers.
2. **`*.controller.js` (Controllers):** Handles HTTP request/response logic. Extracts parameters/body data, performs basic validation, calls the necessary service function, and formats the JSON response or error.
3. **`*.service.js` (Services):** Contains the core business logic and executes direct database interactions/queries using PostgreSQL.

---

## Directory Structure & File Overview

### Backend (`/backend`)

The backend is built with Node.js and Express:

- **`server.js`:** The main application entry point. It sets up the Express server, configures global middleware (CORS, Helmet, Morgan for logging), mounts all API routes, and triggers the database initialization.
- **`config/db.js`:** Manages the PostgreSQL database connection pool.
- **`schema/initDb.js`:** A startup script that ensures all necessary relational database tables exist.
- **`auth/`:** Holds the custom authentication.
- **`modules/`:** The core business domains of the application:
  - **`users/`:** user profiles, directory data, and individual dashboard statistics.
  - **`events/`:** core event functions, volunteer role assignments, task boards, and file resources.
  - **`evaluation/`:**post-event survey forms, and internal volunteer feedback.

### Frontend (`/frontend`)

The frontend is a Vite-powered React Single Page Application (SPA):

- **`src/main.jsx` & `src/App.jsx`:** The React DOM root. `App.jsx` constructs the visual layout, establishes the React Router definitions, and wraps the app in layout components and global providers.
- **`src/auth.js`:** A client-side fetch wrapper, used to cmmunicate with our custom backend `/api/auth`endpoints, managing local storage tokens.
- **`src/contexts/AuthContext.jsx`:** Holds the active user's session state and role globally.
- **`src/pages/`:** The main route views of the application.
- **`src/components/`:** Modular, reusable UI elements.
- **`src/hooks/`:** Custom React hooks handling business logic.

### Infrastructure

- **`docker-compose.yml`:** Provisioning of a local PostgreSQL database instance and volume mounting for local development.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- npm or yarn package manager
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for running the local database)

---

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Puso-CMSC198
   ```

2. **Start the Database**

   Ensure Docker is running, then spin up the PostgreSQL container:

   ```bash
   docker compose up -d
   ```

3. **Install Dependencies**

   Install packages for both the backend root and the frontend application:

   ```bash
   # In the root project directory (Backend)
   npm install

   # In the frontend directory
   cd frontend
   npm install
   ```

4. **Start the Development Servers**
   - **Terminal 1 - Run Backend Server:**

     ```bash
     # From the root directory
     npm run dev
     ```

   - **Terminal 2 - Run Frontend Server:**
     ```bash
     cd frontend
     npm run dev
     ```

5. **Access the App**

   Open your browser and navigate to: [http://localhost:5173](http://localhost:5173)

---

## Connecting to the Database via Cloudflared Tunnel

To connect directly to the remote database:

1. **Install cloudflared**

   Download and install cloudflared:
   [Install cloudflared](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/downloads/)

2. **Open the Tunnel Connection**

   In your terminal, run:

   ```bash
   cloudflared access tcp --hostname /insertlink/ --url localhost:5433
   ```

   - Replace `/insertlink/` with the actual hostname/link

   **Note:**
   - You must keep this terminal window open in the background while you work. Closing it will sever the connection.

## Available Scripts

### Root (Backend)

- `npm run dev`: Starts the backend server utilizing nodemon for hot-reloading.
- `npm run start`: Runs the backend server in standard Node (for production).

### Frontend (`/frontend`)

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Compiles the React application for production deployment.
- `npm run lint`: Runs ESLint to check for code formatting and standard issues.
- `npm run preview`: Previews the production build locally.
