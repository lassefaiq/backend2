namespace Backend2.Api.Dtos;

public record CategoryCreateDto(string Name, string? Image);

public record CategoryReadDto(
    int Id,
    string Name,
    string? Image,
    string Slug,
    List<int> ProductIds
);
