# REST API / Web API Structure

## Program.cs Boilerplate

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register DB helper as singleton
builder.Services.AddSingleton<DbHelper>();

// CORS — allow React dev server
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp", policy =>
        policy.WithOrigins("http://localhost:5173") // Vite default
              .AllowAnyMethod()
              .AllowAnyHeader());
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("ReactApp");
app.UseAuthorization();
app.MapControllers();
app.Run();
```

## Controller Template

```csharp
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly DbHelper _db;

    public ProductsController(DbHelper db)
    {
        _db = db;
    }

    // GET api/products
    [HttpGet]
    public ActionResult<IEnumerable<Product>> GetAll()
    {
        var products = _db.Query<Product>(
            "SELECT Id, Name, Price FROM Products",
            reader => new Product
            {
                Id    = reader.GetInt32(0),
                Name  = reader.GetString(1),
                Price = reader.GetDecimal(2)
            });

        return Ok(products);
    }

    // GET api/products/5
    [HttpGet("{id}")]
    public ActionResult<Product> GetById(int id)
    {
        var product = _db.QuerySingle<Product>(
            "SELECT Id, Name, Price FROM Products WHERE Id = @Id",
            reader => new Product
            {
                Id    = reader.GetInt32(0),
                Name  = reader.GetString(1),
                Price = reader.GetDecimal(2)
            },
            new SqlParameter("@Id", id));

        if (product is null) return NotFound(new { message = $"Product {id} not found." });
        return Ok(product);
    }

    // POST api/products
    [HttpPost]
    public ActionResult<Product> Create([FromBody] CreateProductDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var newId = _db.ExecuteScalar<int>(
            "INSERT INTO Products (Name, Price) OUTPUT INSERTED.Id VALUES (@Name, @Price)",
            new SqlParameter("@Name",  dto.Name),
            new SqlParameter("@Price", dto.Price));

        var created = new Product { Id = newId, Name = dto.Name, Price = dto.Price };
        return CreatedAtAction(nameof(GetById), new { id = newId }, created);
    }

    // PUT api/products/5
    [HttpPut("{id}")]
    public IActionResult Update(int id, [FromBody] UpdateProductDto dto)
    {
        var rows = _db.Execute(
            "UPDATE Products SET Name = @Name, Price = @Price WHERE Id = @Id",
            new SqlParameter("@Id",    id),
            new SqlParameter("@Name",  dto.Name),
            new SqlParameter("@Price", dto.Price));

        if (rows == 0) return NotFound(new { message = $"Product {id} not found." });
        return NoContent();
    }

    // DELETE api/products/5
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var rows = _db.Execute(
            "DELETE FROM Products WHERE Id = @Id",
            new SqlParameter("@Id", id));

        if (rows == 0) return NotFound(new { message = $"Product {id} not found." });
        return NoContent();
    }
}
```

## Response Conventions

| Scenario             | Return                                      |
|----------------------|---------------------------------------------|
| Success with data    | `Ok(data)`                                  |
| Created resource     | `CreatedAtAction(nameof(GetById), ...)`     |
| No content           | `NoContent()`                               |
| Not found            | `NotFound(new { message = "..." })`         |
| Bad input            | `BadRequest(ModelState)` or `BadRequest(new { message = "..." })` |
| Server error         | `StatusCode(500, new { message = "..." })`  |

## Folder Structure

```
MyApi/
├── Controllers/
│   └── ProductsController.cs
├── Models/
│   ├── Product.cs          # Domain model
│   └── Dtos/
│       ├── CreateProductDto.cs
│       └── UpdateProductDto.cs
├── Data/
│   └── DbHelper.cs         # ADO.NET wrapper (see sql-server.md)
├── Migrations/
│   ├── 001_create_products.sql
│   └── 002_add_category.sql
├── appsettings.json
└── Program.cs
```
