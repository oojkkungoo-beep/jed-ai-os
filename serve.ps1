$dashPath = $PSScriptRoot
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add('http://localhost:3334/')
$listener.Start()
Write-Host "Dashboard: http://localhost:3334/dashboard/ — กด Ctrl+C เพื่อหยุด"

# RunspacePool: รองรับ concurrent requests (สูงสุด 20 พร้อมกัน)
$pool = [runspacefactory]::CreateRunspacePool(1, 20)
$pool.Open()

$handler = {
    param($ctx, $dashPath)
    try {
        $req = $ctx.Request
        $res = $ctx.Response
        $path = $req.Url.LocalPath.TrimStart('/')
        if ($path -eq '' -or $path -eq '/') { $path = 'dashboard/index.html' }
        $filePath = Join-Path $dashPath $path
        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $ext = [System.IO.Path]::GetExtension($filePath)
            $mime = switch ($ext) {
                '.html' { 'text/html; charset=utf-8' }
                '.css'  { 'text/css; charset=utf-8' }
                '.js'   { 'application/javascript; charset=utf-8' }
                '.json' { 'application/json; charset=utf-8' }
                '.png'  { 'image/png' }
                '.jpg'  { 'image/jpeg' }
                '.ico'  { 'image/x-icon' }
                '.webmanifest' { 'application/manifest+json' }
                default { 'application/octet-stream' }
            }
            $res.ContentType = $mime
            $res.ContentLength64 = $bytes.Length
            $res.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $res.StatusCode = 404
        }
    } catch {}
    finally {
        try { $ctx.Response.Close() } catch {}
    }
}

$jobs = [System.Collections.Generic.List[object]]::new()

while ($listener.IsListening) {
    try {
        $ctx = $listener.GetContext()
        $ps = [powershell]::Create()
        $ps.RunspacePool = $pool
        [void]$ps.AddScript($handler).AddArgument($ctx).AddArgument($dashPath)
        $jobs.Add([pscustomobject]@{ PS = $ps; IAsyncResult = $ps.BeginInvoke() })
    } catch { break }

    $done = $jobs | Where-Object { $_.IAsyncResult.IsCompleted }
    foreach ($j in $done) {
        try { $j.PS.EndInvoke($j.IAsyncResult) } catch {}
        $j.PS.Dispose()
    }
    $jobs.RemoveAll({ param($j) $j.IAsyncResult.IsCompleted })
}

$pool.Close()
$listener.Stop()
