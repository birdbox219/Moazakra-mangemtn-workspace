# Moazakra Workspace Management System

A web-based workspace management application built with **ASP.NET Web API (.NET 8)** backend and **React + TypeScript + Vite** frontend.

> **Note:** The `master` branch contains the original WinForms desktop version. This `web-app` branch is the migrated web version.

## Prerequisites

Make sure you have the following installed:

| Tool | Version | Download |
|------|---------|----------|
| .NET 8 SDK | 8.0+ | [download](https://dotnet.microsoft.com/download/dotnet/8.0) |
| Node.js | 18+ | [download](https://nodejs.org/) |
| SQL Server | Any edition (Express is fine) | [download](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) |

## Setup Instructions

### 1. Clone the repo and switch to the web-app branch

```bash
git clone https://github.com/birdbox219/Moazakra-mangemtn-workspace.git
cd Moazakra-mangemtn-workspace
git checkout web-app
```

### 2. Set up the database

Open **SQL Server Management Studio (SSMS)** or **Azure Data Studio** and run the script:

```
database-setup.sql
```

This will create the `WorkspaceDB` database and all required tables.

> **Tip:** Uncomment the sample data section at the bottom of the script if you want test data.

### 3. Update connection string (if needed)

The default connection string in `appsettings.json` is:

```json
"Server=.;Database=WorkspaceDB;Trusted_Connection=True;TrustServerCertificate=True;"
```

- `Server=.` means local SQL Server. If yours is named differently (e.g., `.\SQLEXPRESS`), update it.
- `Trusted_Connection=True` uses Windows Authentication. No password needed.

### 4. Run the Backend (ASP.NET API)

```bash
dotnet restore
dotnet run
```

The API will start at `https://localhost:5001` (or check the console output for the exact port).

### 5. Run the Frontend (React)

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

The frontend will start at `http://localhost:5173`.

### 6. Open the app

Go to **http://localhost:5173** in your browser. Done!

## Running in Visual Studio (alternative)

1. Open `WebApplication1.sln` in Visual Studio 2022
2. Make sure the database is set up (step 2 above)
3. Press **F5** to run the backend
4. Open a terminal in the `frontend` folder and run `npm install && npm run dev`

## Project Structure

```
├── Controllers/          # API Controllers (Members, Workspaces, Equipment, Reservations)
├── Data/                 # DatabaseService (ADO.NET with SQL Server)
├── Models/               # Data models (Member, Workspace, Hub, Equipment, Reservation)
├── frontend/             # React + TypeScript + Vite frontend
│   ├── src/
│   │   ├── components/   # React components for each entity
│   │   ├── api.ts        # API client
│   │   └── App.tsx       # Main app component
│   └── package.json
├── Program.cs            # ASP.NET entry point
├── appsettings.json      # Configuration (connection string)
├── database-setup.sql    # SQL script to create the database
└── WebApplication1.sln   # Solution file
```

## Team Members

Mahmoud Elsayed Musa
i dont remmber the rest of my team names so consider they are written here
copyright ->>>>>>>>>>>> code Arts team

