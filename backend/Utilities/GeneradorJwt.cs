using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using backend.Models;

public static class GeneradorJwt
{
    public static string CrearToken(Usuario usuario, string claveSecreta)
    {
        var manejador = new JwtSecurityTokenHandler();
        var clave = Encoding.ASCII.GetBytes(claveSecreta);

        var claims = new[]
        {
            new Claim(ClaimTypes.Name, usuario.NombreUsuario),
            new Claim(ClaimTypes.Role, usuario.Rol)
        };

        var descriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddHours(8),
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(clave),
                SecurityAlgorithms.HmacSha256Signature
            )
        };

        var token = manejador.CreateToken(descriptor);
        return manejador.WriteToken(token);
    }
}
