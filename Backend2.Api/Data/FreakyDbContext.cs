using Microsoft.EntityFrameworkCore;
using Backend2.Api.Models;

namespace Backend2.Api.Data;

public class FreakyDbContext(DbContextOptions<FreakyDbContext> options) : DbContext(options)
{
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Category> Categories => Set<Category>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        // Indexer 
        b.Entity<Product>().HasIndex(p => p.UrlSlug);
        b.Entity<Category>().HasIndex(c => c.Slug);

        // Many-to-many Product <-> Category (join-tabell skapas automatiskt)
        b.Entity<Product>()
            .HasMany(p => p.Categories)
            .WithMany(c => c.Products);
    }
}
