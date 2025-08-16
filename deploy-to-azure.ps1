# 🚀 Azure for Students Deployment Script
# Compress_Img Project - Cost Optimized Deployment

Write-Host "🎓 Azure for Students Deployment - Compress_Img" -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Green

# Set Azure CLI alias
$azCommand = "C:\Program Files (x86)\Microsoft SDKs\Azure\CLI2\wbin\az.cmd"

Write-Host "📋 Step 1: Login to Azure..." -ForegroundColor Cyan
Write-Host "A browser window will open for authentication" -ForegroundColor Yellow
& $azCommand login

Write-Host "`n📋 Step 2: Verify Azure for Students subscription..." -ForegroundColor Cyan
& $azCommand account list --output table

Write-Host "`n📋 Step 3: Set subscription (if needed)..." -ForegroundColor Cyan
Write-Host "If you see multiple subscriptions, we'll use Azure for Students" -ForegroundColor Yellow
$subscriptions = & $azCommand account list --query "[?contains(name, 'Students') || contains(name, 'Student')].id" --output tsv
if ($subscriptions) {
    & $azCommand account set --subscription $subscriptions[0]
    Write-Host "✅ Set to Azure for Students subscription" -ForegroundColor Green
}

Write-Host "`n📋 Step 4: Create Resource Group..." -ForegroundColor Cyan
$resourceGroup = "compress-app-rg"
$location = "East US"

& $azCommand group create `
    --name $resourceGroup `
    --location $location

Write-Host "`n📋 Step 5: Create App Service Plan (FREE F1)..." -ForegroundColor Cyan
& $azCommand appservice plan create `
    --name "compress-app-plan" `
    --resource-group $resourceGroup `
    --sku F1 `
    --is-linux

Write-Host "`n📋 Step 6: Create Web App for Backend..." -ForegroundColor Cyan
$backendAppName = "compress-backend-$(Get-Random -Minimum 1000 -Maximum 9999)"
Write-Host "Backend App Name: $backendAppName" -ForegroundColor Yellow

& $azCommand webapp create `
    --resource-group $resourceGroup `
    --plan "compress-app-plan" `
    --name $backendAppName `
    --runtime "PYTHON|3.11" `
    --deployment-local-git

Write-Host "`n📋 Step 7: Configure Environment Variables..." -ForegroundColor Cyan
$secretKey = "django-$(New-Guid)"
$frontendUrl = "https://$backendAppName.azurewebsites.net"

& $azCommand webapp config appsettings set `
    --resource-group $resourceGroup `
    --name $backendAppName `
    --settings `
        SECRET_KEY=$secretKey `
        DEBUG="False" `
        ALLOWED_HOSTS="$backendAppName.azurewebsites.net" `
        CORS_ORIGINS=$frontendUrl `
        FRONTEND_URL=$frontendUrl

Write-Host "`n📋 Step 8: Get deployment credentials..." -ForegroundColor Cyan
$deploymentUrl = & $azCommand webapp deployment list-publishing-credentials `
    --resource-group $resourceGroup `
    --name $backendAppName `
    --query scmUri `
    --output tsv

Write-Host "`n🎉 DEPLOYMENT SETUP COMPLETE!" -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Green
Write-Host "Backend App URL: https://$backendAppName.azurewebsites.net" -ForegroundColor Cyan
Write-Host "Deployment URL: $deploymentUrl" -ForegroundColor Cyan
Write-Host "`n📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Configure your backend code with the app name" -ForegroundColor White
Write-Host "2. Push your code to the deployment URL" -ForegroundColor White
Write-Host "3. Create Static Web App for frontend" -ForegroundColor White
Write-Host "`n💰 Current Cost: $0/month (FREE tier only)" -ForegroundColor Green

# Save deployment info
$deploymentInfo = @"
# 🚀 Deployment Information - $(Get-Date)
Backend App Name: $backendAppName
Backend URL: https://$backendAppName.azurewebsites.net
Resource Group: $resourceGroup
Deployment URL: $deploymentUrl

# Environment Variables Set:
SECRET_KEY: $secretKey
DEBUG: False
ALLOWED_HOSTS: $backendAppName.azurewebsites.net
CORS_ORIGINS: $frontendUrl
FRONTEND_URL: $frontendUrl

# Next: Deploy your code with:
git remote add azure $deploymentUrl
git push azure main
"@

$deploymentInfo | Out-File -FilePath "deployment-info.txt" -Encoding UTF8
Write-Host "`n📄 Deployment info saved to deployment-info.txt" -ForegroundColor Cyan
