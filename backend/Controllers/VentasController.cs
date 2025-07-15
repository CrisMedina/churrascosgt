using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;

[Route("api/[controller]")]
[ApiController]
public class VentasController : ControllerBase
{
    [HttpPost("recomendar-combo")]
    public async Task<IActionResult> RecomendarCombo([FromBody] List<string> productos)
    {
        var prompt = $"Tengo estos productos en el carrito: {string.Join(", ", productos)}. ¿Qué combo me recomiendas?";

        using var client = new HttpClient();
        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", "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");

        var body = new
        {
            model = "openai/gpt-3.5-turbo",
            messages = new[]
            {
                new { role = "user", content = prompt }
            }
        };

        var response = await client.PostAsJsonAsync("https://openrouter.ai/v1/chat/completions", body);

        if (!response.IsSuccessStatusCode)
            return BadRequest("Error al consultar OpenRouter");

        var resultado = await response.Content.ReadAsStringAsync();
        return Ok(resultado);
    }
}
