namespace backend.Models
{
    public class Producto
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Categoria { get; set; } // "Churrasco" o "Dulce"
        public decimal Precio { get; set; }
        public int Stock { get; set; }
    }
}
