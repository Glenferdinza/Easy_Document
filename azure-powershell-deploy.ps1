# 🚀 AZURE DEPLOYMENT SCRIPT - POWERSHELL VERSION
# Copy dan paste script ini ke Azure Cloud Shell (PowerShell)

# Set variables (PowerShell syntax)
$RESOURCE_GROUP = "compress-img-rg"
$APP_NAME = "compress-img-$(Get-Date -Format 'yyyyMMddHHmmss')"
$LOCATION = "eastus"
$REPO_URL = "https://github.com/Glenferdinza/composser_compress-convert-file.git"

Write-Host "🚀 Starting Azure deployment for Compress_Img..." -ForegroundColor Green
Write-Host "📋 Configuration:" -ForegroundColor Yellow
Write-Host "  Resource Group: $RESOURCE_GROUP" -ForegroundColor White
Write-Host "  App Name: $APP_NAME" -ForegroundColor White
Write-Host "  Location: $LOCATION" -ForegroundColor White
Write-Host "  Repository: $REPO_URL" -ForegroundColor White
Write-Host ""

# 1. Create resource group
Write-Host "🏗️  Step 1: Creating resource group..." -ForegroundColor Cyan
az group create --name $RESOURCE_GROUP --location $LOCATION

# 2. Create App Service Plan (Free F1 tier)
Write-Host "🏗️  Step 2: Creating App Service Plan (F1 Free - `$0/month)..." -ForegroundColor Cyan
az appservice plan create --name "$APP_NAME-plan" --resource-group $RESOURCE_GROUP --sku F1 --is-linux

# 3. Create Web App
Write-Host "🌐 Step 3: Creating Web App with Python 3.12..." -ForegroundColor Cyan
az webapp create --resource-group $RESOURCE_GROUP --plan "$APP_NAME-plan" --name $APP_NAME --runtime "PYTHON|3.12"

# 4. Configure app settings
Write-Host "⚙️  Step 4: Configuring app settings..." -ForegroundColor Cyan
az webapp config appsettings set --resource-group $RESOURCE_GROUP --name $APP_NAME --settings DJANGO_SETTINGS_MODULE=compress_website.settings PYTHONPATH=/home/site/wwwroot/backend WEBSITES_PORT=8000 DEBUG=False SCM_DO_BUILD_DURING_DEPLOYMENT=true ENABLE_ORYX_BUILD=true

# 5. Set startup command
Write-Host "🔧 Step 5: Setting startup command..." -ForegroundColor Cyan
az webapp config set --resource-group $RESOURCE_GROUP --name $APP_NAME --startup-file "cd backend && python manage.py migrate && gunicorn compress_website.wsgi:application --bind 0.0.0.0:8000"

# 6. Deploy from GitHub
Write-Host "🚀 Step 6: Deploying from GitHub..." -ForegroundColor Cyan
az webapp deployment source config --resource-group $RESOURCE_GROUP --name $APP_NAME --repo-url $REPO_URL --branch main --manual-integration

# 7. Show results
Write-Host ""
Write-Host "🎉 DEPLOYMENT COMPLETED!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Yellow
Write-Host "🌐 App URL: https://$APP_NAME.azurewebsites.net" -ForegroundColor Green
Write-Host "📊 Resource Group: $RESOURCE_GROUP" -ForegroundColor White
Write-Host "🏷️  App Name: $APP_NAME" -ForegroundColor White
Write-Host "💰 Cost: `$0/month (Free tier)" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. ⏳ Wait 5-10 minutes for first deployment to complete" -ForegroundColor White
Write-Host "2. 🌐 Open the app URL in your browser" -ForegroundColor White
Write-Host "3. 📊 Monitor in Azure Portal" -ForegroundColor White
Write-Host ""
Write-Host "🔍 To check deployment status:" -ForegroundColor Yellow
Write-Host "   az webapp log tail --resource-group $RESOURCE_GROUP --name $APP_NAME" -ForegroundColor White
