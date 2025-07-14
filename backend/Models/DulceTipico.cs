namespace backend.Models
{
    public class DulceTipico
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Presentacion { get; set; } 
        public int CantidadDisponible { get; set; }
        public decimal Precio { get; set; }
    }
}
