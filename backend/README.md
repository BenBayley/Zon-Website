# Social Feed Backend

This repo now includes a small Azure Functions backend for the Instagram feed shown on the Cloudflare Pages site.

## Project layout

- `backend/Zon.SocialFeed.Api/`: .NET 8 Azure Functions isolated worker app
- `backend/Zon.SocialFeed.Api.Tests/`: unit tests for the feed orchestration logic

## Prerequisites

- .NET 8 SDK
- Azure Functions Core Tools for local hosting
- Either Azurite or an Azure Storage account connection string for `AzureWebJobsStorage`

## Local setup

1. Copy `backend/Zon.SocialFeed.Api/local.settings.json.example` to `backend/Zon.SocialFeed.Api/local.settings.json`.
2. Fill in the Instagram and frontend values.
3. Run:

```powershell
dotnet build backend/Zon.SocialFeed.Api/Zon.SocialFeed.Api.csproj
dotnet test backend/Zon.SocialFeed.Api.Tests/Zon.SocialFeed.Api.Tests.csproj
cd backend/Zon.SocialFeed.Api
func start
```

The public feed endpoint is exposed at `http://localhost:7071/api/social/instagram-feed`.

## Required configuration

`local.settings.json` and Azure app settings need these values:

- `AzureWebJobsStorage`
- `FUNCTIONS_WORKER_RUNTIME=dotnet-isolated`
- `Instagram__AccessToken`
- `Instagram__AccountId`
- `Instagram__ProfileUrl`
- `Instagram__ItemLimit`
- `Frontend__AllowedOrigin`

## GitHub deployment workflow

`.github/workflows/deploy-backend.yml` builds, tests, publishes, and deploys the backend when `backend/**` changes on `main`.

Required GitHub secrets:

- `AZURE_FUNCTIONAPP_NAME`
- `AZURE_FUNCTIONAPP_PUBLISH_PROFILE`
