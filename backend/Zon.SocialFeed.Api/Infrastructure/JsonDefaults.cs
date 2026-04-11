using System.Text.Json;
using System.Text.Json.Serialization;

namespace Zon.SocialFeed.Api.Infrastructure;

public static class JsonDefaults
{
    public static readonly JsonSerializerOptions Options = new(JsonSerializerDefaults.Web)
    {
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
        PropertyNameCaseInsensitive = true
    };
}
