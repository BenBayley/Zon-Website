using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Options;
using Zon.SocialFeed.Api.Options;

namespace Zon.SocialFeed.Api.Infrastructure;

public sealed class AllowedOrigins
{
    private static readonly string[] DevelopmentOrigins =
    [
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ];

    private readonly HashSet<string> _allowedOrigins = new(StringComparer.OrdinalIgnoreCase);

    public AllowedOrigins(IOptions<FrontendOptions> options)
    {
        foreach (var developmentOrigin in DevelopmentOrigins)
        {
            _allowedOrigins.Add(developmentOrigin);
        }

        var configuredOrigin = Normalize(options.Value.AllowedOrigin);
        if (!string.IsNullOrEmpty(configuredOrigin))
        {
            _allowedOrigins.Add(configuredOrigin);
        }
    }

    public bool TryGetAllowedOrigin(HttpRequestData request, out string? origin)
    {
        origin = null;

        if (!request.Headers.TryGetValues("Origin", out var values))
        {
            return false;
        }

        var requestedOrigin = Normalize(values.FirstOrDefault());
        if (requestedOrigin is null || !_allowedOrigins.Contains(requestedOrigin))
        {
            return false;
        }

        origin = requestedOrigin;
        return true;
    }

    private static string? Normalize(string? origin)
    {
        return string.IsNullOrWhiteSpace(origin)
            ? null
            : origin.Trim().TrimEnd('/');
    }
}
