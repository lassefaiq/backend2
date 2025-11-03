using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend2.Api.Data;
using Backend2.Api.Dtos;
using Backend2.Api.Models;
using Backend2.Api.Services;

namespace Backend2.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController(FreakyDbContext db, ISlugGenerator slugs) : ControllerBase
{
    // GET /api/categories  eller /api/categories?slug=xxx
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CategoryReadDto>>> GetAll([FromQuery] string? slug)
    {
        var q = db.Categories.Include(c => c.Products).AsQueryable();
        if (!string.IsNullOrWhiteSpace(slug)) q = q.Where(c => c.Slug == slug);

        var list = await q.Select(c => new CategoryReadDto(
            c.Id, c.Name, c.Image, c.Slug, c.Products.Select(p => p.Id).ToList()
        )).ToListAsync();

        return Ok(list);
    }

    // GET /api/categories/5
    [HttpGet("{id:int}")]
    public async Task<ActionResult<CategoryReadDto>> GetOne(int id)
    {
        var c = await db.Categories.Include(c => c.Products).FirstOrDefaultAsync(c => c.Id == id);
        if (c is null) return NotFound();

        return Ok(new CategoryReadDto(
            c.Id, c.Name, c.Image, c.Slug, c.Products.Select(p => p.Id).ToList()
        ));
    }

    // POST /api/categories
    [HttpPost]
    public async Task<ActionResult<CategoryReadDto>> Create(CategoryCreateDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            return BadRequest(new { error = "Name is required" });

        var cat = new Category { Name = dto.Name, Image = dto.Image, Slug = slugs.ToSlug(dto.Name) };

        db.Categories.Add(cat);
        await db.SaveChangesAsync();

        var read = new CategoryReadDto(cat.Id, cat.Name, cat.Image, cat.Slug, new List<int>());
        return CreatedAtAction(nameof(GetOne), new { id = cat.Id }, read);
    }

    // DELETE /api/categories/5
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var c = await db.Categories.FindAsync(id);
        if (c is null) return NotFound();

        db.Categories.Remove(c);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
