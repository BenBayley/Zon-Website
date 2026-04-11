using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Zon.SocialFeed.Api.Infrastructure;
using Zon.SocialFeed.Api.Options;
using Zon.SocialFeed.Api.Services;

var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults()
    .ConfigureServices((context, services) =>
    {
        services.AddOptions<InstagramOptions>()
            .Bind(context.Configuration.GetSection(InstagramOptions.SectionName))
            .ValidateDataAnnotations()
            .ValidateOnStart();

        services.AddOptions<FrontendOptions>()
            .Bind(context.Configuration.GetSection(FrontendOptions.SectionName))
            .ValidateDataAnnotations()
            .ValidateOnStart();

        services.AddSingleton(TimeProvider.System);
        services.AddSingleton<AllowedOrigins>();
        services.AddSingleton<IInstagramSnapshotRepository, BlobInstagramSnapshotRepository>();
        services.AddSingleton<InstagramFeedService>();

        services.AddHttpClient<IInstagramGraphClient, InstagramGraphClient>(client =>
        {
            client.BaseAddress = new Uri("https://graph.facebook.com/v23.0/");
            client.Timeout = TimeSpan.FromSeconds(15);
        });
    })
    .Build();

await host.RunAsync();
