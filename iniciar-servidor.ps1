# ============================================================
# NUTRIBOX - Servidor Local con PowerShell
# IP: 192.167.1.39  Puerto: 8080
# ============================================================

$ip     = "192.167.1.39"
$port   = 8080
$root   = $PSScriptRoot   # carpeta donde está este script
$url    = "http://${ip}:${port}/"

# Tipos MIME
$mime = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".gif"  = "image/gif"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".woff2"= "font/woff2"
    ".woff" = "font/woff"
    ".ttf"  = "font/ttf"
}

# Crear listener en todas las interfaces para que sea accesible por red
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://+:${port}/")
$listener.Start()

Write-Host ""
Write-Host "  ╔══════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "  ║        🥗  NUTRIBOX - Servidor activo        ║" -ForegroundColor Green
Write-Host "  ╠══════════════════════════════════════════════╣" -ForegroundColor Green
Write-Host "  ║                                              ║" -ForegroundColor Green
Write-Host "  ║  En esta PC:                                 ║" -ForegroundColor Green
Write-Host "  ║  http://localhost:${port}/                     ║" -ForegroundColor Cyan
Write-Host "  ║                                              ║" -ForegroundColor Green
Write-Host "  ║  En tu celular (misma WiFi):                 ║" -ForegroundColor Green
Write-Host "  ║  http://${ip}:${port}/              ║" -ForegroundColor Yellow
Write-Host "  ║                                              ║" -ForegroundColor Green
Write-Host "  ║  Presiona Ctrl+C para detener                ║" -ForegroundColor Green
Write-Host "  ╚══════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

# Abrir automáticamente en el navegador local
Start-Process "http://localhost:${port}/"

# Bucle principal del servidor
while ($listener.IsListening) {
    $context  = $listener.GetContext()
    $request  = $context.Request
    $response = $context.Response

    # Construir ruta del archivo
    $rawPath = $request.Url.AbsolutePath
    if ($rawPath -eq "/" -or $rawPath -eq "") { $rawPath = "/index.html" }

    # Seguridad: evitar path traversal
    $filePath = Join-Path $root ($rawPath.TrimStart("/").Replace("/", "\"))
    $filePath = [System.IO.Path]::GetFullPath($filePath)

    if (-not $filePath.StartsWith($root)) {
        $response.StatusCode = 403
        $response.Close()
        continue
    }

    if (Test-Path $filePath -PathType Leaf) {
        $ext         = [System.IO.Path]::GetExtension($filePath).ToLower()
        $contentType = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { "application/octet-stream" }
        $bytes       = [System.IO.File]::ReadAllBytes($filePath)

        $response.StatusCode  = 200
        $response.ContentType = $contentType
        $response.ContentLength64 = $bytes.Length

        # Headers CORS y caché
        $response.Headers.Add("Access-Control-Allow-Origin", "*")
        $response.Headers.Add("Cache-Control", "no-cache")

        $response.OutputStream.Write($bytes, 0, $bytes.Length)
        Write-Host "  200  $rawPath" -ForegroundColor DarkGray
    } else {
        # 404
        $body  = [System.Text.Encoding]::UTF8.GetBytes("<h1>404 - No encontrado</h1><p>$rawPath</p>")
        $response.StatusCode  = 404
        $response.ContentType = "text/html"
        $response.ContentLength64 = $body.Length
        $response.OutputStream.Write($body, 0, $body.Length)
        Write-Host "  404  $rawPath" -ForegroundColor DarkYellow
    }

    $response.OutputStream.Close()
}

$listener.Stop()
