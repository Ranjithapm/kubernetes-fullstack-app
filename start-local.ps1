Write-Host "Starting Python Backend API..." -ForegroundColor Cyan
Set-Location "$PSScriptRoot\backend"

if (-not (Test-Path "$PSScriptRoot\backend\venv")) {
    Write-Host "Creating python virtual environment..."
    python -m venv venv
}

# Install dependencies
.\venv\Scripts\pip.exe install -r requirements.txt

# Start the virtual environment's python explicitly 
Write-Host "Starting Flask on port 5000 in the background..."
Start-Process -FilePath ".\venv\Scripts\python.exe" -ArgumentList "app.py" -WindowStyle Hidden

Start-Sleep -Seconds 3

Write-Host "Starting React Frontend..." -ForegroundColor Cyan
Set-Location "$PSScriptRoot\frontend"

npm install
npm run dev
