-- ============================================
-- WorkspaceDB - Database Setup Script
-- Run this in SQL Server Management Studio (SSMS)
-- or any SQL Server query tool before running the app
-- ============================================

-- Step 1: Create the database
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'WorkspaceDB')
BEGIN
    CREATE DATABASE WorkspaceDB;
END
GO

USE WorkspaceDB;
GO

-- Step 2: Create tables

-- Hub table (must be created first, Workspace references it)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Hub')
BEGIN
    CREATE TABLE Hub (
        HubID INT IDENTITY(1,1) PRIMARY KEY,
        Name NVARCHAR(100) NOT NULL
    );
END
GO

-- Member table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Member')
BEGIN
    CREATE TABLE Member (
        MemberID INT IDENTITY(1,1) PRIMARY KEY,
        Name NVARCHAR(100) NOT NULL,
        Email NVARCHAR(150) NOT NULL,
        Company NVARCHAR(100) NOT NULL
    );
END
GO

-- Workspace table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Workspace')
BEGIN
    CREATE TABLE Workspace (
        WorkspaceID INT IDENTITY(1,1) PRIMARY KEY,
        Type NVARCHAR(50) NOT NULL,
        Price DECIMAL(10, 2) NOT NULL,
        Capacity INT NOT NULL,
        HubID INT NOT NULL,
        FOREIGN KEY (HubID) REFERENCES Hub(HubID)
    );
END
GO

-- Equipment table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Equipment')
BEGIN
    CREATE TABLE Equipment (
        EquipmentID INT IDENTITY(1,1) PRIMARY KEY,
        Name NVARCHAR(100) NOT NULL,
        Type NVARCHAR(50) NOT NULL
    );
END
GO

-- Reservation table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Reservation')
BEGIN
    CREATE TABLE Reservation (
        ReservationID INT IDENTITY(1,1) PRIMARY KEY,
        MemberID INT NOT NULL,
        WorkspaceID INT NOT NULL,
        StartDate DATETIME NOT NULL,
        EndDate DATETIME NOT NULL,
        Status NVARCHAR(50) NOT NULL,
        FOREIGN KEY (MemberID) REFERENCES Member(MemberID),
        FOREIGN KEY (WorkspaceID) REFERENCES Workspace(WorkspaceID)
    );
END
GO

-- Step 3: Insert sample data (optional)
-- Uncomment the lines below if you want some test data

/*
INSERT INTO Hub (Name) VALUES ('Downtown Hub'), ('Tech Park Hub'), ('University Hub');

INSERT INTO Member (Name, Email, Company) VALUES 
    ('Ahmed Ali', 'ahmed@example.com', 'TechCorp'),
    ('Sara Hassan', 'sara@example.com', 'DesignStudio'),
    ('Omar Khaled', 'omar@example.com', 'StartupX');

INSERT INTO Workspace (Type, Price, Capacity, HubID) VALUES 
    ('Private Office', 500.00, 4, 1),
    ('Open Desk', 150.00, 1, 1),
    ('Meeting Room', 300.00, 10, 2);

INSERT INTO Equipment (Name, Type) VALUES 
    ('Projector', 'Electronics'),
    ('Whiteboard', 'Office'),
    ('Laptop Stand', 'Furniture');

INSERT INTO Reservation (MemberID, WorkspaceID, StartDate, EndDate, Status) VALUES 
    (1, 1, '2026-05-10', '2026-05-15', 'Confirmed'),
    (2, 2, '2026-05-11', '2026-05-12', 'Pending');
*/

PRINT 'Database setup complete!';
GO
