Add-Type -AssemblyName System.Drawing

$root = Resolve-Path (Join-Path $PSScriptRoot '..')
$out = Join-Path $root 'assets\images'

function New-Color([int] $r, [int] $g, [int] $b, [int] $a = 255) {
  [System.Drawing.Color]::FromArgb($a, $r, $g, $b)
}

function New-Brush([System.Drawing.Color] $color) {
  New-Object System.Drawing.SolidBrush($color)
}

function Save-Png($bitmap, [string] $path) {
  $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $bitmap.Dispose()
}

function Draw-RoundedRectangle($graphics, [float] $x, [float] $y, [float] $w, [float] $h, [float] $r, $brush) {
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $d = $r * 2
  $path.AddArc($x, $y, $d, $d, 180, 90)
  $path.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
  $path.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
  $path.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
  $path.CloseFigure()
  $graphics.FillPath($brush, $path)
  $path.Dispose()
}

function Draw-Mark($graphics, [int] $size, [bool] $monochrome = $false) {
  $scale = $size / 1024.0
  $blue = if ($monochrome) { New-Color 255 255 255 } else { New-Color 0 102 255 }
  $green = if ($monochrome) { New-Color 255 255 255 } else { New-Color 0 176 80 }
  $cyan = if ($monochrome) { New-Color 255 255 255 } else { New-Color 0 244 254 }
  $greenLight = if ($monochrome) { New-Color 255 255 255 } else { New-Color 72 230 64 }
  $dark = New-Color 11 26 43
  $white = New-Color 255 255 255

  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

  $pen = New-Object System.Drawing.Pen((New-Color $cyan.R $cyan.G $cyan.B 120), [Math]::Max(8, 18 * $scale))
  $graphics.DrawEllipse($pen, 185 * $scale, 170 * $scale, 654 * $scale, 654 * $scale)
  $pen.Dispose()

  $speedBrush = New-Brush $greenLight
  Draw-RoundedRectangle $graphics (190 * $scale) (425 * $scale) (190 * $scale) (28 * $scale) (14 * $scale) $speedBrush
  Draw-RoundedRectangle $graphics (190 * $scale) (475 * $scale) (255 * $scale) (28 * $scale) (14 * $scale) $speedBrush
  Draw-RoundedRectangle $graphics (190 * $scale) (528 * $scale) (165 * $scale) (28 * $scale) (14 * $scale) $speedBrush
  $speedBrush.Dispose()

  $blueBrush = New-Brush $blue
  $greenBrush = New-Brush $green

  Draw-RoundedRectangle $graphics (335 * $scale) (245 * $scale) (420 * $scale) (120 * $scale) (52 * $scale) $blueBrush
  $points = @(
    [System.Drawing.PointF]::new(685 * $scale, 245 * $scale),
    [System.Drawing.PointF]::new(795 * $scale, 245 * $scale),
    [System.Drawing.PointF]::new(370 * $scale, 780 * $scale),
    [System.Drawing.PointF]::new(260 * $scale, 780 * $scale)
  )
  $graphics.FillPolygon($blueBrush, $points)

  Draw-RoundedRectangle $graphics (265 * $scale) (660 * $scale) (425 * $scale) (120 * $scale) (52 * $scale) $greenBrush
  $points = @(
    [System.Drawing.PointF]::new(385 * $scale, 660 * $scale),
    [System.Drawing.PointF]::new(505 * $scale, 660 * $scale),
    [System.Drawing.PointF]::new(795 * $scale, 365 * $scale),
    [System.Drawing.PointF]::new(675 * $scale, 365 * $scale)
  )
  $graphics.FillPolygon($greenBrush, $points)

  $whiteBrush = New-Brush $white
  $playBrush = New-Brush $(if ($monochrome) { $dark } else { $green })
  $graphics.FillEllipse($whiteBrush, 405 * $scale, 407 * $scale, 190 * $scale, 190 * $scale)
  $points = @(
    [System.Drawing.PointF]::new(477 * $scale, 452 * $scale),
    [System.Drawing.PointF]::new(477 * $scale, 552 * $scale),
    [System.Drawing.PointF]::new(560 * $scale, 502 * $scale)
  )
  $graphics.FillPolygon($playBrush, $points)

  $blueBrush.Dispose()
  $greenBrush.Dispose()
  $whiteBrush.Dispose()
  $playBrush.Dispose()
}

function New-AppIcon {
  $bitmap = New-Object System.Drawing.Bitmap(1024, 1024, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.Clear((New-Color 11 26 43))
  $graphics.FillEllipse((New-Brush (New-Color 0 244 254 45)), -220, -180, 700, 700)
  $graphics.FillEllipse((New-Brush (New-Color 0 102 255 60)), 650, 600, 570, 580)
  $state = $graphics.Save()
  $graphics.TranslateTransform(132, 132)
  $graphics.ScaleTransform(0.742, 0.742)
  Draw-Mark $graphics 1024 $false
  $graphics.Restore($state)
  $graphics.Dispose()
  $bitmap
}

function New-TransparentMark([int] $size, [bool] $monochrome = $false) {
  $bitmap = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.Clear([System.Drawing.Color]::Transparent)
  Draw-Mark $graphics $size $monochrome
  $graphics.Dispose()
  $bitmap
}

function New-AndroidBackground {
  $bitmap = New-Object System.Drawing.Bitmap(1024, 1024, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.Clear((New-Color 11 26 43))
  $graphics.FillEllipse((New-Brush (New-Color 0 90 180 120)), -180, -220, 760, 760)
  $graphics.FillEllipse((New-Brush (New-Color 0 176 80 110)), 550, 610, 670, 670)
  $graphics.Dispose()
  $bitmap
}

function New-AndroidForeground {
  $bitmap = New-Object System.Drawing.Bitmap(1024, 1024, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.Clear([System.Drawing.Color]::Transparent)
  $state = $graphics.Save()
  $graphics.TranslateTransform(172, 172)
  $graphics.ScaleTransform(0.664, 0.664)
  Draw-Mark $graphics 1024 $false
  $graphics.Restore($state)
  $graphics.Dispose()
  $bitmap
}

function New-Favicon {
  $bitmap = New-Object System.Drawing.Bitmap(64, 64, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.Clear((New-Color 11 26 43))
  $state = $graphics.Save()
  $graphics.TranslateTransform(7, 7)
  $graphics.ScaleTransform(0.0488, 0.0488)
  Draw-Mark $graphics 1024 $false
  $graphics.Restore($state)
  $graphics.Dispose()
  $bitmap
}

Save-Png (New-AppIcon) (Join-Path $out 'icon.png')
Save-Png (New-TransparentMark 512 $false) (Join-Path $out 'splash-icon.png')
Save-Png (New-AndroidForeground) (Join-Path $out 'android-icon-foreground.png')
Save-Png (New-AndroidBackground) (Join-Path $out 'android-icon-background.png')
Save-Png (New-TransparentMark 1024 $true) (Join-Path $out 'android-icon-monochrome.png')
Save-Png (New-Favicon) (Join-Path $out 'favicon.png')

Write-Output 'Generated ZPAY app assets in assets/images'
