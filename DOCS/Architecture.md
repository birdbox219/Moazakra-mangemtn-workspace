# Application Architecture Documentation

## Overview
This application is built using a decoupled, layered architecture inspired by the **Model-View-Presenter (MVP)** pattern. It prioritizes modularity and testability by ensuring that UI components are independent of business logic and database access.

---

## 1. Core Architectural Layers

### **View Layer (Forms)**
- **Role:** Handles user interaction and data display.
- **Implementation:** Standard WinForms (e.g., `MemberForm`, `FormWorkspaces`).
- **Design Principle:** **Passive View**. Forms contain zero business logic. They capture user input and pass it to a controller, then update their display only when the controller signals a data change.

### **Logic Layer (Controllers)**
- **Role:** Orchestrates the flow of data between the UI and the Database.
- **Implementation:** Classes like `MembersController` and `EquipmentController`.
- **Interface:** All controllers implement the `IDataController` interface, ensuring a consistent contract for the View layer.

### **Data Layer (Models & DB)**
- **Models:** Strongly-typed classes inheriting from `BaseData` (e.g., `MemberData`). These act as **Data Transfer Objects (DTOs)**.
- **Database Access:** A centralized `DB` class handles all SQL connections, command execution, and data retrieval using ADO.NET.

---

## 2. Key Design Patterns & Methods

### **Centralized Routing & Factory**
The `FormsRouter` class acts as the application's navigator.
- **Decoupling:** `Form1` (the main shell) doesn't know about the existence of specific forms. It simply raises events (e.g., `OnMemberButtonClikced`).
- **Dependency Injection:** The router listens to these events, instantiates the required controller, and "injects" it into the new form's constructor.

### **Dependency Inversion Principle (DIP)**
Instead of a Form depending on a specific Controller class:
- **Form → IDataController ← Controller**
This allows the UI to work with any class that implements the interface, making it easy to swap implementations or use mock data for testing.

### **Event-Driven UI Updates**
Communication from the Controller back to the Form is handled via **Events**:
1. Form subscribes to `_controller.OnDataRefreshed`.
2. Controller fetches new data from `DB`.
3. Controller triggers `OnDataRefreshed`.
4. Form reacts by updating the `DataGridView.DataSource`.

### **Polymorphic Data Handling**
The `IDataController.Add(BaseData data)` method uses **Polymorphism**. 
- The UI passes a specific object (like `MemberData`).
- The Controller uses pattern matching (`if (data is MemberData member)`) to process the specific properties of that object before sending them to the database.

---

## 3. Component Interaction Flow
1. **User Action:** User clicks "Add Member" in `MemberForm`.
2. **UI Logic:** Form packages text box values into a `MemberData` object.
3. **Controller Call:** Form calls `_controller.Add(newMember)`.
4. **Persistence:** Controller calls `_db.AddMember(...)`.
5. **Refresh:** Controller calls `RefreshData()`, which pulls the latest table from SQL.
6. **Notification:** Controller raises `OnDataRefreshed`.
7. **UI Update:** `MemberForm` receives the event and re-binds the `DataGridView`.
