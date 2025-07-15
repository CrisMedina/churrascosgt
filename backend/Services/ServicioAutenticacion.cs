using backend.Models;
using backend.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

public class ServicioAutenticacion
{
    private readonly AppDbContext _db;

    public ServicioAutenticacion(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Usuario?> ValidarUsuarioAsync(string nombreUsuario, string contraseña)
    {
        var hash = CalcularHash(contraseña);
        return await _db.Usuarios.FirstOrDefaultAsync(u =>
            u.NombreUsuario == nombreUsuario && u.ContraseñaHash == hash);
    }

    public async Task<Usuario> RegistrarUsuarioAsync(string nombreUsuario, string contraseña, string rol)
    {
        var nuevoUsuario = new Usuario
        {
            NombreUsuario = nombreUsuario,
            ContraseñaHash = CalcularHash(contraseña),
            Rol = rol
        };

        _db.Usuarios.Add(nuevoUsuario);
        await _db.SaveChangesAsync();
        return nuevoUsuario;
    }

    private string CalcularHash(string contraseña)
    {
        using var sha256 = SHA256.Create();
        var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(contraseña));
        return Convert.ToBase64String(bytes);
    }
}
