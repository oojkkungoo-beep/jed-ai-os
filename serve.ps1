$dashPath = $PSScriptRoot
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add('http://+:3334/')
$listener.Start()
Write-Host "Dashboard running at http://localhost:3334/ (และผ่าน Tailscale: http://100.85.207.89:3334/) — กด Ctrl+C เพื่อหยุด"

while ($listener.IsListening) {
    try {
        $ctx = $listener.GetContext()
        $req = $ctx.Request
        $res = $ctx.Response
        $path = $req.Url.LocalPath.TrimStart('/')
        if ($path -eq '' -or $path -eq '/') { $path = 'index.html' }
        $filePath = Join-Path $dashPath $path
        if (Test-Path $filePath) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $ext = [System.IO.Path]::GetExtension($filePath)
            $mime = switch($ext) { '.html'{'text/html'} '.css'{'text/css'} '.js'{'application/javascript'} default{'text/plain'} }
            $res.ContentType = $mime
            $res.ContentLength64 = $bytes.Length
            $res.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $res.StatusCode = 404
        }
        $res.Close()
    } catch {}
}
