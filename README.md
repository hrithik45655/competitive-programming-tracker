# Competitive Programming Tracker (CPT)

A production-grade analytics, spaced-repetition, and skill-progression platform for competitive programmers.

## 🎯 Core Features

- **Spaced Repetition System**: Automatically calculates when you need to revise problems based on difficulty and your confidence level using the SuperMemo-2 inspired algorithm.
- **Advanced Analytics Engine**: Tracks your total solved problems, daily solving streaks, confidence distribution, and difficulty spread across different competitive programming platforms.
- **Priority Recommendations Engine**: A smart algorithm that tells you exactly what topic or specific problem you need to practice next to become a better programmer.
- **Modern UI/UX**: A GitHub/Linear-inspired interface featuring a complete Dark/Light mode, built with the bleeding-edge Tailwind CSS v4 and Recharts.

## 🏗️ Architecture & Tech Stack

- **Frontend**: React.js, Vite, React Router, Tailwind CSS v4, Recharts, Lucide React, Axios.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT authentication.
- **Architecture**: Strict Separation of Concerns (`Routes` -> `Controllers` -> `Services` -> `Models`).

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (v18+)
- MongoDB running locally on `localhost:27017` (or provide a remote URI).

### 2. Environment Setup
Create a `.env` file in the root of the project:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cp-tracker
JWT_SECRET=your-super-secret-jwt-key
```

### 3. Install Dependencies
```bash
# Install root, backend, and frontend dependencies
npm install
cd server && npm install
cd ../client && npm install
```

### 4. Seed the Database
Populate your local database with dummy users, problems, and spaced repetition queues:
```bash
npm run seed
```
*(The seed script creates a test user: Email: `demo@cptracker.com` / Password: `password123`)*

### 5. Run the Application
Start both the backend server and frontend Vite development server concurrently:
```bash
npm run dev
```

Navigate to `http://localhost:5173` to view the application!
