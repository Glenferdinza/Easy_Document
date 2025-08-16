#!/bin/bash
# Azure Cloud Shell Deployment Script for Compress_Img
# This script will deploy the application using Azure CLI in Cloud Shell

echo "🚀 Starting Azure deployment for Compress_Img..."

# Set variables
RESOURCE_GROUP="compress-img-rg"
APP_NAME="compress-img-app"
LOCATION="eastus"
GITHUB_REPO="https://github.com/Glenferdinza/composser_compress-convert-file.git"

echo "📋 Configuration:"
echo "  Resource Group: $RESOURCE_GROUP"
echo "  App Name: $APP_NAME"
echo "  Location: $LOCATION"
echo "  GitHub Repo: $GITHUB_REPO"

# Create resource group
echo "🏗️  Creating resource group..."
az group create --name $RESOURCE_GROUP --location $LOCATION

# Create App Service Plan (Free tier)
echo "🏗️  Creating App Service Plan (F1 Free tier)..."
az appservice plan create \
  --name "${APP_NAME}-plan" \
  --resource-group $RESOURCE_GROUP \
  --sku F1 \
  --is-linux

# Create Web App
echo "🌐 Creating Web App..."
az webapp create \
  --resource-group $RESOURCE_GROUP \
  --plan "${APP_NAME}-plan" \
  --name $APP_NAME \
  --runtime "PYTHON|3.12" \
  --deployment-source-url $GITHUB_REPO \
  --deployment-source-branch main

# Configure app settings
echo "⚙️  Configuring app settings..."
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --settings \
    DJANGO_SETTINGS_MODULE=backend.settings \
    PYTHONPATH=/home/site/wwwroot \
    WEBSITES_PORT=8000 \
    DEBUG=False \
    ALLOWED_HOSTS="$APP_NAME.azurewebsites.net" \
    DATABASE_URL="sqlite:///db.sqlite3"

# Set startup command
echo "🔧 Setting startup command..."
az webapp config set \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --startup-file "python backend/manage.py runserver 0.0.0.0:8000"

# Enable continuous deployment
echo "🔄 Enabling continuous deployment..."
az webapp deployment source config \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --repo-url $GITHUB_REPO \
  --branch main \
  --manual-integration

echo "✅ Deployment completed!"
echo "🌐 Your app will be available at: https://$APP_NAME.azurewebsites.net"
echo ""
echo "📊 Next steps:"
echo "  1. Wait 5-10 minutes for first deployment to complete"
echo "  2. Check deployment status in Azure Portal"
echo "  3. Visit your app URL"
echo ""
echo "🔍 To check deployment status:"
echo "  az webapp log tail --resource-group $RESOURCE_GROUP --name $APP_NAME"
