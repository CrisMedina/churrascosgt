using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using backend.Data;
using backend.Models;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Mvc; 
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;

static string CalcularHash(string contraseña)
{
    using var sha256 = SHA256.Create();
    var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(contraseña));
    return Convert.ToBase64String(bytes);
}

static void CrearUsuarioAdmin(AppDbContext db)
{
    if (!db.Usuarios.Any(u => u.NombreUsuario == "admin"))
    {
        var admin = new Usuario
        {
            NombreUsuario = "admin",
            ContraseñaHash = CalcularHash("admin"),
            Rol = "admin"
        };

        db.Usuarios.Add(admin);
        db.SaveChanges();
        Console.WriteLine("Usuario admin creado correctamente.");
    }
}


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddScoped<ServicioAutenticacion>();

builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        var clave = builder.Configuration["Jwt:Key"] ?? "clave-ultra-secreta";
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(clave))
        };
    });

builder.Services.AddAuthorization();


builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddCors();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    CrearUsuarioAdmin(db);
}

app.UseCors(policy =>
    policy.AllowAnyOrigin()
          .AllowAnyMethod()
          .AllowAnyHeader());

app.UseAuthentication();
app.UseAuthorization(); 

app.MapPost("/api/registrar", async (SolicitudRegistro solicitud, ServicioAutenticacion servicio) =>
{
    var nuevoUsuario = await servicio.RegistrarUsuarioAsync(solicitud.NombreUsuario, solicitud.Contraseña, solicitud.Rol);
    return Results.Ok(nuevoUsuario);
});


app.MapPost("/api/iniciar-sesion", async (SolicitudInicioSesion solicitud, ServicioAutenticacion servicio) =>
{
    var usuario = await servicio.ValidarUsuarioAsync(solicitud.NombreUsuario, solicitud.Contraseña);
    if (usuario == null) return Results.Unauthorized();

    var token = GeneradorJwt.CrearToken(usuario, builder.Configuration["Jwt:Key"] ?? "clave-ultra-secreta");
    return Results.Ok(new { token });
});

app.MapGet("/api/usuario-actual", async (HttpContext http, AppDbContext db) =>
{
    var nombreUsuario = http.User.Identity?.Name;

    if (string.IsNullOrEmpty(nombreUsuario))
        return Results.Unauthorized();

    var usuario = await db.Usuarios.FirstOrDefaultAsync(u => u.NombreUsuario == nombreUsuario);

    if (usuario == null)
        return Results.NotFound();

    return Results.Ok(new
    {
        usuario.Id,
        usuario.NombreUsuario,
        usuario.Rol
    });
})
.RequireAuthorization(); 

app.MapGet("/", () => "API churrascosGT corriendo correctamente");

//PRODUCTOS

// Obtener todos los productos
app.MapGet("/productos", async (AppDbContext db) =>
    await db.Productos.ToListAsync())
    .RequireAuthorization();
    //.RequireAuthorization(new AuthorizeAttribute { Roles = "admin" });

// Obtener un producto por ID
app.MapGet("/productos/{id}", async (int id, AppDbContext db) =>
    await db.Productos.FindAsync(id) is Producto producto
        ? Results.Ok(producto)
        : Results.NotFound());

// Crear producto
app.MapPost("/productos", async (Producto producto, AppDbContext db) =>
{
    db.Productos.Add(producto);
    await db.SaveChangesAsync();
    return Results.Created($"/productos/{producto.Id}", producto);
});

// Actualizar producto
app.MapPut("/productos/{id}", async (int id, Producto input, AppDbContext db) =>
{
    var producto = await db.Productos.FindAsync(id);
    if (producto is null) return Results.NotFound();

    producto.Nombre = input.Nombre;
    producto.Categoria = input.Categoria;
    producto.Precio = input.Precio;
    producto.Stock = input.Stock;

    await db.SaveChangesAsync();
    return Results.Ok(producto);
});

