namespace Zon.SocialFeed.Api.Models;

public sealed class InstagramFeedItem
{
    public string Id { get; set; } = string.Empty;

    public string Permalink { get; set; } = string.Empty;

    public string? Caption { get; set; }

    public string MediaType { get; set; } = "IMAGE";

    public string MediaUrl { get; set; } = string.Empty;

    public string? ThumbnailUrl { get; set; }

    public DateTimeOffset TimestampUtc { get; set; }
}
