using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Producto> Productos { get; set; }
        public DbSet<Guarnicion> Guarniciones { get; set; }
        public DbSet<Combo> Combos { get; set; }
        public DbSet<DulceTipico> DulcesTipicos { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Carne> Carnes { get; set; }


    }
}
