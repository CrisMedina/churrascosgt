using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

app.MapGet("/", () => "API churrascosGT corriendo correctamente");

//PRODUCTOS

// Obtener todos los productos
app.MapGet("/productos", async (AppDbContext db) =>
    await db.Productos.ToListAsync());

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
    await db.DulcesTipicos.ToListAsync());

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

app.Run();
