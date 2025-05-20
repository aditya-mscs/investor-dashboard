# Investor Dashboard

A full-stack TypeScript web application built with **Next.js App Router**, **PostgreSQL**, **Jest**, and **React Testing Library**, designed to allow partners to securely input investor details and upload documents.

---

## 🚀 Features
- Submit investor details via a form
- File uploads with progress (supports files > 3MB)
- Authentication using Bearer token
- Detect and update existing investor by SSN
- PostgreSQL for relational data storage
- RESTful API built with Next.js App Router
- Fully tested using Jest + React Testing Library

---

## 🗂 Project Structure
```
📁 src
 ├── app             # Next.js app router pages/api
 │   ├── api         # Backend API logic (POST/GET investors)
 │   ├── page.tsx    # Main UI page
 │   └── __tests__   # Jest test cases for the UI
 ├── db
 │   ├── pool.ts     # DB connection using pg
 │   └── seed.ts     # Create investors table
└── public/uploads   # Stores uploaded files
```

---

## 🧰 Prerequisites
- Node.js (18+ recommended)
- PostgreSQL installed and running

---

## ⚙️ Environment Setup

1. **Clone the repo**
```bash
git clone <repo-url>
cd investor-dashboard
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file**
```env
DB_USER=your_user
DB_HOST=localhost
DB_NAME=investor_dashboard
DB_PASSWORD=your_password
DB_PORT=5432
API_AUTH_TOKEN=secure-mock-token
```

4. **Start PostgreSQL (macOS using brew)**
```bash
npm run startdb
```
> This starts PostgreSQL using brew services


**Seed the Database**
```bash
npm run seeddb
```
> This will create the `investors` table using `src/db/seed.ts`

5. **Start the Dev Server**
```bash
npm run dev
```
> Visit [http://localhost:3000](http://localhost:3000)

---

## 🧪 Running Tests

1. **Run All Tests**
```bash
npm run test
```

2. **Test Structure**
- `src/app/__tests__/page.test.tsx`: Renders UI, simulates form submission, handles errors and success.

---

## ✅ API Endpoints

### POST /api/investor
- Upload investor data + file
- Requires Bearer token in header
- Detects existing SSN and updates address/file

### GET /api/investor
- Returns count of total investors

### DELETE /api/investor?ssn=...
- Deletes investor by SSN

---

## 📄 Investor Fields
- firstName
- lastName
- dob
- phone
- street
- state
- zip
- ssn (used to detect duplicates)
- document (uploaded file)

---

## 🧠 Notes
- Uploaded files go to `public/uploads`
- Input validation (phone, email, file size)
- JWT auth can be integrated later

---

## 🔧 Scripts
```json
"dev": "next dev",
"build": "next build",
"start": "next start",
"test": "jest",
"seeddb": "ts-node src/db/seed.ts"
```

---

## 📫 Questions?
Email: aditya.mscs@gmail.com or open an issue in the repo.
