USE WorkspaceDB;
GO

-- ============================================
-- STEP 1: Edit Member table
-- ============================================

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Member') AND name = 'FName')
ALTER TABLE Member ADD FName NVARCHAR(100);
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Member') AND name = 'LName')
ALTER TABLE Member ADD LName NVARCHAR(100);
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Member') AND name = 'NickName')
ALTER TABLE Member ADD NickName NVARCHAR(100);
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Member') AND name = 'DigitalID')
ALTER TABLE Member ADD DigitalID NVARCHAR(100);
GO

-- Copy old Name into FName then drop Name
UPDATE Member SET FName = Name WHERE FName IS NULL;
GO

IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Member') AND name = 'Name')
ALTER TABLE Member DROP COLUMN Name;
GO

-- ============================================
-- STEP 2: Edit Hub table
-- ============================================

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Hub') AND name = 'Street')
ALTER TABLE Hub ADD Street NVARCHAR(150);
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Hub') AND name = 'City')
ALTER TABLE Hub ADD City NVARCHAR(100);
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Hub') AND name = 'District')
ALTER TABLE Hub ADD District NVARCHAR(100);
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Hub') AND name = 'Building')
ALTER TABLE Hub ADD Building NVARCHAR(150);
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Hub') AND name = 'Layout')
ALTER TABLE Hub ADD Layout NVARCHAR(100);
GO

-- ============================================
-- STEP 3: Create MemberPhone table
-- ============================================

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'MemberPhone')
BEGIN
CREATE TABLE MemberPhone (
    PhoneID     INT IDENTITY(1,1) PRIMARY KEY,
    MemberID    INT NOT NULL,
    PhoneNumber NVARCHAR(20) NOT NULL,
    FOREIGN KEY (MemberID) REFERENCES Member(MemberID) ON DELETE CASCADE
);
END
GO

-- ============================================
-- STEP 4: Create ReservationEquipment table
-- ============================================

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ReservationEquipment')
BEGIN
CREATE TABLE ReservationEquipment (
    ReservationID INT NOT NULL,
    EquipmentID   INT NOT NULL,
    HoursUsed     INT NOT NULL DEFAULT 0,
    PRIMARY KEY (ReservationID, EquipmentID),
    FOREIGN KEY (ReservationID) REFERENCES Reservation(ReservationID) ON DELETE CASCADE,
    FOREIGN KEY (EquipmentID)   REFERENCES Equipment(EquipmentID)     ON DELETE CASCADE
);
END
GO

PRINT 'Migration complete!';
GO
