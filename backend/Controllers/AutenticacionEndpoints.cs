public static class AutenticacionEndpoints
{
    public static void MapearRutasAutenticacion(this WebApplication app)
    {
        app.MapPost("/api/registrar", async (SolicitudRegistro solicitud, ServicioAutenticacion servicio) =>
        {
            var usuario = await servicio.RegistrarUsuarioAsync(solicitud.NombreUsuario, solicitud.Contraseña, solicitud.Rol);
            return Results.Ok(usuario);
        });

        app.MapPost("/api/iniciar-sesion", async (SolicitudInicioSesion solicitud, ServicioAutenticacion servicio) =>
        {
            var usuario = await servicio.ValidarUsuarioAsync(solicitud.NombreUsuario, solicitud.Contraseña);
            if (usuario == null) return Results.Unauthorized();

            var claveJwt = app.Configuration["Jwt:Key"] ?? "clave-ultra-secreta";
            var token = GeneradorJwt.CrearToken(usuario, claveJwt);
            return Results.Ok(new { token });
        });
    }

}
