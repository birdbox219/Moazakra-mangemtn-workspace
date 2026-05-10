USE WorkspaceDB;
GO

DELETE FROM ReservationEquipment;
DELETE FROM MemberPhone;
DELETE FROM Reservation;
DELETE FROM Equipment;
DELETE FROM Workspace;
DELETE FROM Member;
DELETE FROM Hub;
GO

-- reset identity counters
DBCC CHECKIDENT ('Hub', RESEED, 0);
DBCC CHECKIDENT ('Member', RESEED, 0);
DBCC CHECKIDENT ('Workspace', RESEED, 0);
DBCC CHECKIDENT ('Equipment', RESEED, 0);
DBCC CHECKIDENT ('Reservation', RESEED, 0);
DBCC CHECKIDENT ('MemberPhone', RESEED, 0);
GO