$htmlPath = "d:\my_projects\retro-1980\index.html"
$content = Get-Content -Path $htmlPath -Raw -Encoding UTF8

# Define mapping of Alt text to Filename
$mapping = @{
    "골목길 풍경"  = "images/retro_alley_marbles.png"
    "교실 풍경"   = "images/retro_classroom_winter.png"
    "거리 응원"   = "images/retro_olympics_street.png"
    "딱지치기"    = "images/retro_ddakkji_game.png"
    "추억의 도시락" = "images/retro_school_lunchbox.png"
    "불량식품"    = "images/retro_stationery_store_snacks.png"
    "프로야구"    = "images/retro_baseball_1982.png"
}

foreach ($alt in $mapping.Keys) {
    $filename = $mapping[$alt]
    # Regex to match src="data:..." ... alt="ALT"
    # We assume src comes before alt or after. My generated code usually has src first in these blocks.
    # Pattern: src="data:[^"]*" (anything until) alt="ALT"
    # We replace with src="$filename" (anything until) alt="ALT"
    
    # Try src first
    $pattern = 'src="data:image\/[^"]*"\s+(.*?)alt="' + [Regex]::Escape($alt) + '"'
    if ($content -match $pattern) {
        $content = $content -replace $pattern, ('src="' + $filename + '" $1alt="' + $alt + '"')
        Write-Host "Reset $alt to $filename (src first)"
    }
    else {
        # Try alt first
        $pattern = 'alt="' + [Regex]::Escape($alt) + '"(.*?)src="data:image\/[^"]*"'
        if ($content -match $pattern) {
            $content = $content -replace $pattern, ('alt="' + $alt + '"$1src="' + $filename + '"')
            Write-Host "Reset $alt to $filename (alt first)"
        }
        else {
            Write-Host "Could not find pattern for $alt"
        }
    }
}

$content | Set-Content -Path $htmlPath -Encoding UTF8
Write-Host "HTML reset complete."
