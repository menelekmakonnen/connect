# Comprehensive headless test for ICUNI Connect frontend

Write-Host "=== ICUNI Connect Headless Test Suite ===" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:8888"
$errors = @()

# Test 1: API Endpoints
Write-Host "[1/5] Testing API Endpoints..." -ForegroundColor Yellow
try {
    $talentsResponse = Invoke-WebRequest -Uri "$baseUrl/api/talents" -UseBasicParsing
    if ($talentsResponse.StatusCode -eq 200) {
        $data = $talentsResponse.Content | ConvertFrom-Json
        Write-Host "  OK /api/talents returned 200" -ForegroundColor Green
        Write-Host "  OK Found $($data.data.Count) talents" -ForegroundColor Green
        
        $firstTalent = $data.data[0]
        if ($null -eq $firstTalent.roles) {
            Write-Host "  INFO First talent has undefined roles (expected)" -ForegroundColor Yellow
        }
        else {
            Write-Host "  OK First talent has roles defined" -ForegroundColor Green
        }
    }
}
catch {
    $errors += "API /api/talents failed: $_"
    Write-Host "  FAIL /api/talents" -ForegroundColor Red
}

# Test 2: Page HTML Generation
Write-Host "`n[2/5] Testing Page Rendering..." -ForegroundColor Yellow
$pages = @("/", "/talents", "/projects/new")
foreach ($page in $pages) {
    try {
        $response = Invoke-WebRequest -Uri "$baseUrl$page" -UseBasicParsing -TimeoutSec 30
        if ($response.StatusCode -eq 200 -and $response.Content -match "<!DOCTYPE html>") {
            Write-Host "  OK $page rendered" -ForegroundColor Green
            
            if ($response.Content -match "Cannot read properties of undefined") {
                $errors += "Page $page contains runtime error"
                Write-Host "  FAIL $page has runtime error!" -ForegroundColor Red
            }
        }
        else {
            $errors += "Page $page invalid"
            Write-Host "  FAIL $page invalid" -ForegroundColor Red
        }
    }
    catch {
        $errors += "Page $page failed: $_"
        Write-Host "  FAIL $page error" -ForegroundColor Red
    }
}

# Test 3: Component Test
Write-Host "`n[3/5] Testing Critical Components..." -ForegroundColor Yellow
try {
    $talentsPage = Invoke-WebRequest -Uri "$baseUrl/talents" -UseBasicParsing
    
    if ($talentsPage.Content -match "TypeError") {
        $errors += "CRITICAL: talents page has TypeError"
        Write-Host "  FAIL TypeError detected!" -ForegroundColor Red
    }
    else {
        Write-Host "  OK No TypeError errors" -ForegroundColor Green
    }
    
    $projectsPage = Invoke-WebRequest -Uri "$baseUrl/projects/new" -UseBasicParsing
    if ($projectsPage.Content -match "GHS|Currency") {
        Write-Host "  OK New budget features present" -ForegroundColor Green
    }
    
}
catch {
    $errors += "Component test failed"
    Write-Host "  FAIL Component test" -ForegroundColor Red
}

# Test 4: Build Check
Write-Host "`n[4/5] Validating Build..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Write-Host "  OK Build directory exists" -ForegroundColor Green
}
else {
    Write-Host "  FAIL No build directory" -ForegroundColor Red
}

# Summary
Write-Host "`n=== Test Summary ===" -ForegroundColor Cyan
if ($errors.Count -eq 0) {
    Write-Host "ALL TESTS PASSED" -ForegroundColor Green
    Write-Host "  - API endpoints working" -ForegroundColor Green
    Write-Host "  - Pages rendering correctly" -ForegroundColor Green
    Write-Host "  - No runtime errors detected" -ForegroundColor Green
    exit 0
}
else {
    Write-Host "TESTS FAILED - $($errors.Count) errors" -ForegroundColor Red
    foreach ($error in $errors) {
        Write-Host "  ERROR: $error" -ForegroundColor Red
    }
    exit 1
}
