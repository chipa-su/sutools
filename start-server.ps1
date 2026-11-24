<#
.SYNOPSIS
  啟動「蘇的工具箱 / SU's TOOLBOX」本地開發伺服器 (Node.js)
#>
param(
    [int]$Port = 8080,
    [switch]$OpenBrowser
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ProjectRoot

$PidFile = Join-Path $ProjectRoot ".server.pid"
$LogFile = Join-Path $ProjectRoot ".server.log"

# 1. 檢查是否已有運作中的伺服器
if (Test-Path $PidFile) {
    $ExistingPid = (Get-Content $PidFile -Raw).Trim()
    if ($ExistingPid -match '^\d+$') {
        $Proc = Get-Process -Id ([int]$ExistingPid) -ErrorAction SilentlyContinue
        if ($Proc -and $Proc.ProcessName -match 'node') {
            Write-Host "✅ 本地伺服器已經在運作中！(PID: $ExistingPid)" -ForegroundColor Green
            Write-Host "🌐 請開啟瀏覽器造訪: http://127.0.0.1:$Port/" -ForegroundColor Cyan
            if ($OpenBrowser) { Start-Process "http://127.0.0.1:$Port/" }
            exit 0
        }
    }
    Remove-Item $PidFile -Force -ErrorAction SilentlyContinue
}

# 2. 背景啟動 Node.js 伺服器
$Env:PORT = "$Port"
$ProcInfo = Start-Process -FilePath "node" -ArgumentList "server.js" -WorkingDirectory $ProjectRoot -PassThru -WindowStyle Hidden -RedirectStandardOutput $LogFile -RedirectStandardError "$LogFile.err"

# 等待伺服器就緒並驗證健康檢查端點
$Ready = $false
for ($i = 0; $i -lt 20; $i++) {
    Start-Sleep -Milliseconds 200
    try {
        $Resp = Invoke-RestMethod -Uri "http://127.0.0.1:$Port/__health" -TimeoutSec 2 -ErrorAction Stop
        if ($Resp.status -eq "ok") {
            $Ready = $true
            break
        }
    } catch {}
}

if ($Ready) {
    Set-Content -Path $PidFile -Value $ProcInfo.Id -Encoding UTF8
    Write-Host "====================================================" -ForegroundColor DarkCyan
    Write-Host "🚀 [蘇的工具箱 / SU's TOOLBOX] 本地伺服器啟動成功！" -ForegroundColor Green
    Write-Host "🌐 預覽網址 : http://127.0.0.1:$Port/" -ForegroundColor Cyan
    Write-Host "🆔 程序 PID : $($ProcInfo.Id)" -ForegroundColor Gray
    Write-Host "🛑 關閉方式 : 執行 .\stop-server.ps1 或雙擊 stop-server.bat" -ForegroundColor Yellow
    Write-Host "====================================================" -ForegroundColor DarkCyan
    if ($OpenBrowser) {
        Start-Process "http://127.0.0.1:$Port/"
    }
} else {
    Write-Host "❌ 伺服器啟動失敗，請檢查連接埠 $Port 是否被佔用或查看 .server.log.err" -ForegroundColor Red
    exit 1
}
