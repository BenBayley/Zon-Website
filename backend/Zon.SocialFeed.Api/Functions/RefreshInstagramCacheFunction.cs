using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Zon.SocialFeed.Api.Services;

namespace Zon.SocialFeed.Api.Functions;

public sealed class RefreshInstagramCacheFunction
{
    private readonly InstagramFeedService _instagramFeedService;
    private readonly ILogger<RefreshInstagramCacheFunction> _logger;

    public RefreshInstagramCacheFunction(
        InstagramFeedService instagramFeedService,
        ILogger<RefreshInstagramCacheFunction> logger)
    {
        _instagramFeedService = instagramFeedService;
        _logger = logger;
    }

    [Function(nameof(RefreshInstagramCacheFunction))]
    public async Task Run([TimerTrigger("0 0 * * * *")] TimerInfo timerInfo, CancellationToken cancellationToken)
    {
        _logger.LogInformation(
            "Refreshing the Instagram cache. Next scheduled refresh: {NextRunUtc}.",
            timerInfo.ScheduleStatus?.Next);

        var snapshot = await _instagramFeedService.RefreshAsync(cancellationToken);

        _logger.LogInformation(
            "Instagram cache refreshed at {FetchedAtUtc} with {ItemCount} items.",
            snapshot.FetchedAtUtc,
            snapshot.Items.Count);
    }
}
