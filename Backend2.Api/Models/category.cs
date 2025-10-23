namespace Backend2.Api.Models;

public class Category
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Image { get; set; }
    public string Slug { get; set; } = null!;
    public ICollection<Product> Products { get; set; } = new List<Product>();
}
