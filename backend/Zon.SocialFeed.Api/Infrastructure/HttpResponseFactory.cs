using System.Net;
using System.Text.Json;
using Microsoft.Azure.Functions.Worker.Http;

namespace Zon.SocialFeed.Api.Infrastructure;

public static class HttpResponseFactory
{
    public static async Task<HttpResponseData> CreateJsonAsync<T>(
        HttpRequestData request,
        HttpStatusCode statusCode,
        T payload,
        AllowedOrigins allowedOrigins,
        CancellationToken cancellationToken,
        string? cacheControl = null)
    {
        var response = request.CreateResponse(statusCode);
        ApplyStandardHeaders(request, response, allowedOrigins, cacheControl);
        await response.WriteStringAsync(JsonSerializer.Serialize(payload, JsonDefaults.Options), cancellationToken);
        return response;
    }

    public static HttpResponseData CreateOptionsResponse(HttpRequestData request, AllowedOrigins allowedOrigins)
    {
        var response = request.CreateResponse(HttpStatusCode.NoContent);
        ApplyStandardHeaders(request, response, allowedOrigins, cacheControl: null);
        return response;
    }

    private static void ApplyStandardHeaders(
        HttpRequestData request,
        HttpResponseData response,
        AllowedOrigins allowedOrigins,
        string? cacheControl)
    {
        response.Headers.Add("Content-Type", "application/json; charset=utf-8");
        response.Headers.Add("X-Content-Type-Options", "nosniff");
        response.Headers.Add("Vary", "Origin");
        response.Headers.Add("Access-Control-Allow-Methods", "GET, OPTIONS");
        response.Headers.Add("Access-Control-Allow-Headers", "Content-Type");

        if (!string.IsNullOrWhiteSpace(cacheControl))
        {
            response.Headers.Add("Cache-Control", cacheControl);
        }

        if (allowedOrigins.TryGetAllowedOrigin(request, out var allowedOrigin) && allowedOrigin is not null)
        {
            response.Headers.Add("Access-Control-Allow-Origin", allowedOrigin);
        }
    }
}
