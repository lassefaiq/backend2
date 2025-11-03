using System.Text.RegularExpressions;

namespace Backend2.Api.Services;

public interface ISlugGenerator { string ToSlug(string input); }

public class SlugGenerator : ISlugGenerator
{
    public string ToSlug(string input)
    {
        var s = (input ?? string.Empty).Trim().ToLowerInvariant();
        s = Regex.Replace(s, @"\s+", "-");
        s = Regex.Replace(s, @"[^a-z0-9\-]", "");
        s = Regex.Replace(s, "-{2,}", "-").Trim('-');
        return string.IsNullOrEmpty(s) ? "n-a" : s;
    }
}
