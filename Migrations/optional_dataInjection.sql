USE WorkspaceDB;
GO

/* ============================================
   1. HUBS
============================================ */

INSERT INTO Hub
(Name, Street, City, District, Building, Layout)
VALUES
('Downtown Hub', '26 Talaat Harb St', 'Cairo', 'Downtown', 'Nile Tower', 'Open Space'),
('Smart Village Hub', 'Smart Village Rd', 'Giza', '6th October', 'Building A2', 'Hybrid'),
('Nasr City Hub', 'Makram Ebeid', 'Cairo', 'Nasr City', 'Sky Plaza', 'Private Offices'),
('Maadi Hub', 'Road 9', 'Cairo', 'Maadi', 'Green Building', 'Collaborative'),
('Alex Hub', 'Corniche Road', 'Alexandria', 'Stanley', 'Sea View Tower', 'Open Space');

GO


/* ============================================
   2. MEMBERS
============================================ */

INSERT INTO Member
(FName, LName, NickName, DigitalID, Email, Company)
VALUES
('Ahmed','Ali','ahmed','DG1001','ahmed@techcorp.com','TechCorp'),
('Sara','Hassan','sara','DG1002','sara@designhub.com','DesignHub'),
('Omar','Khaled','omar','DG1003','omar@startupx.com','StartupX'),
('Mona','Youssef','mona','DG1004','mona@finbank.com','FinBank'),
('Karim','Nabil','karim','DG1005','karim@medisoft.com','MediSoft'),
('Laila','Samir','laila','DG1006','laila@creative.io','CreativeIO'),
('Hany','Tarek','hany','DG1007','hany@devhouse.com','DevHouse'),
('Nour','Ashraf','nour','DG1008','nour@futureai.com','FutureAI'),
('Yara','Adel','yara','DG1009','yara@consultpro.com','ConsultPro'),
('Mostafa','Maher','mostafa','DG1010','mostafa@cloudsys.com','CloudSys');

GO


/* ============================================
   3. MEMBER PHONES
============================================ */

INSERT INTO MemberPhone
(MemberID, PhoneNumber)
VALUES
(1,'01010000001'),
(1,'01110000001'),
(2,'01010000002'),
(3,'01010000003'),
(4,'01010000004'),
(5,'01010000005'),
(6,'01010000006'),
(7,'01010000007'),
(8,'01010000008'),
(9,'01010000009'),
(10,'01010000010');

GO


/* ============================================
   4. WORKSPACES
============================================ */

INSERT INTO Workspace
(Type, Price, Capacity, HubID)
VALUES
('Open Desk',150,1,1),
('Open Desk',150,1,1),
('Private Office',700,4,1),
('Meeting Room',400,8,1),

('Open Desk',180,1,2),
('Private Office',900,6,2),
('Meeting Room',500,10,2),

('Open Desk',160,1,3),
('Private Office',750,3,3),

('Meeting Room',450,12,4),
('Open Desk',140,1,4),

('Private Office',800,5,5);

GO


/* ============================================
   5. EQUIPMENT
============================================ */

INSERT INTO Equipment
(Name, Type)
VALUES
('Projector','Electronics'),
('Whiteboard','Office'),
('Monitor 27 inch','Electronics'),
('Laptop Stand','Furniture'),
('Conference Camera','Electronics'),
('Microphone Set','Electronics'),
('Printer','Office'),
('HDMI Adapter','Accessory');

GO


/* ============================================
   6. RESERVATIONS
   spread across multiple months
============================================ */

INSERT INTO Reservation
(MemberID, WorkspaceID, StartDate, EndDate, Status)
VALUES
(1,1,'2026-01-05 09:00','2026-01-05 17:00','Confirmed'),
(2,3,'2026-01-12 09:00','2026-01-15 17:00','Confirmed'),
(3,4,'2026-01-18 10:00','2026-01-18 12:00','Completed'),

(4,5,'2026-02-03 09:00','2026-02-03 17:00','Confirmed'),
(5,6,'2026-02-10 09:00','2026-02-12 17:00','Completed'),
(6,7,'2026-02-20 13:00','2026-02-20 16:00','Confirmed'),

(7,8,'2026-03-02 09:00','2026-03-02 17:00','Completed'),
(8,9,'2026-03-08 09:00','2026-03-10 17:00','Confirmed'),
(9,10,'2026-03-12 14:00','2026-03-12 16:00','Confirmed'),

(10,11,'2026-04-05 09:00','2026-04-05 17:00','Completed'),
(1,12,'2026-04-15 09:00','2026-04-18 17:00','Confirmed'),

(2,1,'2026-05-01 09:00','2026-05-01 17:00','Confirmed'),
(3,2,'2026-05-03 09:00','2026-05-03 17:00','Confirmed'),
(4,3,'2026-05-07 09:00','2026-05-09 17:00','Pending'),
(5,4,'2026-05-08 11:00','2026-05-08 13:00','Confirmed'),
(6,5,'2026-05-10 09:00','2026-05-10 17:00','Confirmed'),
(7,6,'2026-05-11 09:00','2026-05-12 17:00','Confirmed'),
(8,7,'2026-05-13 12:00','2026-05-13 15:00','Completed'),
(9,8,'2026-05-14 09:00','2026-05-14 17:00','Confirmed'),
(10,9,'2026-05-15 09:00','2026-05-16 17:00','Pending');

GO


/* ============================================
   7. RESERVATION EQUIPMENT
============================================ */

INSERT INTO ReservationEquipment
(ReservationID, EquipmentID, HoursUsed)
VALUES
(1,1,4),
(1,2,8),

(2,1,6),
(2,3,10),

(3,5,2),

(4,7,5),

(5,1,8),
(5,6,8),

(6,2,3),

(7,3,6),

(8,1,12),
(8,4,12),

(9,5,2),

(10,7,6),

(11,1,20),
(11,2,20),

(12,3,8),

(13,4,8),

(14,1,10),

(15,5,2),

(16,2,8),

(17,3,16),

(18,6,3),

(19,1,8),

(20,7,10);

GO