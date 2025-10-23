namespace Backend2.Api.Models;

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public string? Image { get; set; }
    public string UrlSlug { get; set; } = null!;
    public ICollection<Category> Categories { get; set; } = new List<Category>();
}
