$htmlPath = "d:\my_projects\retro-1980\index.html"
$images = @(
    "retro_alley_marbles.png",
    "retro_classroom_winter.png",
    "retro_olympics_street.png",
    "retro_ddakkji_game.png",
    "retro_school_lunchbox.png",
    "retro_stationery_store_snacks.png",
    "retro_baseball_1982.png",
    "retro_nametag_handkerchief.png",
    "retro_stool_envelope.png",
    "retro_chalkboard_names.png",
    "retro_school_uniform_reveal.png"
)

$content = Get-Content -Path $htmlPath -Raw -Encoding UTF8

foreach ($img in $images) {
    $imgPath = "d:\my_projects\retro-1980\images\$img"
    if (Test-Path $imgPath) {
        $bytes = [System.IO.File]::ReadAllBytes($imgPath)
        $b64 = [System.Convert]::ToBase64String($bytes)
        $newSrc = "data:image/png;base64,$b64"
        
        # Replace the specific src attribute
        $target = "src=""images/$img"""
        $replacement = "src=""$newSrc"""
        $content = $content.Replace($target, $replacement)
        Write-Host "Embedded $img"
    }
    else {
        Write-Warning "Image not found: $img"
    }
}

Set-Content -Path $htmlPath -Value $content -Encoding UTF8
Write-Host "Done embedding images."
