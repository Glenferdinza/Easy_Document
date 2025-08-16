@echo off
REM Azure for Students Deployment Script - Cost Effective (Windows)
REM This script deploys the compression website to Azure using FREE services

echo 🎓 Azure for Students Deployment - Cost Effective Setup
echo ======================================================

REM Configuration
set RESOURCE_GROUP=compress-app-rg
set LOCATION=East US
set APP_NAME_BACKEND=compress-backend-api
set APP_NAME_FRONTEND=compress-frontend
set DB_SERVER_NAME=compress-postgres-server
set DB_NAME=compressdb
set DB_USER=compressadmin
set DB_PASSWORD=SecurePassword123!

REM Check if Azure CLI is installed
az version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Azure CLI is not installed. Please install it first:
    echo https://aka.ms/installazurecliwindows
    pause
    exit /b 1
)

echo 🔐 Logging in to Azure...
call az login

echo 📋 Setting subscription to Azure for Students...
call az account set --subscription "Azure for Students"

echo 📁 Creating resource group...
call az group create --name %RESOURCE_GROUP% --location "%LOCATION%" --output table

echo ✅ Resource group created

echo 🐘 Creating PostgreSQL server (FREE TIER)...
call az postgres flexible-server create ^
  --resource-group %RESOURCE_GROUP% ^
  --name %DB_SERVER_NAME% ^
  --location "%LOCATION%" ^
  --admin-user %DB_USER% ^
  --admin-password %DB_PASSWORD% ^
  --sku-name Standard_B1ms ^
  --tier Burstable ^
  --public-access 0.0.0.0 ^
  --storage-size 32 ^
  --version 13 ^
  --output table

echo ✅ PostgreSQL server created

echo 🗃️ Creating database...
call az postgres flexible-server db create ^
  --resource-group %RESOURCE_GROUP% ^
  --server-name %DB_SERVER_NAME% ^
  --database-name %DB_NAME% ^
  --output table

echo ✅ Database created

echo 🔥 Configuring firewall rules...
call az postgres flexible-server firewall-rule create ^
  --resource-group %RESOURCE_GROUP% ^
  --name %DB_SERVER_NAME% ^
  --rule-name AllowAzureServices ^
  --start-ip-address 0.0.0.0 ^
  --end-ip-address 0.0.0.0 ^
  --output table

echo ✅ Firewall configured

echo 📋 Creating App Service Plan (FREE TIER)...
call az appservice plan create ^
  --name compress-app-plan ^
  --resource-group %RESOURCE_GROUP% ^
  --sku F1 ^
  --is-linux ^
  --output table

echo ✅ App Service Plan created

echo 🌐 Creating backend web app...
call az webapp create ^
  --resource-group %RESOURCE_GROUP% ^
  --plan compress-app-plan ^
  --name %APP_NAME_BACKEND% ^
  --runtime "PYTHON|3.11" ^
  --deployment-local-git ^
  --output table

echo ✅ Backend web app created

echo ⚙️ Setting environment variables...
call az webapp config appsettings set ^
  --resource-group %RESOURCE_GROUP% ^
  --name %APP_NAME_BACKEND% ^
  --settings ^
    AZURE_POSTGRESQL_HOST="%DB_SERVER_NAME%.postgres.database.azure.com" ^
    AZURE_POSTGRESQL_NAME="%DB_NAME%" ^
    AZURE_POSTGRESQL_USER="%DB_USER%" ^
    AZURE_POSTGRESQL_PASSWORD="%DB_PASSWORD%" ^
    SECRET_KEY="django-insecure-change-this-in-production-random-key" ^
    DEBUG="False" ^
    CORS_ORIGINS="https://%APP_NAME_FRONTEND%.azurewebsites.net" ^
    FRONTEND_URL="https://%APP_NAME_FRONTEND%.azurewebsites.net" ^
  --output table

echo ✅ Environment variables configured

echo 📱 Creating frontend static web app...
echo ⚠️ This requires GitHub authentication...

call az staticwebapp create ^
  --name %APP_NAME_FRONTEND% ^
  --resource-group %RESOURCE_GROUP% ^
  --source https://github.com/Glenferdinza/Tugas-Proyek-Akhir-Dicoding ^
  --branch main ^
  --app-location "/frontend" ^
  --output-location "build" ^
  --login-with-github

echo ✅ Frontend static web app created

echo 💰 Setting up cost alert...
call az consumption budget create ^
  --budget-name azure-students-budget ^
  --amount 80 ^
  --category cost ^
  --time-grain monthly ^
  --start-date 2025-08-01 ^
  --end-date 2026-08-01 2>nul

echo.
echo 🎉 Deployment Complete!
echo ======================
echo ✅ Backend API: https://%APP_NAME_BACKEND%.azurewebsites.net
echo ✅ Frontend App: Check Azure Portal for Static Web App URL
echo ✅ Database: %DB_SERVER_NAME%.postgres.database.azure.com

echo.
echo 📋 Next Steps:
echo 1. Deploy your code:
echo    cd backend
echo    git remote add azure https://%APP_NAME_BACKEND%.scm.azurewebsites.net/%APP_NAME_BACKEND%.git
echo    git push azure main
echo.
echo 2. Run database migrations:
echo    az webapp ssh --resource-group %RESOURCE_GROUP% --name %APP_NAME_BACKEND%
echo    python manage.py migrate
echo.
echo 3. Update frontend API URL in config/api.js
echo.
echo 💰 Estimated Monthly Cost: $0 (using FREE tiers only)
echo.
echo ⚠️ Monitor your Azure costs at: https://portal.azure.com/#view/Microsoft_Azure_CostManagement

pause
