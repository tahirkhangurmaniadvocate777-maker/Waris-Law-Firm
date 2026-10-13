# Convert WARIS-LAW-FIRM-COMPLETE-PLAN.md to a multi-page PDF (no Word/Node).
$ErrorActionPreference = "Stop"

$mdPath = Join-Path $PSScriptRoot "..\WARIS-LAW-FIRM-COMPLETE-PLAN.md"
$pdfPath = Join-Path $PSScriptRoot "..\Waris-Law-Firm-Website-Plan.pdf"
$mdPath = [System.IO.Path]::GetFullPath($mdPath)
$pdfPath = [System.IO.Path]::GetFullPath($pdfPath)

$md = Get-Content -Path $mdPath -Raw -Encoding UTF8

function Escape-Pdf([string]$s) {
  if ($null -eq $s) { return "" }
  $s = $s -replace '\\', '\\'
  $s = $s -replace '\(', '\('
  $s = $s -replace '\)', '\)'
  $chars = [System.Text.StringBuilder]::new()
  foreach ($ch in $s.ToCharArray()) {
    $code = [int][char]$ch
    if ($code -eq 9) { [void]$chars.Append(' '); continue }
    if ($code -ge 32 -and $code -le 126) { [void]$chars.Append($ch); continue }
    switch ($ch) {
      ([char]0x2014) { [void]$chars.Append('--'); break }
      ([char]0x2013) { [void]$chars.Append('-'); break }
      ([char]0x2018) { [void]$chars.Append("'"); break }
      ([char]0x2019) { [void]$chars.Append("'"); break }
      ([char]0x201C) { [void]$chars.Append('"'); break }
      ([char]0x201D) { [void]$chars.Append('"'); break }
      ([char]0x2022) { [void]$chars.Append('*'); break }
      ([char]0x00D7) { [void]$chars.Append('x'); break }
      default {
        if ($code -gt 126 -and $code -lt 256) { [void]$chars.Append([char]$code) }
        else { [void]$chars.Append('?') }
      }
    }
  }
  return $chars.ToString()
}

function Wrap-Text([string]$text, [int]$width) {
  $out = New-Object System.Collections.Generic.List[string]
  if ([string]::IsNullOrEmpty($text)) { $out.Add(''); return ,$out.ToArray() }
  $words = $text -split '\s+'
  $cur = ''
  foreach ($w in $words) {
    if ($cur -eq '') { $cur = $w; continue }
    if (($cur.Length + 1 + $w.Length) -le $width) {
      $cur = "$cur $w"
    } else {
      $out.Add($cur)
      $cur = $w
      while ($cur.Length -gt $width) {
        $out.Add($cur.Substring(0, $width))
        $cur = $cur.Substring($width)
      }
    }
  }
  if ($cur -ne '') { $out.Add($cur) }
  return ,$out.ToArray()
}

$rawLines = $md -split "`r?`n"
$items = New-Object System.Collections.Generic.List[object]
foreach ($line in $rawLines) {
  $t = $line.TrimEnd()
  if ($t -eq '---') {
    $items.Add([pscustomobject]@{ Kind = 'rule'; Text = '' }) | Out-Null
    continue
  }
  if ($t -match '^# (.+)$') {
    $items.Add([pscustomobject]@{ Kind = 'h1'; Text = $Matches[1] }) | Out-Null
    continue
  }
  if ($t -match '^## (.+)$') {
    $items.Add([pscustomobject]@{ Kind = 'h2'; Text = $Matches[1] }) | Out-Null
    continue
  }
  if ($t -match '^### (.+)$') {
    $items.Add([pscustomobject]@{ Kind = 'h3'; Text = $Matches[1] }) | Out-Null
    continue
  }
  if ($t -match '^```') {
    $items.Add([pscustomobject]@{ Kind = 'codefence'; Text = '' }) | Out-Null
    continue
  }
  if ($t -eq '') {
    $items.Add([pscustomobject]@{ Kind = 'blank'; Text = '' }) | Out-Null
    continue
  }
  if ($t -match '^\|[-:| ]+\|$') { continue }
  $plain = $t -replace '\*\*([^*]+)\*\*', '$1'
  $plain = $plain -replace '`([^`]+)`', '$1'
  $plain = $plain -replace '^\|', ''
  $plain = $plain -replace '\|$', ''
  $plain = $plain -replace '\|', ' | '
  $items.Add([pscustomobject]@{ Kind = 'p'; Text = $plain }) | Out-Null
}

$pageW = 612.0
$pageH = 792.0
$marginL = 54.0
$marginB = 54.0
$marginT = 54.0
$maxChars = 92

$pages = New-Object System.Collections.Generic.List[string]
$inCode = $false
$y = $pageH - $marginT
$sb = [System.Text.StringBuilder]::new()
[void]$sb.AppendLine("BT")

function Flush-Page {
  [void]$script:sb.AppendLine("ET")
  $script:pages.Add($script:sb.ToString())
  $script:sb = [System.Text.StringBuilder]::new()
  [void]$script:sb.AppendLine("BT")
  $script:y = $pageH - $marginT
}

