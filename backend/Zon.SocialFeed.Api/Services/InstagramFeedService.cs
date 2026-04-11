using Microsoft.Extensions.Options;
using Zon.SocialFeed.Api.Models;
using Zon.SocialFeed.Api.Options;

namespace Zon.SocialFeed.Api.Services;

public sealed class InstagramFeedService
{
    private static readonly TimeSpan StaleAfter = TimeSpan.FromHours(3);

    private readonly IInstagramGraphClient _instagramGraphClient;
    private readonly IInstagramSnapshotRepository _snapshotRepository;
    private readonly InstagramOptions _options;
    private readonly TimeProvider _timeProvider;

    public InstagramFeedService(
        IInstagramGraphClient instagramGraphClient,
        IInstagramSnapshotRepository snapshotRepository,
        IOptions<InstagramOptions> options,
        TimeProvider timeProvider)
    {
        _instagramGraphClient = instagramGraphClient;
        _snapshotRepository = snapshotRepository;
        _options = options.Value;
        _timeProvider = timeProvider;
    }

    public async Task<InstagramFeedSnapshot> RefreshAsync(CancellationToken cancellationToken)
    {
        var items = await _instagramGraphClient.GetLatestMediaAsync(cancellationToken);
        var snapshot = new InstagramFeedSnapshot
        {
            Source = "instagram",
            ProfileUrl = _options.ProfileUrl,
            FetchedAtUtc = _timeProvider.GetUtcNow(),
            Items = items
        };

        await _snapshotRepository.SaveAsync(snapshot, cancellationToken);
        return snapshot;
    }

    public async Task<InstagramFeedResponse> GetResponseAsync(CancellationToken cancellationToken)
    {
        var snapshot = await _snapshotRepository.GetAsync(cancellationToken);
        if (snapshot is null)
        {
            return CreateUnavailableResponse();
        }

        var snapshotAge = _timeProvider.GetUtcNow() - snapshot.FetchedAtUtc;
        return new InstagramFeedResponse
        {
            Status = snapshotAge > StaleAfter ? "stale" : "ok",
            Source = snapshot.Source,
            ProfileUrl = string.IsNullOrWhiteSpace(snapshot.ProfileUrl) ? _options.ProfileUrl : snapshot.ProfileUrl,
            FetchedAtUtc = snapshot.FetchedAtUtc,
            Items = snapshot.Items
        };
    }

    public InstagramFeedResponse CreateUnavailableResponse()
    {
        return new InstagramFeedResponse
        {
            Status = "unavailable",
            Source = "instagram",
            ProfileUrl = _options.ProfileUrl,
            FetchedAtUtc = null,
            Items = Array.Empty<InstagramFeedItem>()
        };
    }
}
