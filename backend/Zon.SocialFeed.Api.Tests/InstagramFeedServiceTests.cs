using Xunit;
using Zon.SocialFeed.Api.Models;
using Zon.SocialFeed.Api.Options;
using Zon.SocialFeed.Api.Services;

namespace Zon.SocialFeed.Api.Tests;

public sealed class InstagramFeedServiceTests
{
    [Fact]
    public async Task RefreshAsync_SavesTheLatestSnapshot()
    {
        var repository = new InMemorySnapshotRepository();
        var client = new FakeInstagramGraphClient(
        [
            new InstagramFeedItem
            {
                Id = "post-1",
                Permalink = "https://www.instagram.com/p/post-1/",
                MediaType = "IMAGE",
                MediaUrl = "https://cdn.example.com/post-1.jpg",
                TimestampUtc = new DateTimeOffset(2026, 4, 10, 11, 0, 0, TimeSpan.Zero)
            }
        ]);
        var timeProvider = new FixedTimeProvider(new DateTimeOffset(2026, 4, 10, 12, 0, 0, TimeSpan.Zero));
        var service = CreateService(client, repository, timeProvider);

        var snapshot = await service.RefreshAsync(CancellationToken.None);

        Assert.Equal("instagram", snapshot.Source);
        Assert.Equal("https://www.instagram.com/your-handle/", snapshot.ProfileUrl);
        Assert.Equal(timeProvider.CurrentTime, snapshot.FetchedAtUtc);
        Assert.Single(snapshot.Items);
        Assert.Equal(snapshot.FetchedAtUtc, repository.StoredSnapshot?.FetchedAtUtc);
    }

    [Fact]
    public async Task GetResponseAsync_ReturnsStaleWhenTheSnapshotIsTooOld()
    {
        var repository = new InMemorySnapshotRepository
        {
            StoredSnapshot = new InstagramFeedSnapshot
            {
                Source = "instagram",
                ProfileUrl = "https://www.instagram.com/your-handle/",
                FetchedAtUtc = new DateTimeOffset(2026, 4, 10, 8, 0, 0, TimeSpan.Zero),
                Items =
                [
                    new InstagramFeedItem
                    {
                        Id = "post-1",
                        Permalink = "https://www.instagram.com/p/post-1/",
                        MediaType = "IMAGE",
                        MediaUrl = "https://cdn.example.com/post-1.jpg",
                        TimestampUtc = new DateTimeOffset(2026, 4, 10, 7, 30, 0, TimeSpan.Zero)
                    }
                ]
            }
        };
        var service = CreateService(
            new FakeInstagramGraphClient(Array.Empty<InstagramFeedItem>()),
            repository,
            new FixedTimeProvider(new DateTimeOffset(2026, 4, 10, 12, 30, 0, TimeSpan.Zero)));

        var response = await service.GetResponseAsync(CancellationToken.None);

        Assert.Equal("stale", response.Status);
        Assert.Equal(repository.StoredSnapshot.FetchedAtUtc, response.FetchedAtUtc);
        Assert.Single(response.Items);
    }

    [Fact]
    public async Task GetResponseAsync_ReturnsUnavailableWhenNoSnapshotExists()
    {
        var service = CreateService(
            new FakeInstagramGraphClient(Array.Empty<InstagramFeedItem>()),
            new InMemorySnapshotRepository(),
            new FixedTimeProvider(new DateTimeOffset(2026, 4, 10, 12, 30, 0, TimeSpan.Zero)));

        var response = await service.GetResponseAsync(CancellationToken.None);

        Assert.Equal("unavailable", response.Status);
        Assert.Null(response.FetchedAtUtc);
        Assert.Empty(response.Items);
        Assert.Equal("https://www.instagram.com/your-handle/", response.ProfileUrl);
    }

    private static InstagramFeedService CreateService(
        IInstagramGraphClient client,
        IInstagramSnapshotRepository repository,
        TimeProvider timeProvider)
    {
        return new InstagramFeedService(
            client,
            repository,
            Microsoft.Extensions.Options.Options.Create(new InstagramOptions
            {
                AccessToken = "test-token",
                AccountId = "12345",
                ProfileUrl = "https://www.instagram.com/your-handle/",
                ItemLimit = 6
            }),
            timeProvider);
    }

    private sealed class InMemorySnapshotRepository : IInstagramSnapshotRepository
    {
        public InstagramFeedSnapshot? StoredSnapshot { get; set; }

        public Task<InstagramFeedSnapshot?> GetAsync(CancellationToken cancellationToken)
        {
            return Task.FromResult(StoredSnapshot);
        }

        public Task SaveAsync(InstagramFeedSnapshot snapshot, CancellationToken cancellationToken)
        {
            StoredSnapshot = snapshot;
            return Task.CompletedTask;
        }
    }

    private sealed class FakeInstagramGraphClient : IInstagramGraphClient
    {
        private readonly IReadOnlyList<InstagramFeedItem> _items;

        public FakeInstagramGraphClient(IReadOnlyList<InstagramFeedItem> items)
        {
            _items = items;
        }

        public Task<IReadOnlyList<InstagramFeedItem>> GetLatestMediaAsync(CancellationToken cancellationToken)
        {
            return Task.FromResult(_items);
        }
    }

    private sealed class FixedTimeProvider : TimeProvider
    {
        public FixedTimeProvider(DateTimeOffset currentTime)
        {
            CurrentTime = currentTime;
        }

        public DateTimeOffset CurrentTime { get; }

        public override DateTimeOffset GetUtcNow()
        {
            return CurrentTime;
        }
    }
}