function Ensure-Space([double]$need) {
  if (($script:y - $need) -lt $marginB) {
    Flush-Page
  }
}

function Write-PdfLine([string]$text, [string]$font, [double]$size, [double]$leading) {
  Ensure-Space $leading
  $esc = Escape-Pdf $text
  [void]$script:sb.AppendLine("/$font $size Tf")
  [void]$script:sb.AppendLine("1 0 0 1 $marginL $($script:y) Tm")
  [void]$script:sb.AppendLine("($esc) Tj")
  $script:y -= $leading
}

foreach ($item in $items) {
  switch ($item.Kind) {
    'codefence' { $inCode = -not $inCode; continue }
    'blank' {
      $y -= 8
      if ($y -lt $marginB) { Flush-Page }
      continue
    }
    'rule' {
      Ensure-Space 16
      Write-PdfLine (('-' * 86)) 'F1' 8 14
      continue
    }
    'h1' {
      Ensure-Space 36
      $y -= 6
      foreach ($wl in (Wrap-Text $item.Text 70)) {
        Write-PdfLine $wl 'F2' 16 20
      }
      $y -= 6
      continue
    }
    'h2' {
      Ensure-Space 30
      $y -= 8
      foreach ($wl in (Wrap-Text $item.Text 78)) {
        Write-PdfLine $wl 'F2' 13 16
      }
      $y -= 4
      continue
    }
    'h3' {
      Ensure-Space 24
      $y -= 4
      foreach ($wl in (Wrap-Text $item.Text 82)) {
        Write-PdfLine $wl 'F2' 11 14
      }
      continue
    }
    default {
      $width = if ($inCode) { 88 } else { $maxChars }
      $size = if ($inCode) { 8.5 } else { 10 }
      $lead = if ($inCode) { 11 } else { 13 }
      foreach ($wl in (Wrap-Text $item.Text $width)) {
        Write-PdfLine $wl 'F1' $size $lead
      }
    }
  }
}
Flush-Page

$pageCount = $pages.Count
Write-Host "Built $pageCount content pages"

$contentIds = New-Object System.Collections.Generic.List[int]
$pageIds = New-Object System.Collections.Generic.List[int]
$id = 5
for ($i = 0; $i -lt $pageCount; $i++) {
  $contentIds.Add($id) | Out-Null; $id++
  $pageIds.Add($id) | Out-Null; $id++
}

$finalObjs = New-Object System.Collections.Generic.List[string]
$finalObjs.Add($null) # index 0
$finalObjs.Add("<< /Type /Catalog /Pages 2 0 R >>")
$kids = ($pageIds | ForEach-Object { "$_ 0 R" }) -join ' '
$finalObjs.Add("<< /Type /Pages /Kids [$kids] /Count $pageCount >>")
$finalObjs.Add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>")
$finalObjs.Add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>")

# Fill slots 5.. in id order: content, page, content, page...
for ($i = 0; $i -lt $pageCount; $i++) {
  $stream = $pages[$i]
  $len = [System.Text.Encoding]::ASCII.GetByteCount($stream)
  $finalObjs.Add("<< /Length $len >>`nstream`n$stream`nendstream")
  $finalObjs.Add("<< /Type /Page /Parent 2 0 R /MediaBox [0 0 $pageW $pageH] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents $($contentIds[$i]) 0 R >>")
}

$ms = New-Object System.IO.MemoryStream
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
$sw = New-Object System.IO.StreamWriter($ms, [System.Text.Encoding]::ASCII, 1024, $true)
$sw.NewLine = "`n"
$sw.WriteLine("%PDF-1.4")
$sw.Flush()
$ms.WriteByte(0x25)
$ms.WriteByte(0xE2); $ms.WriteByte(0xE3); $ms.WriteByte(0xCF); $ms.WriteByte(0xD3)
$ms.WriteByte(0x0A)

$offsets = New-Object System.Collections.Generic.List[long]
$offsets.Add(0)
for ($oi = 1; $oi -lt $finalObjs.Count; $oi++) {
  $offsets.Add($ms.Position)
  $sw.WriteLine("$oi 0 obj")
  $sw.WriteLine($finalObjs[$oi])
  $sw.WriteLine("endobj")
  $sw.Flush()
}

$xrefPos = $ms.Position
$count = $finalObjs.Count
$sw.WriteLine("xref")
$sw.WriteLine("0 $count")
$sw.WriteLine("0000000000 65535 f ")
for ($oi = 1; $oi -lt $count; $oi++) {
  $sw.WriteLine(("{0:D10} 00000 n " -f $offsets[$oi]))
}
$sw.WriteLine("trailer")
$sw.WriteLine("<< /Size $count /Root 1 0 R >>")
$sw.WriteLine("startxref")
$sw.WriteLine("$xrefPos")
$sw.Write("%%EOF`n")
$sw.Flush()
$sw.Dispose()

[System.IO.File]::WriteAllBytes($pdfPath, $ms.ToArray())
$ms.Dispose()

$info = Get-Item $pdfPath
Write-Host "PDF: $($info.FullName)"
Write-Host "Bytes: $($info.Length)"
Write-Host "Pages: $pageCount"
