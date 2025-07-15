public class Usuario
{
    public int Id { get; set; }
    public string NombreUsuario { get; set; } = string.Empty;
    public string ContraseñaHash { get; set; } = string.Empty;
    public string Rol { get; set; } = "usuario"; // "admin" o "usuario"
}
