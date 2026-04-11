using System.Net;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Zon.SocialFeed.Api.Infrastructure;
using Zon.SocialFeed.Api.Services;

namespace Zon.SocialFeed.Api.Functions;

public sealed class GetInstagramFeedFunction
{
    private readonly AllowedOrigins _allowedOrigins;
    private readonly InstagramFeedService _instagramFeedService;
    private readonly ILogger<GetInstagramFeedFunction> _logger;

    public GetInstagramFeedFunction(
        AllowedOrigins allowedOrigins,
        InstagramFeedService instagramFeedService,
        ILogger<GetInstagramFeedFunction> logger)
    {
        _allowedOrigins = allowedOrigins;
        _instagramFeedService = instagramFeedService;
        _logger = logger;
    }

    [Function(nameof(GetInstagramFeedFunction))]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", "options", Route = "social/instagram-feed")]
        HttpRequestData request,
        CancellationToken cancellationToken)
    {
        if (HttpMethods.IsOptions(request.Method))
        {
            return HttpResponseFactory.CreateOptionsResponse(request, _allowedOrigins);
        }

        try
        {
            var payload = await _instagramFeedService.GetResponseAsync(cancellationToken);
            return await HttpResponseFactory.CreateJsonAsync(
                request,
                HttpStatusCode.OK,
                payload,
                _allowedOrigins,
                cancellationToken,
                cacheControl: "public, max-age=300");
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, "Failed to serve the Instagram feed snapshot.");

            var fallbackPayload = _instagramFeedService.CreateUnavailableResponse();
            return await HttpResponseFactory.CreateJsonAsync(
                request,
                HttpStatusCode.OK,
                fallbackPayload,
                _allowedOrigins,
                cancellationToken,
                cacheControl: "no-store");
        }
    }
}
