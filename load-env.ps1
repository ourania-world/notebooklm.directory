# load-env.ps1
Get-Content .env.local | ForEach-Object {
    if ($_ -match '^\s*([^#][^=]+?)\s*=\s*(.+)$') {
        $key = $matches[1]
        $value = $matches[2] -replace '^"|"$', ''  # remove any quotes
        [System.Environment]::SetEnvironmentVariable($key, $value, 'Process')
    }
}
Write-Host "✅ Environment variables loaded into this PowerShell session."
