using Zon.SocialFeed.Api.Models;

namespace Zon.SocialFeed.Api.Services;

public interface IInstagramGraphClient
{
    Task<IReadOnlyList<InstagramFeedItem>> GetLatestMediaAsync(CancellationToken cancellationToken);
}
