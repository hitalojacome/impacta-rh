using ImpactaRH.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ImpactaRH.Api.Data;
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Funcionario> Funcionarios { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Funcionario>()
            .HasIndex(f => f.Email)
            .IsUnique();

        modelBuilder.Entity<Funcionario>()
            .HasIndex(f => f.CPF)
            .IsUnique();
    }
}
