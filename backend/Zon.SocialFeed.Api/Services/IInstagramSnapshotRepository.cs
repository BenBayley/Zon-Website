using Zon.SocialFeed.Api.Models;

namespace Zon.SocialFeed.Api.Services;

public interface IInstagramSnapshotRepository
{
    Task<InstagramFeedSnapshot?> GetAsync(CancellationToken cancellationToken);

    Task SaveAsync(InstagramFeedSnapshot snapshot, CancellationToken cancellationToken);
}
