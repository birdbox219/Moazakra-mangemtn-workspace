# Frontend Connection — React ↔ ASP.NET Core

## CORS Setup (Program.cs)

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp", policy =>
        policy
            .WithOrigins(
                "http://localhost:5173",  // Vite dev
                "http://localhost:3000"   // CRA dev (if used)
            )
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials()); // Only if using cookies/auth headers
});

// Must come BEFORE UseAuthorization, AFTER UseRouting
app.UseCors("ReactApp");
```

> **Never** use `.AllowAnyOrigin()` with `.AllowCredentials()` — ASP.NET Core will throw at startup.

---

## React — Environment Variables

```env
# .env
VITE_API_URL=http://localhost:5000
```

```ts
// src/config.ts
export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";
```

---

## React — API Client Pattern

Centralise all API calls in one file. Don't scatter `fetch` calls across components.

```ts
// src/api/client.ts
import { API_URL } from "../config";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message ?? "Request failed");
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  get:    <T>(path: string)                   => request<T>(path),
  post:   <T>(path: string, body: unknown)    => request<T>(path, { method: "POST",   body: JSON.stringify(body) }),
  put:    <T>(path: string, body: unknown)    => request<T>(path, { method: "PUT",    body: JSON.stringify(body) }),
  delete: <T>(path: string)                   => request<T>(path, { method: "DELETE" }),
};
```

---

## React — Data Fetching in a Component

```tsx
// src/features/products/ProductList.tsx
import { useEffect, useState } from "react";
import { api } from "../../api/client";

type Product = { id: number; name: string; price: number };

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);

  useEffect(() => {
    api.get<Product[]>("/api/products")
      .then(setProducts)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading…</p>;
  if (error)   return <p>Error: {error}</p>;

  return (
    <ul>
      {products.map(p => (
        <li key={p.id}>{p.name} — ${p.price}</li>
      ))}
    </ul>
  );
}
```

---

## React — POST / Mutation Example

```tsx
async function createProduct(data: { name: string; price: number }) {
  try {
    const created = await api.post<Product>("/api/products", data);
    setProducts(prev => [...prev, created]);
  } catch (e: unknown) {
    setError((e as Error).message);
  }
}
```

---

## Vite Proxy (Alternative to CORS in dev)

If you'd rather avoid CORS headers in development, proxy through Vite:

```ts
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
```

With this approach, React calls `/api/products` (same origin) and Vite forwards it to ASP.NET Core. You still need CORS configured for production.

---

## Common Issues

| Problem | Cause | Fix |
|---|---|---|
| `CORS policy blocked` | Missing `UseCors` in `Program.cs` | Add `app.UseCors("ReactApp")` before `UseAuthorization` |
| `Network Error` in React | Backend not running | Start ASP.NET Core first |
| `Failed to fetch` | Wrong port in `.env` | Match `VITE_API_URL` to backend's `applicationUrl` in `launchSettings.json` |
| `415 Unsupported Media Type` | Missing `Content-Type` header | Add `"Content-Type": "application/json"` in fetch headers |
| `400 Bad Request` on POST | Body not serialized | Wrap body in `JSON.stringify(data)` |
