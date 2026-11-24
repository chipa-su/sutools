<#
.SYNOPSIS
  關閉「蘇的工具箱 / SU's TOOLBOX」本地開發伺服器
#>
param(
    [int]$Port = 8080
)

$ErrorActionPreference = "SilentlyContinue"
$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ProjectRoot

$PidFile = Join-Path $ProjectRoot ".server.pid"
$Stopped = $false

# 1. 優先透過 .server.pid 精準關閉程序
if (Test-Path $PidFile) {
    $TargetPid = (Get-Content $PidFile -Raw).Trim()
    if ($TargetPid -match '^\d+$') {
        $Proc = Get-Process -Id ([int]$TargetPid) -ErrorAction SilentlyContinue
        if ($Proc -and $Proc.ProcessName -match 'node') {
            Stop-Process -Id ([int]$TargetPid) -Force
            Write-Host "🛑 已成功關閉本地開發伺服器 (PID: $TargetPid)。" -ForegroundColor Green
            $Stopped = $true
        }
    }
    Remove-Item $PidFile -Force -ErrorAction SilentlyContinue
}

# 2. 備援檢查：檢查是否有殘留監聽 127.0.0.1:$Port 的 node 程序
$NetConn = Get-NetTCPConnection -LocalAddress "127.0.0.1" -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
if ($NetConn) {
    foreach ($Conn in $NetConn) {
        $OwnerPid = $Conn.OwningProcess
        $OwnerProc = Get-Process -Id $OwnerPid -ErrorAction SilentlyContinue
        if ($OwnerProc -and $OwnerProc.ProcessName -match 'node') {
            Stop-Process -Id $OwnerPid -Force
            Write-Host "🛑 已清理佔用 Port $Port 的殘留伺服器程序 (PID: $OwnerPid)。" -ForegroundColor Green
            $Stopped = $true
        }
    }
}

# 清理暫存日誌
Remove-Item (Join-Path $ProjectRoot ".server.log") -Force -ErrorAction SilentlyContinue
Remove-Item (Join-Path $ProjectRoot ".server.log.err") -Force -ErrorAction SilentlyContinue

if (-not $Stopped) {
    Write-Host "ℹ️ 目前沒有偵測到正在運作中的本地開發伺服器。" -ForegroundColor Yellow
}
