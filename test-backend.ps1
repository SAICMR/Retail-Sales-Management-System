# Test script to check backend connection
Write-Host "Testing Backend Connection..." -ForegroundColor Yellow
Write-Host ""

# Check if port is listening
$portCheck = netstat -ano | Select-String ":3001"
if ($portCheck) {
    Write-Host "✓ Port 3001 is in use" -ForegroundColor Green
} else {
    Write-Host "✗ Port 3001 is NOT in use - Backend is not running!" -ForegroundColor Red
    Write-Host "  Please start the backend server first:" -ForegroundColor Yellow
    Write-Host "  cd backend" -ForegroundColor Cyan
    Write-Host "  npm start" -ForegroundColor Cyan
    exit
}

Write-Host ""
Write-Host "Testing API endpoints..." -ForegroundColor Yellow

# Test health endpoint
try {
    $health = Invoke-WebRequest -Uri "http://localhost:3001/api/health" -UseBasicParsing
    Write-Host "✓ Health endpoint: OK" -ForegroundColor Green
    Write-Host "  Response: $($health.Content)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Health endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test filter options endpoint
try {
    $filterOptions = Invoke-WebRequest -Uri "http://localhost:3001/api/sales/filter-options" -UseBasicParsing
    Write-Host "✓ Filter options endpoint: OK" -ForegroundColor Green
    $json = $filterOptions.Content | ConvertFrom-Json
    if ($json.success) {
        Write-Host "  Success: $($json.success)" -ForegroundColor Gray
        Write-Host "  Regions: $($json.data.customerRegion.Count)" -ForegroundColor Gray
        Write-Host "  Categories: $($json.data.productCategory.Count)" -ForegroundColor Gray
    } else {
        Write-Host "  Error: $($json.error)" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Filter options endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "  This is likely why the frontend shows 'Loading filter options...'" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Done!" -ForegroundColor Green

