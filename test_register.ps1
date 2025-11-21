try {
    Invoke-WebRequest -Uri "http://localhost:8080/api/auth/register" -Method POST -ContentType "application/json" -Body '{"name":"Test User", "email":"admin2@dkarito.com", "password":"Admin123!"}'
} catch {
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        Write-Host "ERROR BODY:"
        Write-Host $reader.ReadToEnd()
    } else {
        Write-Host "ERROR: " $_.Exception.Message
    }
}
