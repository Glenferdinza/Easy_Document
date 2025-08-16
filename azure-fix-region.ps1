# 🚀 AZURE DEPLOYMENT - FIX REGION ISSUE
# Copy script ini ke Azure Cloud Shell

# First, let's check available locations
Write-Host "🔍 Checking available regions..." -ForegroundColor Yellow
az account list-locations --query "[?metadata.regionCategory=='Recommended'].{Name:name,DisplayName:displayName}" --output table

Write-Host ""
Write-Host "🔧 Common regions for Azure for Students:" -ForegroundColor Yellow
Write-Host "  - Central US (centralus)" -ForegroundColor White
Write-Host "  - West Europe (westeurope)" -ForegroundColor White
Write-Host "  - Southeast Asia (southeastasia)" -ForegroundColor White
Write-Host "  - UK South (uksouth)" -ForegroundColor White
Write-Host ""

# Set variables with Central US (usually works for students)
$RESOURCE_GROUP = "compress-img-rg"
$APP_NAME = "compress-img-$(Get-Date -Format 'yyyyMMddHHmmss')"
$LOCATION = "centralus"  # Changed from eastus
$REPO_URL = "https://github.com/Glenferdinza/composser_compress-convert-file.git"

Write-Host "🚀 Starting deployment with Central US region..." -ForegroundColor Green
Write-Host "📋 Configuration:" -ForegroundColor Yellow
Write-Host "  Resource Group: $RESOURCE_GROUP" -ForegroundColor White
Write-Host "  App Name: $APP_NAME" -ForegroundColor White
Write-Host "  Location: $LOCATION" -ForegroundColor White

# Delete existing resource group (in case it exists)
Write-Host "🧹 Cleaning up existing resources..." -ForegroundColor Yellow
az group delete --name $RESOURCE_GROUP --yes --no-wait 2>$null

# Wait a moment
Start-Sleep -Seconds 10

# Create resource group with Central US
Write-Host "🏗️ Creating resource group in Central US..." -ForegroundColor Cyan
az group create --name $RESOURCE_GROUP --location $LOCATION

# Create App Service Plan
Write-Host "🏗️ Creating App Service Plan..." -ForegroundColor Cyan
az appservice plan create --name "$APP_NAME-plan" --resource-group $RESOURCE_GROUP --sku F1 --is-linux

# Create Web App
Write-Host "🌐 Creating Web App..." -ForegroundColor Cyan
az webapp create --resource-group $RESOURCE_GROUP --plan "$APP_NAME-plan" --name $APP_NAME --runtime "PYTHON|3.12"

# Configure settings
Write-Host "⚙️ Configuring settings..." -ForegroundColor Cyan
az webapp config appsettings set --resource-group $RESOURCE_GROUP --name $APP_NAME --settings DJANGO_SETTINGS_MODULE=compress_website.settings PYTHONPATH=/home/site/wwwroot/backend WEBSITES_PORT=8000 DEBUG=False SCM_DO_BUILD_DURING_DEPLOYMENT=true

# Deploy from GitHub
Write-Host "🚀 Deploying from GitHub..." -ForegroundColor Cyan
az webapp deployment source config --resource-group $RESOURCE_GROUP --name $APP_NAME --repo-url $REPO_URL --branch main --manual-integration

# Show result
Write-Host ""
Write-Host "🎉 DEPLOYMENT COMPLETED!" -ForegroundColor Green
Write-Host "🌐 Your app: https://$APP_NAME.azurewebsites.net" -ForegroundColor Green
Write-Host "📍 Region: Central US" -ForegroundColor White
