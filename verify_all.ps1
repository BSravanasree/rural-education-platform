$baseUrl = "http://localhost:8080/api"

Write-Host "=========================================="
Write-Host "FULL LOCAL END-TO-END AUDIT REPORT DATA"
Write-Host "=========================================="

# 1. Health check & stats
$stats = Invoke-RestMethod -Uri "$baseUrl/public/stats" -Method Get
Write-Host "Public Stats:" ($stats | ConvertTo-Json -Compress)

# 2. Categories & Courses
$categories = Invoke-RestMethod -Uri "$baseUrl/public/categories" -Method Get
Write-Host "Categories Count:" $categories.Count
$courses = Invoke-RestMethod -Uri "$baseUrl/public/courses" -Method Get
Write-Host "Courses Count:" $courses.Count

# 3. Student Registration & Auth
$studentLoginBody = @{ email = "student@ruraledu.org"; password = "student123" } | ConvertTo-Json
$studentLogin = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $studentLoginBody -ContentType "application/json"
Write-Host "Student Seed Login:" $studentLogin.email "Role:" $studentLogin.role

# 4. Teacher Auth
$teacherLoginBody = @{ email = "teacher@ruraledu.org"; password = "teacher123" } | ConvertTo-Json
$teacherLogin = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $teacherLoginBody -ContentType "application/json"
Write-Host "Teacher Seed Login:" $teacherLogin.email "Role:" $teacherLogin.role

# 5. Admin Auth
$adminLoginBody = @{ email = "admin@ruraledu.org"; password = "admin123" } | ConvertTo-Json
$adminLogin = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $adminLoginBody -ContentType "application/json"
Write-Host "Admin Seed Login:" $adminLogin.email "Role:" $adminLogin.role

# 6. Admin Analytics
$adminHeaders = @{ Authorization = "Bearer $($adminLogin.token)" }
$analytics = Invoke-RestMethod -Uri "$baseUrl/admin/analytics" -Method Get -Headers $adminHeaders
Write-Host "Admin Analytics:" ($analytics | ConvertTo-Json -Compress)

Write-Host "=========================================="
Write-Host "END-TO-END AUDIT COMPLETE"
Write-Host "=========================================="
