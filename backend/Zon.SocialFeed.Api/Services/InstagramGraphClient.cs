using System.Globalization;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Options;
using Zon.SocialFeed.Api.Infrastructure;
using Zon.SocialFeed.Api.Models;
using Zon.SocialFeed.Api.Options;

namespace Zon.SocialFeed.Api.Services;

public sealed class InstagramGraphClient : IInstagramGraphClient
{
    private readonly HttpClient _httpClient;
    private readonly InstagramOptions _options;

    public InstagramGraphClient(HttpClient httpClient, IOptions<InstagramOptions> options)
    {
        _httpClient = httpClient;
        _options = options.Value;
    }

    public async Task<IReadOnlyList<InstagramFeedItem>> GetLatestMediaAsync(CancellationToken cancellationToken)
    {
        var requestUri =
            $"{_options.AccountId}/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,children{{media_type,media_url,thumbnail_url}}&limit={_options.ItemLimit}";

        using var request = new HttpRequestMessage(HttpMethod.Get, requestUri);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _options.AccessToken);

        using var response = await _httpClient.SendAsync(request, cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            var responseBody = await response.Content.ReadAsStringAsync(cancellationToken);
            throw new InvalidOperationException(
                $"Instagram Graph API request failed with status {(int)response.StatusCode}: {responseBody}");
        }

        var graphResponse = await response.Content.ReadFromJsonAsync<InstagramGraphMediaResponse>(
            JsonDefaults.Options,
            cancellationToken);

        if (graphResponse?.Data is null)
        {
            throw new InvalidOperationException("Instagram Graph API returned an empty media payload.");
        }

        return graphResponse.Data
            .Select(MapItem)
            .OrderByDescending(item => item.TimestampUtc)
            .ToArray();
    }

    private static InstagramFeedItem MapItem(InstagramGraphMediaItem item)
    {
        var mediaUrl = FirstNonEmpty(
            item.MediaUrl,
            item.Children?.Data
                .Select(child => FirstNonEmpty(child.MediaUrl, child.ThumbnailUrl))
                .FirstOrDefault(value => !string.IsNullOrWhiteSpace(value)));

        if (string.IsNullOrWhiteSpace(item.Id)
            || string.IsNullOrWhiteSpace(item.Permalink)
            || string.IsNullOrWhiteSpace(mediaUrl)
            || !DateTimeOffset.TryParse(item.Timestamp, CultureInfo.InvariantCulture, DateTimeStyles.AssumeUniversal, out var parsedTimestamp))
        {
            throw new InvalidOperationException("Instagram Graph API returned a media item with missing required fields.");
        }

        var thumbnailUrl = FirstNonEmpty(
            item.ThumbnailUrl,
            item.Children?.Data
                .Select(child => FirstNonEmpty(child.ThumbnailUrl, child.MediaUrl))
                .FirstOrDefault(value => !string.IsNullOrWhiteSpace(value)));

        return new InstagramFeedItem
        {
            Id = item.Id,
            Permalink = item.Permalink,
            Caption = NormalizeOptional(item.Caption),
            MediaType = NormalizeMediaType(item.MediaType),
            MediaUrl = mediaUrl,
            ThumbnailUrl = NormalizeOptional(thumbnailUrl),
            TimestampUtc = parsedTimestamp.ToUniversalTime()
        };
    }

    private static string FirstNonEmpty(params string?[] values)
    {
        return values.FirstOrDefault(value => !string.IsNullOrWhiteSpace(value)) ?? string.Empty;
    }

    private static string NormalizeMediaType(string? mediaType)
    {
        return string.IsNullOrWhiteSpace(mediaType)
            ? "IMAGE"
            : mediaType.Trim().ToUpperInvariant();
    }

    private static string? NormalizeOptional(string? value)
    {
        return string.IsNullOrWhiteSpace(value)
            ? null
            : value.Trim();
    }

    private sealed class InstagramGraphMediaResponse
    {
        [JsonPropertyName("data")]
        public List<InstagramGraphMediaItem> Data { get; init; } = [];
    }

    private sealed class InstagramGraphMediaItem
    {
        [JsonPropertyName("id")]
        public string? Id { get; init; }

        [JsonPropertyName("caption")]
        public string? Caption { get; init; }

        [JsonPropertyName("media_type")]
        public string? MediaType { get; init; }

        [JsonPropertyName("media_url")]
        public string? MediaUrl { get; init; }

        [JsonPropertyName("permalink")]
        public string? Permalink { get; init; }

        [JsonPropertyName("thumbnail_url")]
        public string? ThumbnailUrl { get; init; }

        [JsonPropertyName("timestamp")]
        public string? Timestamp { get; init; }

        [JsonPropertyName("children")]
        public InstagramGraphChildren? Children { get; init; }
    }

    private sealed class InstagramGraphChildren
    {
        [JsonPropertyName("data")]
        public List<InstagramGraphChildItem> Data { get; init; } = [];
    }

    private sealed class InstagramGraphChildItem
    {
        [JsonPropertyName("media_type")]
        public string? MediaType { get; init; }

        [JsonPropertyName("media_url")]
        public string? MediaUrl { get; init; }

        [JsonPropertyName("thumbnail_url")]
        public string? ThumbnailUrl { get; init; }
    }
}
