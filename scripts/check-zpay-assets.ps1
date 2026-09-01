Add-Type -AssemblyName System.Drawing

$expected = @{
  'icon.png' = '1024x1024'
  'splash-icon.png' = '512x512'
  'android-icon-foreground.png' = '1024x1024'
  'android-icon-background.png' = '1024x1024'
  'android-icon-monochrome.png' = '1024x1024'
  'favicon.png' = '64x64'
}

$assetDir = Join-Path (Resolve-Path (Join-Path $PSScriptRoot '..')) 'assets\images'
$failures = @()

foreach ($name in $expected.Keys) {
  $path = Join-Path $assetDir $name
  if (-not (Test-Path $path)) {
    $failures += "$name is missing."
    continue
  }

  $image = [System.Drawing.Image]::FromFile($path)
  $actual = "$($image.Width)x$($image.Height)"
  $image.Dispose()

  Write-Output "$name $actual"
  if ($actual -ne $expected[$name]) {
    $failures += "$name expected $($expected[$name]) but got $actual."
  }
}

if ($failures.Length -gt 0) {
  Write-Error ($failures -join "`n")
  exit 1
}

Write-Output 'ZPAY app asset dimensions verified.'
