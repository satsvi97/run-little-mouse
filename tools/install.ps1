# install.ps1 - installs "Run, little mouse..." into a local SillyTavern copy.
#
# Usage (from the repository root):
#   powershell -ExecutionPolicy Bypass -File tools/install.ps1 -StPath "C:\SillyTavern"
#
# What it does:
#   1. copies assets/*  ->  <ST>\public\nightwood\
#   2. copies dist\run-little-mouse.json -> <ST>\data\default-user\themes\
# Then open SillyTavern, pick the theme "Run, little mouse..." and refresh.

param(
    [Parameter(Mandatory = $true)]
    [string]$StPath
)

$ErrorActionPreference = 'Stop'

$repo = Split-Path -Parent $PSScriptRoot

if (-not (Test-Path (Join-Path $StPath 'public'))) {
    throw "SillyTavern not found at '$StPath' (no 'public' folder). Pass -StPath with the folder that contains server.js"
}

$assetsSrc = Join-Path $repo 'assets'
$assetsDst = Join-Path $StPath 'public\nightwood'
New-Item -ItemType Directory -Path $assetsDst -Force | Out-Null
Copy-Item (Join-Path $assetsSrc '*') -Destination $assetsDst -Force
Write-Host "assets  -> $assetsDst" -ForegroundColor Green

$themeSrc = Join-Path $repo 'dist\run-little-mouse.json'
$themesDst = Join-Path $StPath 'data\default-user\themes'
New-Item -ItemType Directory -Path $themesDst -Force | Out-Null
Copy-Item $themeSrc -Destination $themesDst -Force
Write-Host "theme   -> $themesDst" -ForegroundColor Green

Write-Host ""
Write-Host "Done. Open SillyTavern, choose the theme 'Run, little mouse...' and press Ctrl+Shift+R." -ForegroundColor Cyan
