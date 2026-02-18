# Candidate Management App

A simple full-stack application for uploading and managing candidates using Excel files. Built with Angular 16+ frontend and NestJS backend.

## 🚀 Quick Start

### 1. Clone & Setup

```bash
# Clone the project
git clone <your-repo-url>
cd candidates-app

# Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with your database info

# Frontend setup
cd ../frontend
npm install
```

### 2. Database Setup

Create a PostgreSQL database:

- **Local**: Install PostgreSQL and create `candidates_db`
- **Cloud**: Use [Neon.tech](https://neon.tech) for free cloud database

Update `.env` file:

```env
DATABASE_URL=your_database_connection_url
```

### 3. Run the App

```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend
cd frontend
ng serve
```

### 4. Open Browser

Go to: `http://localhost:4200`

## 🎯 Features

### Frontend (Angular 16+)

- Simple form to add candidates
- Upload Excel file with candidate details
- View all candidates in a table
- Click to see candidate details
- Reactive Forms with validation
- Angular Material UI components

### Backend (NestJS)

- Saves candidates to PostgreSQL database
- Reads Excel files using XLSX library
- Full CRUD API operations
- File upload validation

## 📁 Project Structure

```
candidates-app/
├── backend/          # NestJS API server
├── frontend/         # Angular 16+ application
└── README.md
```

## 📄 Excel File Format

Create an Excel file with exactly 1 row:

| seniority | yearsOfExperience | availability |
| --------- | ----------------- | ------------ |
| junior    | 2                 | true         |

**Requirements:**

- Format: .xlsx or .xls
- Exactly 1 row of data
- Max file size: 1MB
- Columns must match exactly

## 🔧 API Endpoints

| Method | Endpoint             | Description                      |
| ------ | -------------------- | -------------------------------- |
| POST   | `/candidates/upload` | Create candidate with Excel file |
| GET    | `/candidates`        | Get all candidates               |
| GET    | `/candidates/:id`    | Get candidate by ID              |
| PUT    | `/candidates/:id`    | Update candidate                 |
| DELETE | `/candidates/:id`    | Delete candidate                 |

## 🗄️ Database Schema

```sql
CREATE TABLE candidates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    surname VARCHAR(255) NOT NULL,
    seniority VARCHAR(10) CHECK (seniority IN ('junior', 'senior')),
    years_of_experience INTEGER NOT NULL,
    availability BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🚀 Deploy to Render (Easy)

1. Go to [Render.com](https://render.com)
2. Create new project
3. Add PostgreSQL database
4. Connect your GitHub repo
5. Render deploys automatically on push

## 💡 Tips & Troubleshooting

- Use `.env.example` as template for environment variables
- Ensure ports 3000 (backend) and 4200 (frontend) are free
- Verify database connection in `.env` file
- Excel file must have exactly 1 row with correct columns
- Check browser console for errors

## 🛠️ Built With

- **Angular 16** - Frontend framework
- **NestJS** - Backend framework
- **PostgreSQL** - Database
- **Angular Material** - UI components
- **TypeORM** - Database ORM
- **XLSX** - Excel file processing

## 📋 Prerequisites

- Node.js 18+ & npm
- PostgreSQL 14+ (local or cloud)
- Angular CLI 16+
- NestJS CLI

---

**Note**: Technical test application for candidate management with Excel file processing.

**Start in 5 minutes**: Setup database → Install dependencies → Run both servers → Open `localhost:4200`
