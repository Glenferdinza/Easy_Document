#!/bin/bash

# Azure for Students Deployment Script - Cost Effective
# This script deploys the compression website to Azure using FREE services

echo "🎓 Azure for Students Deployment - Cost Effective Setup"
echo "======================================================"

# Configuration
RESOURCE_GROUP="compress-app-rg"
LOCATION="East US"
APP_NAME_BACKEND="compress-backend-api"
APP_NAME_FRONTEND="compress-frontend"
DB_SERVER_NAME="compress-postgres-server"
DB_NAME="compressdb"
DB_USER="compressadmin"
DB_PASSWORD="SecurePassword123!"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    print_error "Azure CLI is not installed. Please install it first:"
    echo "https://aka.ms/installazurecliwindows"
    exit 1
fi

# Login to Azure
echo "🔐 Logging in to Azure..."
az login

# Set subscription to Azure for Students
echo "📋 Setting subscription to Azure for Students..."
az account set --subscription "Azure for Students"

# Create Resource Group
echo "📁 Creating resource group..."
az group create \
  --name $RESOURCE_GROUP \
  --location "$LOCATION" \
  --output table

print_status "Resource group created"

# Create PostgreSQL Server (FREE TIER)
echo "🐘 Creating PostgreSQL server (FREE TIER)..."
az postgres flexible-server create \
  --resource-group $RESOURCE_GROUP \
  --name $DB_SERVER_NAME \
  --location "$LOCATION" \
  --admin-user $DB_USER \
  --admin-password $DB_PASSWORD \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --public-access 0.0.0.0 \
  --storage-size 32 \
  --version 13 \
  --output table

print_status "PostgreSQL server created"

# Create database
echo "🗃️  Creating database..."
az postgres flexible-server db create \
  --resource-group $RESOURCE_GROUP \
  --server-name $DB_SERVER_NAME \
  --database-name $DB_NAME \
  --output table

print_status "Database created"

# Configure firewall
echo "🔥 Configuring firewall rules..."
az postgres flexible-server firewall-rule create \
  --resource-group $RESOURCE_GROUP \
  --name $DB_SERVER_NAME \
  --rule-name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0 \
  --output table

print_status "Firewall configured"

# Create App Service Plan (FREE TIER)
echo "📋 Creating App Service Plan (FREE TIER)..."
az appservice plan create \
  --name compress-app-plan \
  --resource-group $RESOURCE_GROUP \
  --sku F1 \
  --is-linux \
  --output table

print_status "App Service Plan created"

# Create Web App for Backend
echo "🌐 Creating backend web app..."
az webapp create \
  --resource-group $RESOURCE_GROUP \
  --plan compress-app-plan \
  --name $APP_NAME_BACKEND \
  --runtime "PYTHON|3.11" \
  --deployment-local-git \
  --output table

print_status "Backend web app created"

# Configure backend environment variables
echo "⚙️  Setting environment variables..."
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME_BACKEND \
  --settings \
    AZURE_POSTGRESQL_HOST="$DB_SERVER_NAME.postgres.database.azure.com" \
    AZURE_POSTGRESQL_NAME="$DB_NAME" \
    AZURE_POSTGRESQL_USER="$DB_USER" \
    AZURE_POSTGRESQL_PASSWORD="$DB_PASSWORD" \
    SECRET_KEY="django-insecure-change-this-in-production-$(date +%s)" \
    DEBUG="False" \
    CORS_ORIGINS="https://$APP_NAME_FRONTEND.azurewebsites.net" \
    FRONTEND_URL="https://$APP_NAME_FRONTEND.azurewebsites.net" \
  --output table

print_status "Environment variables configured"

# Create Static Web App (FREE TIER)
echo "📱 Creating frontend static web app..."
print_warning "This requires GitHub authentication..."

az staticwebapp create \
  --name $APP_NAME_FRONTEND \
  --resource-group $RESOURCE_GROUP \
  --source https://github.com/Glenferdinza/Tugas-Proyek-Akhir-Dicoding \
  --branch main \
  --app-location "/frontend" \
  --output-location "build" \
  --login-with-github

print_status "Frontend static web app created"

# Create budget alert
echo "💰 Setting up cost alert..."
az consumption budget create \
  --budget-name azure-students-budget \
  --amount 80 \
  --category cost \
  --time-grain monthly \
  --start-date $(date -d "first day of this month" +%Y-%m-01) \
  --end-date $(date -d "first day of next year" +%Y-%m-01) \
  2>/dev/null || print_warning "Budget alert creation skipped (may require additional permissions)"

# Get deployment URLs
BACKEND_URL=$(az webapp show --resource-group $RESOURCE_GROUP --name $APP_NAME_BACKEND --query defaultHostName -o tsv)
FRONTEND_URL=$(az staticwebapp show --name $APP_NAME_FRONTEND --resource-group $RESOURCE_GROUP --query defaultHostname -o tsv 2>/dev/null || echo "Check Azure Portal for Static Web App URL")

echo ""
echo "🎉 Deployment Complete!"
echo "======================"
print_status "Backend API: https://$BACKEND_URL"
print_status "Frontend App: https://$FRONTEND_URL"
print_status "Database: $DB_SERVER_NAME.postgres.database.azure.com"

echo ""
echo "📋 Next Steps:"
echo "1. Deploy your code:"
echo "   cd backend && git remote add azure https://$APP_NAME_BACKEND.scm.azurewebsites.net/$APP_NAME_BACKEND.git"
echo "   git push azure main"
echo ""
echo "2. Run database migrations:"
echo "   az webapp ssh --resource-group $RESOURCE_GROUP --name $APP_NAME_BACKEND"
echo "   python manage.py migrate"
echo ""
echo "3. Update frontend API URL in config/api.js"
echo ""
echo "💰 Estimated Monthly Cost: $0 (using FREE tiers only)"
echo ""
print_warning "Monitor your Azure costs at: https://portal.azure.com/#view/Microsoft_Azure_CostManagement"
