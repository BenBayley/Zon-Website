param(
  [int]$Port = 5173,
  [string]$HostName = '127.0.0.1',
  [switch]$LocalOnly
)

$ErrorActionPreference = 'Stop'

$websiteRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
$localUrl = "http://${HostName}:$Port/"
$viteOutLog = Join-Path $env:TEMP 'ben-bayley-vite.out.log'
$viteErrLog = Join-Path $env:TEMP 'ben-bayley-vite.err.log'
$startedVite = $null

function Test-LocalSite {
  try {
    $response = Invoke-WebRequest -Uri $localUrl -UseBasicParsing -TimeoutSec 3
    return [int]$response.StatusCode -eq 200
  } catch {
    return $false
  }
}

function Wait-ForLocalSite {
  for ($attempt = 0; $attempt -lt 40; $attempt++) {
    if (Test-LocalSite) {
      return $true
    }

    Start-Sleep -Milliseconds 500
  }

  return $false
}

try {
  if (-not (Get-Command npm.cmd -ErrorAction SilentlyContinue)) {
    throw 'npm.cmd was not found on PATH. Install Node.js / npm, then run npm install from the website folder.'
  }

  if (-not $LocalOnly -and -not (Get-Command cloudflared -ErrorAction SilentlyContinue)) {
    throw 'cloudflared was not found on PATH. Install Cloudflare Tunnel / cloudflared first.'
  }

  if (-not (Test-LocalSite)) {
    Write-Host "Starting Vite at $localUrl ..."

    $viteArgs = @('run', 'dev', '--', '--host', $HostName, '--port', "$Port", '--strictPort')
    $startedVite = Start-Process -FilePath 'npm.cmd' -ArgumentList $viteArgs -WorkingDirectory $websiteRoot -RedirectStandardOutput $viteOutLog -RedirectStandardError $viteErrLog -PassThru -WindowStyle Hidden

    if (-not (Wait-ForLocalSite)) {
      Write-Host 'Vite did not become ready. Recent Vite output:'

      if (Test-Path $viteOutLog) {
        Get-Content $viteOutLog -Tail 80
      }

      if (Test-Path $viteErrLog) {
        Get-Content $viteErrLog -Tail 80
      }

      throw "Could not start Vite at $localUrl."
    }
  }

  Write-Host "Local site: $localUrl"

  if ($LocalOnly) {
    Write-Host 'LocalOnly set; skipping Cloudflare Tunnel.'
    return
  }

  Write-Host 'Cloudflare Tunnel is starting. Share the https://*.trycloudflare.com URL that cloudflared prints below.'
  Write-Host 'Press Ctrl+C to stop sharing.'

  & cloudflared tunnel --url $localUrl
} finally {
  if ($startedVite -and -not $startedVite.HasExited) {
    $startedVite.Kill($true)
    $startedVite.Dispose()
  }
}
