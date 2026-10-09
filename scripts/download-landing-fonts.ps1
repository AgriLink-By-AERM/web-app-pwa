$ErrorActionPreference = 'Stop'
$fontDirectory = Join-Path $PSScriptRoot '../public/fonts'
New-Item -ItemType Directory -Force -Path $fontDirectory | Out-Null
$families = @('Inter:wght@400;500;600;700', 'Poppins:wght@600;700', 'JetBrains+Mono:wght@400;600;700')
$fontCss = ''
foreach ($family in $families) {
  $response = Invoke-WebRequest -Uri ('https://fonts.googleapis.com/css2?family=' + $family + '&display=swap')
  $cssText = $response.Content
  foreach ($match in [regex]::Matches($cssText, 'https://fonts\.gstatic\.com/[^)\s]+')) {
    $fontUrl = $match.Value
    $fontName = ($fontUrl -split '/')[-1]
    Invoke-WebRequest -Uri $fontUrl -OutFile (Join-Path $fontDirectory $fontName)
    $cssText = $cssText.Replace($fontUrl, '/fonts/' + $fontName)
  }
  $fontCss += $cssText + "`n"
}
Set-Content -LiteralPath (Join-Path $PSScriptRoot '../features/landing/fonts.css') -Value $fontCss
