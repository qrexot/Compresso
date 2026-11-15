$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$target = 'x86_64-pc-windows-msvc'
$expectedSha256 = '60f467265b1e312373dbcd92200c2618a74850f98d3d078e94296bb3fa2047ba'
$url = 'https://www.gyan.dev/ffmpeg/builds/packages/ffmpeg-9.0.2-essentials_build.zip'
$tempRoot = Join-Path ([System.IO.Path]::GetTempPath()) ('compresso-build-' + [guid]::NewGuid().ToString('N'))
$archive = Join-Path $tempRoot 'ffmpeg.zip'
$unpacked = Join-Path $tempRoot 'ffmpeg'
$staging = Join-Path $tempRoot 'payload'
New-Item -ItemType Directory -Force $tempRoot,$unpacked,$staging | Out-Null
try {
    if (-not (Get-Command cargo -ErrorAction SilentlyContinue)) { throw 'Rust and Cargo are required.' }
    if (-not (Get-Command rustup -ErrorAction SilentlyContinue)) { throw 'rustup is required.' }
    rustup target add $target
    if ($LASTEXITCODE -ne 0) { throw 'Could not install the Rust Windows target.' }

    Write-Host 'Downloading FFmpeg 9.0.2...'
    Invoke-WebRequest -Uri $url -OutFile $archive -UseBasicParsing
    if ((Get-FileHash -Algorithm SHA256 -LiteralPath $archive).Hash.ToLowerInvariant() -ne $expectedSha256) {
        throw 'FFmpeg archive checksum does not match.'
    }
    Expand-Archive -LiteralPath $archive -DestinationPath $unpacked
    $binaryFolder = Join-Path $unpacked 'ffmpeg-9.0.2-essentials_build\bin'
    $sidecars = Join-Path $root 'src-tauri\binaries'
    New-Item -ItemType Directory -Force $sidecars | Out-Null
    foreach ($name in @('ffmpeg','ffprobe')) {
        Copy-Item -LiteralPath (Join-Path $binaryFolder "$name.exe") -Destination (Join-Path $sidecars "$name-$target.exe") -Force
    }

    Write-Host 'Building Compresso...'
    Push-Location $root
    try {
        cargo build --locked --release --target $target --manifest-path 'src-tauri/Cargo.toml'
        if ($LASTEXITCODE -ne 0) { throw 'Application build failed.' }
        $appOutput = Join-Path $root "src-tauri\target\$target\release"
        Copy-Item -LiteralPath (Join-Path $appOutput 'compresso.exe') -Destination $staging
        foreach ($name in @('ffmpeg','ffprobe')) {
            Copy-Item -LiteralPath (Join-Path $binaryFolder "$name.exe") -Destination (Join-Path $staging "$name.exe")
        }
        $loader = Join-Path $appOutput 'WebView2Loader.dll'
        if (-not (Test-Path -LiteralPath $loader)) {
            $cargoHome = if ($env:CARGO_HOME) { $env:CARGO_HOME } else { Join-Path $env:USERPROFILE '.cargo' }
            $registry = Join-Path $cargoHome 'registry\src'
            $candidate = Get-ChildItem -Path $registry -Filter 'WebView2Loader.dll' -Recurse -File |
                Where-Object { $_.Directory.Name -eq 'x64' -and $_.FullName -match 'webview2-com-sys-' } |
                Select-Object -First 1
            if (-not $candidate) { throw 'WebView2Loader.dll was not found.' }
            $loader = $candidate.FullName
        }
        Copy-Item -LiteralPath $loader -Destination $staging
        Copy-Item -LiteralPath (Join-Path $root 'FFmpeg-LICENSE.txt') -Destination $staging
        Copy-Item -LiteralPath (Join-Path $root 'FFmpeg-README.txt') -Destination $staging
        $payload = Join-Path $root 'payload.zip'
        if (Test-Path -LiteralPath $payload) { Remove-Item -LiteralPath $payload -Force }
        Compress-Archive -Path (Join-Path $staging '*') -DestinationPath $payload -CompressionLevel Optimal

        Write-Host 'Building the single-file launcher...'
        cargo build --locked --release --target $target --manifest-path 'launcher/Cargo.toml'
        if ($LASTEXITCODE -ne 0) { throw 'Launcher build failed.' }
        $release = Join-Path $root 'release'
        New-Item -ItemType Directory -Force $release | Out-Null
        Copy-Item -LiteralPath (Join-Path $root "launcher\target\$target\release\compresso-launcher.exe") -Destination (Join-Path $release 'Compresso.exe') -Force
    } finally { Pop-Location }
    Write-Host 'Ready: release/Compresso.exe'
} finally {
    Remove-Item -LiteralPath $tempRoot -Recurse -Force -ErrorAction SilentlyContinue
}
