using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend2.Api.Data;
using Backend2.Api.Dtos;
using Backend2.Api.Models;
using Backend2.Api.Services;

namespace Backend2.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController(FreakyDbContext db, ISlugGenerator slugs) : ControllerBase
{
    // GET /api/products  eller /api/products?slug=xxx
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductReadDto>>> GetAll([FromQuery] string? slug)
    {
        var q = db.Products.Include(p => p.Categories).AsQueryable();
        if (!string.IsNullOrWhiteSpace(slug)) q = q.Where(p => p.UrlSlug == slug);

        var list = await q.Select(p => new ProductReadDto(
            p.Id, p.Name, p.Description, p.Price, p.Image, p.UrlSlug, p.Categories.Select(c => c.Id).ToList()
        )).ToListAsync();

        return Ok(list);
    }

    // GET /api/products/5
    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProductReadDto>> GetOne(int id)
    {
        var p = await db.Products.Include(p => p.Categories).FirstOrDefaultAsync(p => p.Id == id);
        if (p is null) return NotFound();

        return Ok(new ProductReadDto(
            p.Id, p.Name, p.Description, p.Price, p.Image, p.UrlSlug, p.Categories.Select(c => c.Id).ToList()
        ));
    }

    // POST /api/products
    [HttpPost]
    public async Task<ActionResult<ProductReadDto>> Create(ProductCreateDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            return BadRequest(new { error = "Name is required" });

        var product = new Product
        {
            Name = dto.Name,
            Description = dto.Description,
            Price = dto.Price,
            Image = dto.Image,
            UrlSlug = slugs.ToSlug(dto.Name)
        };

        if (dto.CategoryIds is { Count: > 0 })
        {
            var cats = await db.Categories.Where(c => dto.CategoryIds.Contains(c.Id)).ToListAsync();
            foreach (var c in cats) product.Categories.Add(c);
        }

        db.Products.Add(product);
        await db.SaveChangesAsync();

        var read = new ProductReadDto(
            product.Id, product.Name, product.Description, product.Price, product.Image,
            product.UrlSlug, product.Categories.Select(c => c.Id).ToList()
        );

        return CreatedAtAction(nameof(GetOne), new { id = product.Id }, read);
    }

    // DELETE /api/products/5
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var p = await db.Products.FindAsync(id);
        if (p is null) return NotFound();

        db.Products.Remove(p);
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("slug/{slug}")]
    public async Task<ActionResult<ProductReadDto>> GetBySlug(string slug)
    {
        var p = await db.Products
            .AsNoTracking()
            .Include(x => x.Categories)
            .FirstOrDefaultAsync(x => x.UrlSlug == slug);

        if (p is null) return NotFound();

        return Ok(new ProductReadDto(
            p.Id, p.Name, p.Description, p.Price, p.Image, p.UrlSlug, p.Categories.Select(c => c.Id).ToList()
        ));
    }
}