// Eliminar producto
app.MapDelete("/productos/{id}", async (int id, AppDbContext db) =>
{
    var producto = await db.Productos.FindAsync(id);
    if (producto is null) return Results.NotFound();

    db.Productos.Remove(producto);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

//GUARNICION

// Obtener todos las guarniciones
app.MapGet("/guarniciones", async (AppDbContext db) =>
    await db.Guarniciones.ToListAsync());

// Obtener un guarnicion por ID
app.MapGet("/guarniciones/{id}", async (int id, AppDbContext db) =>
    await db.Guarniciones.FindAsync(id) is Guarnicion guarnicion
        ? Results.Ok(guarnicion)
        : Results.NotFound());

// Crear guarnicion
app.MapPost("/guarniciones", async (Guarnicion guarnicion, AppDbContext db) =>
{
    db.Guarniciones.Add(guarnicion);
    await db.SaveChangesAsync();
    return Results.Created($"/guarniciones/{guarnicion.Id}", guarnicion);
});

// Actualizar guarnicion
app.MapPut("/guarniciones/{id}", async (int id, Guarnicion input, AppDbContext db) =>
{
    var guarnicion = await db.Guarniciones.FindAsync(id);
    if (guarnicion is null) return Results.NotFound();

    guarnicion.Nombre = input.Nombre;
    guarnicion.Stock = input.Stock;
    guarnicion.EsExtra = input.EsExtra;

    await db.SaveChangesAsync();
    return Results.Ok(guarnicion);
});

// Eliminar guarnicion
app.MapDelete("/guarniciones/{id}", async (int id, AppDbContext db) =>
{
    var guarnicion = await db.Guarniciones.FindAsync(id);
    if (guarnicion is null) return Results.NotFound();

    db.Guarniciones.Remove(guarnicion);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

//COMBO

// Obtener todos las combos
app.MapGet("/combos", async (AppDbContext db) =>
    await db.Combos.ToListAsync());

// Obtener un guarnicion por ID
app.MapGet("/combos/{id}", async (int id, AppDbContext db) =>
    await db.Combos.FindAsync(id) is Combo combo
        ? Results.Ok(combo)
        : Results.NotFound());

// Crear combo
app.MapPost("/combos", async (Combo combo, AppDbContext db) =>
{
    db.Combos.Add(combo);
    await db.SaveChangesAsync();
    return Results.Created($"/combos/{combo.Id}", combo);
});

// Actualizar combo
app.MapPut("/combos/{id}", async (int id, Combo input, AppDbContext db) =>
{
    var combo = await db.Combos.FindAsync(id);
    if (combo is null) return Results.NotFound();

    combo.Nombre = input.Nombre;
    combo.Descripcion = input.Descripcion;
    combo.Precio = input.Precio;

    await db.SaveChangesAsync();
    return Results.Ok(combo);
});

// Eliminar combo
app.MapDelete("/combos/{id}", async (int id, AppDbContext db) =>
{
    var combo = await db.Combos.FindAsync(id);
    if (combo is null) return Results.NotFound();

    db.Combos.Remove(combo);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

//DULCE

// Obtener todos los dulces
app.MapGet("/dulces", async (AppDbContext db) =>
{
    var lista = await db.DulcesTipicos.ToListAsync();
    return Results.Ok(lista);
});

// Obtener un dulce por ID
app.MapGet("/dulces/{id}", async (int id, AppDbContext db) =>
    await db.DulcesTipicos.FindAsync(id) is DulceTipico dulceTipico
        ? Results.Ok(dulceTipico)
        : Results.NotFound());

// Crear dulce
app.MapPost("/dulces", async (DulceTipico dulceTipico, AppDbContext db) =>
{
    db.DulcesTipicos.Add(dulceTipico);
    await db.SaveChangesAsync();
    return Results.Created($"/dulces/{dulceTipico.Id}", dulceTipico);
});

// Actualizar dulce
app.MapPut("/dulces/{id}", async (int id, DulceTipico input, AppDbContext db) =>
{
    var dulceTipico = await db.DulcesTipicos.FindAsync(id);
    if (dulceTipico is null) return Results.NotFound();

    dulceTipico.Nombre = input.Nombre;
    dulceTipico.Presentacion = input.Presentacion;
    dulceTipico.CantidadDisponible = input.CantidadDisponible;
    dulceTipico.Precio = input.Precio;

    await db.SaveChangesAsync();
    return Results.Ok(dulceTipico);
});

// Eliminar dulce
app.MapDelete("/dulces/{id}", async (int id, AppDbContext db) =>
{
    var dulceTipico = await db.DulcesTipicos.FindAsync(id);
    if (dulceTipico is null) return Results.NotFound();

    db.DulcesTipicos.Remove(dulceTipico);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.MapPost("/ventas/recomendar-combo", async ([FromBody] List<string> productos) =>
{
    var prompt = $"Tengo estos productos en el carrito: {string.Join(", ", productos)}. ¿Qué combo me recomiendas?";

    var modelos = new[]
    {
        "meta-llama/llama-3-8b-instruct",
        "mistralai/mixtral-8x7b",
        "nousresearch/nous-capybara-7b"
    };

    using var client = new HttpClient();
    client.DefaultRequestHeaders.Authorization =
        new AuthenticationHeaderValue("Bearer", "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");

    client.DefaultRequestHeaders.Add("HTTP-Referer", "https://openrouter.ai");

    foreach (var modelo in modelos)
    {
        var body = new
        {
            model = modelo,
            messages = new[]
            {
                new { role = "user", content = prompt }
            }
        };

        var response = await client.PostAsJsonAsync("https://openrouter.ai/api/v1/chat/completions", body);

        if (response.IsSuccessStatusCode &&
            response.Content.Headers.ContentType?.MediaType == "application/json")
        {
            var json = await response.Content.ReadFromJsonAsync<JsonElement>();
            var mensaje = json.GetProperty("choices")[0].GetProperty("message").GetProperty("content").GetString();
            return Results.Ok(mensaje);
        }
    }

    return Results.Problem("No se pudo obtener respuesta de ningún modelo. Revisa tu clave o intenta más tarde.");
});

app.MapGet("/test-openrouter", async () =>
{
    using var client = new HttpClient();
    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "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");

    var body = new
    {
        model = "meta-llama/llama-3-8b-instruct",
        messages = new[]
        {
            new { role = "user", content = "Hola, ¿qué puedes recomendarme?" }
        }
    };
    client.DefaultRequestHeaders.Add("HTTP-Referer", "https://openrouter.ai");

    var response = await client.PostAsJsonAsync("https://openrouter.ai/api/v1/chat/completions", body);

    var result = await response.Content.ReadAsStringAsync();
    return Results.Ok(result);
});



app.Run();
