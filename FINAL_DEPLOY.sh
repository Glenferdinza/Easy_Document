#!/bin/bash
# 🚀 DEPLOYMENT SCRIPT FINAL UNTUK AZURE CLOUD SHELL
# Salin seluruh script ini dan paste di Azure Cloud Shell Anda

echo "🚀 Memulai deployment Compress_Img ke Azure..."
echo "💰 Menggunakan tier GRATIS Azure for Students"

# Set variables
RESOURCE_GROUP="compress-img-rg"
APP_NAME="compress-img-app-$(date +%s)"  # Tambah timestamp untuk nama unik
LOCATION="eastus"
REPO_URL="https://github.com/Glenferdinza/composser_compress-convert-file.git"

echo "📋 Konfigurasi deployment:"
echo "  🏷️  Resource Group: $RESOURCE_GROUP"
echo "  🌐 App Name: $APP_NAME"
echo "  📍 Location: $LOCATION"
echo "  📁 GitHub Repo: $REPO_URL"
echo ""

# 1. Buat resource group
echo "🏗️  Step 1: Membuat resource group..."
az group create \
  --name $RESOURCE_GROUP \
  --location $LOCATION \
  --output table

# 2. Buat App Service Plan (Free F1 tier)
echo "🏗️  Step 2: Membuat App Service Plan (F1 Free - $0/bulan)..."
az appservice plan create \
  --name "${APP_NAME}-plan" \
  --resource-group $RESOURCE_GROUP \
  --sku F1 \
  --is-linux \
  --output table

# 3. Buat Web App
echo "🌐 Step 3: Membuat Web App dengan Python 3.12..."
az webapp create \
  --resource-group $RESOURCE_GROUP \
  --plan "${APP_NAME}-plan" \
  --name $APP_NAME \
  --runtime "PYTHON|3.12" \
  --output table

# 4. Set environment variables
echo "⚙️  Step 4: Mengatur environment variables..."
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --settings \
    DJANGO_SETTINGS_MODULE=compress_website.settings \
    PYTHONPATH=/home/site/wwwroot/backend \
    WEBSITES_PORT=8000 \
    DEBUG=False \
    SCM_DO_BUILD_DURING_DEPLOYMENT=true \
    ENABLE_ORYX_BUILD=true \
  --output table

# 5. Set startup command
echo "🔧 Step 5: Mengatur startup command..."
az webapp config set \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --startup-file "cd backend && python manage.py migrate && gunicorn compress_website.wsgi:application --bind 0.0.0.0:8000" \
  --output table

# 6. Deploy dari GitHub
echo "🚀 Step 6: Deploy dari GitHub repository..."
az webapp deployment source config \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --repo-url $REPO_URL \
  --branch main \
  --manual-integration \
  --output table

# 7. Tunggu deployment selesai
echo "⏳ Step 7: Menunggu deployment selesai..."
sleep 30

# 8. Tampilkan hasil
echo ""
echo "🎉 DEPLOYMENT BERHASIL!"
echo "================================"
echo "🌐 URL Aplikasi: https://$APP_NAME.azurewebsites.net"
echo "📊 Resource Group: $RESOURCE_GROUP"
echo "🏷️  App Name: $APP_NAME"
echo "💰 Biaya: $0/bulan (Free tier)"
echo ""
echo "📋 Next Steps:"
echo "1. ⏳ Tunggu 5-10 menit untuk deployment pertama selesai"
echo "2. 🌐 Buka URL aplikasi di browser"
echo "3. 📊 Monitor di Azure Portal"
echo ""
echo "🔍 Untuk cek status deployment:"
echo "   az webapp log tail --resource-group $RESOURCE_GROUP --name $APP_NAME"
echo ""
echo "🛠️  Untuk troubleshooting:"
echo "   az webapp log download --resource-group $RESOURCE_GROUP --name $APP_NAME"

# Simpan info deployment
echo "# Deployment Info" > deployment-info.txt
echo "Resource Group: $RESOURCE_GROUP" >> deployment-info.txt
echo "App Name: $APP_NAME" >> deployment-info.txt
echo "URL: https://$APP_NAME.azurewebsites.net" >> deployment-info.txt
echo "Date: $(date)" >> deployment-info.txt

echo ""
echo "✅ Info deployment disimpan di deployment-info.txt"
