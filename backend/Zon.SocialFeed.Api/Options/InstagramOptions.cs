using System.ComponentModel.DataAnnotations;

namespace Zon.SocialFeed.Api.Options;

public sealed class InstagramOptions
{
    public const string SectionName = "Instagram";

    [Required]
    public string AccessToken { get; set; } = string.Empty;

    [Required]
    public string AccountId { get; set; } = string.Empty;

    [Required]
    [Url]
    public string ProfileUrl { get; set; } = "https://www.instagram.com/";

    [Range(1, 12)]
    public int ItemLimit { get; set; } = 6;
}
