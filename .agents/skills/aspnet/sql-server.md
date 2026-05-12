# SQL Server — Raw ADO.NET (No Entity Framework)

## Connection String (appsettings.json)

```json
{
  "ConnectionStrings": {
    "Default": "Server=localhost;Database=MyAppDb;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

For SQL auth (username/password):
```
Server=localhost;Database=MyAppDb;User Id=sa;Password=YourPassword;TrustServerCertificate=True;
```

---

## DbHelper — ADO.NET Wrapper

Register in `Program.cs` as `builder.Services.AddSingleton<DbHelper>()`.

```csharp
// Data/DbHelper.cs
public class DbHelper
{
    private readonly string _connString;

    public DbHelper(IConfiguration config)
    {
        _connString = config.GetConnectionString("Default")
            ?? throw new InvalidOperationException("Connection string 'Default' not found.");
    }

    // ── Execute (INSERT / UPDATE / DELETE) ──────────────────────────────
    public int Execute(string sql, params SqlParameter[] parameters)
    {
        using var conn = new SqlConnection(_connString);
        using var cmd  = new SqlCommand(sql, conn);
        cmd.Parameters.AddRange(parameters);
        conn.Open();
        return cmd.ExecuteNonQuery();
    }

    // ── ExecuteScalar (returns single value, e.g. new ID) ───────────────
    public T? ExecuteScalar<T>(string sql, params SqlParameter[] parameters)
    {
        using var conn = new SqlConnection(_connString);
        using var cmd  = new SqlCommand(sql, conn);
        cmd.Parameters.AddRange(parameters);
        conn.Open();
        var result = cmd.ExecuteScalar();
        return result is DBNull || result is null ? default : (T)Convert.ChangeType(result, typeof(T));
    }

    // ── Query (returns list) ─────────────────────────────────────────────
    public List<T> Query<T>(string sql, Func<SqlDataReader, T> map, params SqlParameter[] parameters)
    {
        using var conn   = new SqlConnection(_connString);
        using var cmd    = new SqlCommand(sql, conn);
        cmd.Parameters.AddRange(parameters);
        conn.Open();
        using var reader = cmd.ExecuteReader();
        var results = new List<T>();
        while (reader.Read()) results.Add(map(reader));
        return results;
    }

    // ── QuerySingle (returns one or null) ────────────────────────────────
    public T? QuerySingle<T>(string sql, Func<SqlDataReader, T> map, params SqlParameter[] parameters)
        where T : class
    {
        using var conn   = new SqlConnection(_connString);
        using var cmd    = new SqlCommand(sql, conn);
        cmd.Parameters.AddRange(parameters);
        conn.Open();
        using var reader = cmd.ExecuteReader();
        return reader.Read() ? map(reader) : null;
    }

    // ── Stored Procedure ─────────────────────────────────────────────────
    public List<T> StoredProcedure<T>(string procName, Func<SqlDataReader, T> map, params SqlParameter[] parameters)
    {
        using var conn = new SqlConnection(_connString);
        using var cmd  = new SqlCommand(procName, conn) { CommandType = CommandType.StoredProcedure };
        cmd.Parameters.AddRange(parameters);
        conn.Open();
        using var reader = cmd.ExecuteReader();
        var results = new List<T>();
        while (reader.Read()) results.Add(map(reader));
        return results;
    }
}
```

---

## Safe Parameterized Query Examples

```csharp
// CORRECT — always use @param
cmd.Parameters.Add(new SqlParameter("@Name", SqlDbType.NVarChar, 100) { Value = name });

// NEVER do this — SQL injection risk
cmd.CommandText = $"SELECT * FROM Users WHERE Name = '{name}'"; // ❌
```

## NULL Handling

```csharp
// Reading nullable columns
var email = reader.IsDBNull(2) ? null : reader.GetString(2);

// Writing nullable values
new SqlParameter("@Email", (object?)email ?? DBNull.Value)
```

---

## Database Migrations

Migrations are plain `.sql` files, numbered sequentially, stored in `Migrations/`.

### Naming Convention
```
001_initial_schema.sql
002_add_users_table.sql
003_add_email_to_users.sql
```

### Migration File Template

```sql
-- Migration: 002_add_users_table.sql
-- Date: 2025-05-10
-- Description: Creates the Users table

BEGIN TRANSACTION;

CREATE TABLE Users (
    Id       INT IDENTITY(1,1) PRIMARY KEY,
    Name     NVARCHAR(100)  NOT NULL,
    Email    NVARCHAR(255)  NOT NULL UNIQUE,
    Created  DATETIME2      NOT NULL DEFAULT GETUTCDATE()
);

-- Track which migrations have been applied
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = '_Migrations')
BEGIN
    CREATE TABLE _Migrations (
        Id          INT IDENTITY(1,1) PRIMARY KEY,
        FileName    NVARCHAR(200) NOT NULL,
        AppliedAt   DATETIME2     NOT NULL DEFAULT GETUTCDATE()
    );
END

INSERT INTO _Migrations (FileName) VALUES ('002_add_users_table.sql');

COMMIT;
```

### Running Migrations (PowerShell / sqlcmd)

```powershell
# Run a single migration
sqlcmd -S localhost -d MyAppDb -i "Migrations/002_add_users_table.sql"

# Run all pending migrations in order (simple script)
Get-ChildItem "Migrations/*.sql" | Sort-Object Name | ForEach-Object {
    Write-Host "Running $($_.Name)..."
    sqlcmd -S localhost -d MyAppDb -i $_.FullName
}
```

### Check Applied Migrations

```sql
SELECT FileName, AppliedAt FROM _Migrations ORDER BY AppliedAt;
```

---

## Common SQL Patterns

### Pagination
```csharp
var sql = @"
    SELECT Id, Name, Price
    FROM Products
    ORDER BY Id
    OFFSET @Skip ROWS
    FETCH NEXT @Take ROWS ONLY";

var items = _db.Query<Product>(sql, reader => new Product {
    Id    = reader.GetInt32(0),
    Name  = reader.GetString(1),
    Price = reader.GetDecimal(2)
},
new SqlParameter("@Skip", (page - 1) * pageSize),
new SqlParameter("@Take", pageSize));
```

### Bulk Insert with Table-Valued Parameter
```sql
-- Create type once in SQL Server
CREATE TYPE dbo.ProductList AS TABLE (Name NVARCHAR(100), Price DECIMAL(18,2));
```
```csharp
var table = new DataTable();
table.Columns.Add("Name",  typeof(string));
table.Columns.Add("Price", typeof(decimal));
foreach (var p in products) table.Rows.Add(p.Name, p.Price);

var tvp = new SqlParameter("@Products", SqlDbType.Structured)
{
    TypeName = "dbo.ProductList",
    Value    = table
};
_db.Execute("INSERT INTO Products SELECT Name, Price FROM @Products", tvp);
```
