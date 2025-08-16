# 🚀 PANDUAN DEPLOYMENT AZURE - STEP BY STEP

## Status: Anda sudah login ke Azure Cloud Shell ✅

Berdasarkan screenshot, Anda sudah berhasil login ke Azure for Students. Sekarang tinggal deploy!

## 🎯 Langkah Deployment (Hanya 3 menit!)

### Option 1: Deploy Otomatis (Recommended)
Salin dan paste script ini ke Azure Cloud Shell Anda:

```bash
# Variables
RESOURCE_GROUP="compress-img-rg"
APP_NAME="compress-img-$(date +%s)"
LOCATION="eastus"
REPO_URL="https://github.com/Glenferdinza/composser_compress-convert-file.git"

# Create resources
echo "🚀 Creating Azure resources..."
az group create --name $RESOURCE_GROUP --location $LOCATION
az appservice plan create --name "$APP_NAME-plan" --resource-group $RESOURCE_GROUP --sku F1 --is-linux
az webapp create --resource-group $RESOURCE_GROUP --plan "$APP_NAME-plan" --name $APP_NAME --runtime "PYTHON|3.12"

# Configure app
echo "⚙️ Configuring application..."
az webapp config appsettings set --resource-group $RESOURCE_GROUP --name $APP_NAME --settings DJANGO_SETTINGS_MODULE=compress_website.settings PYTHONPATH=/home/site/wwwroot/backend WEBSITES_PORT=8000 DEBUG=False SCM_DO_BUILD_DURING_DEPLOYMENT=true

# Deploy from GitHub
echo "🚀 Deploying from GitHub..."
az webapp deployment source config --resource-group $RESOURCE_GROUP --name $APP_NAME --repo-url $REPO_URL --branch main --manual-integration

# Show result
echo "🎉 DEPLOYMENT COMPLETED!"
echo "🌐 Your app: https://$APP_NAME.azurewebsites.net"
```

### Option 2: Deploy Manual (Jika Option 1 gagal)

1. **Create Resource Group:**
```bash
az group create --name compress-img-rg --location eastus
```

2. **Create App Service Plan:**
```bash
az appservice plan create --name compress-img-plan --resource-group compress-img-rg --sku F1 --is-linux
```

3. **Create Web App:**
```bash
az webapp create --resource-group compress-img-rg --plan compress-img-plan --name compress-img-yourname --runtime "PYTHON|3.12"
```
*Ganti "yourname" dengan nama unik*

4. **Configure Settings:**
```bash
az webapp config appsettings set --resource-group compress-img-rg --name compress-img-yourname --settings DJANGO_SETTINGS_MODULE=compress_website.settings PYTHONPATH=/home/site/wwwroot/backend WEBSITES_PORT=8000 DEBUG=False
```

5. **Deploy from GitHub:**
```bash
az webapp deployment source config --resource-group compress-img-rg --name compress-img-yourname --repo-url https://github.com/Glenferdinza/composser_compress-convert-file.git --branch main --manual-integration
```

## 🎯 Yang Harus Dilakukan Sekarang:

1. **Pilih Option 1** (copy paste script lengkap ke Azure Cloud Shell)
2. **Tunggu 3-5 menit** untuk deployment selesai
3. **Buka URL** yang muncul di hasil output
4. **Test aplikasi** Anda!

## 💰 Biaya: $0/bulan (Free tier)

## 🔧 Troubleshooting:
Jika ada error, jalankan:
```bash
az webapp log tail --resource-group compress-img-rg --name [APP-NAME]
```

## 📱 Akses Aplikasi:
Setelah deployment selesai, aplikasi bisa diakses di:
`https://[APP-NAME].azurewebsites.net`

---
*Ready untuk deploy? Pilih Option 1 dan paste ke Azure Cloud Shell Anda!* 🚀
