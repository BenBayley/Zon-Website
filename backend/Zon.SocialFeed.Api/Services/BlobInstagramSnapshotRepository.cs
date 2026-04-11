using Azure.Storage.Blobs;
using Microsoft.Extensions.Configuration;
using Zon.SocialFeed.Api.Infrastructure;
using Zon.SocialFeed.Api.Models;

namespace Zon.SocialFeed.Api.Services;

public sealed class BlobInstagramSnapshotRepository : IInstagramSnapshotRepository
{
    private const string ContainerName = "social-feed-cache";
    private const string BlobName = "instagram-feed.json";

    private readonly BlobContainerClient _containerClient;

    public BlobInstagramSnapshotRepository(IConfiguration configuration)
    {
        var connectionString = configuration["AzureWebJobsStorage"];
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidOperationException("AzureWebJobsStorage must be configured for the social feed backend.");
        }

        var blobServiceClient = new BlobServiceClient(connectionString);
        _containerClient = blobServiceClient.GetBlobContainerClient(ContainerName);
    }

    public async Task<InstagramFeedSnapshot?> GetAsync(CancellationToken cancellationToken)
    {
        var blobClient = _containerClient.GetBlobClient(BlobName);
        if (!await blobClient.ExistsAsync(cancellationToken))
        {
            return null;
        }

        var blobDownload = await blobClient.DownloadContentAsync(cancellationToken);
        return blobDownload.Value.Content.ToObjectFromJson<InstagramFeedSnapshot>(JsonDefaults.Options);
    }

    public async Task SaveAsync(InstagramFeedSnapshot snapshot, CancellationToken cancellationToken)
    {
        await _containerClient.CreateIfNotExistsAsync(cancellationToken: cancellationToken);

        var blobClient = _containerClient.GetBlobClient(BlobName);
        var payload = BinaryData.FromObjectAsJson(snapshot, JsonDefaults.Options);
        await blobClient.UploadAsync(payload, overwrite: true, cancellationToken);
    }
}
