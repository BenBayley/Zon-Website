using System.ComponentModel.DataAnnotations;

namespace Zon.SocialFeed.Api.Options;

public sealed class FrontendOptions
{
    public const string SectionName = "Frontend";

    [Required]
    [Url]
    public string AllowedOrigin { get; set; } = string.Empty;
}
