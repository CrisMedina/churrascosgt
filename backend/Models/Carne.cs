namespace backend.Models
{
    public class Carne
    {
        public int Id { get; set; }

        public string Nombre { get; set; }

        public string Tipo { get; set; }

        public double CantidadLibras { get; set; }

        public double PrecioPorLibra { get; set; }
    }
}
