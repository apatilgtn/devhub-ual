# Load .env and start DevHub locally (Windows)
# Usage: .\start-local.ps1   or   pwsh -File start-local.ps1

$envFile = Join-Path $PSScriptRoot ".env"
if (Test-Path $envFile) {
    Get-Content $envFile | Where-Object { $_ -match '^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$' } | ForEach-Object {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim()
        if ($value -match '^["''](.*)["'']$') { $value = $matches[1] }
        [Environment]::SetEnvironmentVariable($name, $value, 'Process')
    }
    Write-Host "Loaded .env"
}

$env:NODE_OPTIONS = "--max_old_space_size=2048"
Set-Location $PSScriptRoot
yarn start
