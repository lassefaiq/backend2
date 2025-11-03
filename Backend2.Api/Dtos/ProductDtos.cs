namespace Backend2.Api.Dtos;

public record ProductCreateDto(
    string Name,
    string? Description,
    decimal Price,
    string? Image,
    List<int>? CategoryIds
);

public record ProductReadDto(
    int Id,
    string Name,
    string? Description,
    decimal Price,
    string? Image,
    string UrlSlug,
    List<int> CategoryIds
);
