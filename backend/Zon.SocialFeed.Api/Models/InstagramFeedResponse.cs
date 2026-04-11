namespace Zon.SocialFeed.Api.Models;

public sealed class InstagramFeedResponse
{
    public string Status { get; set; } = "unavailable";

    public string Source { get; set; } = "instagram";

    public string ProfileUrl { get; set; } = "https://www.instagram.com/";

    public DateTimeOffset? FetchedAtUtc { get; set; }

    public IReadOnlyList<InstagramFeedItem> Items { get; set; } = Array.Empty<InstagramFeedItem>();
}
