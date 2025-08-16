# 🎓 Azure for Students Deployment Guide - Cost Effective ($100 Budget)

## 💰 Cost Breakdown & Free Services

### ✅ **FREE Services for Azure for Students:**
- **Azure App Service** (F1 Free tier): FREE
- **Azure Database for PostgreSQL** (Flexible Server): FREE tier available
- **Azure SQL Database**: 32GB FREE tier
- **Azure Storage Account**: 5GB FREE tier
- **Application Insights**: Basic tier FREE

### ❌ **AVOID These Expensive Services:**
- **Azure Database for MySQL**: $0.04/hour ≈ $29/month (depletes $100 in 3 months)
- **Azure Cache for Redis**: $15+/month
- **Premium App Service plans**: $55+/month

## 🚀 Step-by-Step Deployment

### Prerequisites
```bash
# Install Azure CLI
# Download from: https://aka.ms/installazurecliwindows

# Login to Azure
az logingit

# Set subscription (Azure for Students)
az account set --subscription "Azure for Students"
```

### Step 1: Create Resource Group
```bash
az group create \
  --name compress-app-rg \
  --location "East US"
```

### Step 2: Create PostgreSQL FREE Database
```bash
# Create PostgreSQL server (FREE TIER)
az postgres flexible-server create \
  --resource-group compress-app-rg \
  --name compress-postgres-server \
  --location "East US" \
  --admin-user compressadmin \
  --admin-password "SecurePassword123!" \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --public-access 0.0.0.0 \
  --storage-size 32 \
  --version 13

# Create database
az postgres flexible-server db create \
  --resource-group compress-app-rg \
  --server-name compress-postgres-server \
  --database-name compressdb
```

### Step 3: Create App Service (Backend)
```bash
# Create App Service Plan (FREE TIER)
az appservice plan create \
  --name compress-app-plan \
  --resource-group compress-app-rg \
  --sku F1 \
  --is-linux

# Create Web App for Backend
az webapp create \
  --resource-group compress-app-rg \
  --plan compress-app-plan \
  --name compress-backend-api \
  --runtime "PYTHON|3.11" \
  --deployment-local-git
```

### Step 4: Configure Backend Environment Variables
```bash
# Set database connection
az webapp config appsettings set \
  --resource-group compress-app-rg \
  --name compress-backend-api \
  --settings \
    AZURE_POSTGRESQL_HOST="compress-postgres-server.postgres.database.azure.com" \
    AZURE_POSTGRESQL_NAME="compressdb" \
    AZURE_POSTGRESQL_USER="compressadmin" \
    AZURE_POSTGRESQL_PASSWORD="SecurePassword123!" \
    SECRET_KEY="your-very-secure-secret-key-change-this" \
    DEBUG="False" \
    CORS_ORIGINS="https://compress-frontend.azurewebsites.net" \
    FRONTEND_URL="https://compress-frontend.azurewebsites.net"
```

### Step 5: Deploy Backend Code
```bash
# In your backend directory
cd c:\Users\Lenovo\Downloads\Compress_Img\backend

# Add Azure remote
git remote add azure https://compress-backend-api.scm.azurewebsites.net/compress-backend-api.git

# Deploy
git push azure main
```

### Step 6: Create Static Web App (Frontend) - FREE
```bash
# Create Static Web App (FREE TIER)
az staticwebapp create \
  --name compress-frontend \
  --resource-group compress-app-rg \
  --source https://github.com/Glenferdinza/Tugas-Proyek-Akhir-Dicoding \
  --branch main \
  --app-location "/frontend" \
  --output-location "build" \
  --login-with-github
```

### Step 7: Update Frontend API Configuration
Update `frontend/src/config/api.js`:
```javascript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://compress-backend-api.azurewebsites.net/api'
  : 'http://localhost:8000/api';

export default API_BASE_URL;
```

### Step 8: Configure Database Firewall
```bash
# Allow Azure services to access PostgreSQL
az postgres flexible-server firewall-rule create \
  --resource-group compress-app-rg \
  --name compress-postgres-server \
  --rule-name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

### Step 9: Run Database Migrations
```bash
# SSH into App Service and run migrations
az webapp ssh --resource-group compress-app-rg --name compress-backend-api

# Inside the container:
python manage.py migrate
python manage.py collectstatic --noinput
```

## 📊 Cost Monitoring

### Set Up Cost Alerts
```bash
# Create budget alert for $80 (80% of $100)
az consumption budget create \
  --budget-name azure-students-budget \
  --amount 80 \
  --category cost \
  --time-grain monthly \
  --start-date 2025-08-01 \
  --end-date 2026-08-01
```

### Monthly Cost Estimate:
- **App Service F1**: $0 (FREE)
- **PostgreSQL Flexible Server**: $0 (FREE tier)
- **Static Web App**: $0 (FREE)
- **Storage Account**: $0 (5GB FREE)
- **Total**: **$0/month** ✅

## 🔧 Alternative Cost-Saving Options

### Option 1: Use SQLite (Simplest)
- No database server needed
- Perfect for small to medium traffic
- Zero database costs
- Just remove PostgreSQL configuration

### Option 2: Use Azure SQL Database Free Tier
```bash
# Create SQL Server
az sql server create \
  --name compress-sql-server \
  --resource-group compress-app-rg \
  --admin-user sqladmin \
  --admin-password "SecurePassword123!"

# Create FREE database (32GB limit)
az sql db create \
  --resource-group compress-app-rg \
  --server compress-sql-server \
  --name compressdb \
  --service-objective Basic \
  --max-size 32GB
```

## 🚦 Traffic & Performance Limits

### Free Tier Limitations:
- **F1 App Service**: 1GB RAM, 60 minutes/day compute
- **PostgreSQL Free**: 32GB storage, limited IOPS
- **Static Web App**: 100GB bandwidth/month

### When to Upgrade:
- High traffic: Upgrade to B1 App Service ($13/month)
- Large database: Upgrade PostgreSQL ($5+/month)
- File storage: Add Azure Storage ($2+/month)

## 📈 Monitoring & Optimization

### Track Your Spending:
1. Go to Azure Portal → Cost Management + Billing
2. Check daily costs
3. Set up email alerts
4. Monitor resource usage

### Performance Tips:
- Use SQLite for development/small scale
- Enable compression for static files
- Optimize images before upload
- Use CDN for static assets (if needed)

## 🆘 Troubleshooting

### Common Issues:
1. **App won't start**: Check environment variables
2. **Database connection fails**: Verify firewall rules
3. **Static files not loading**: Run `collectstatic`
4. **CORS errors**: Update CORS_ORIGINS setting

### Support Resources:
- Azure for Students Support: https://aka.ms/azureforedu
- Azure Documentation: https://docs.microsoft.com/azure
- Cost Management: https://portal.azure.com/#view/Microsoft_Azure_CostManagement

---

**💡 Pro Tip**: Start with SQLite for initial deployment, then upgrade to PostgreSQL when you need multi-user support or larger datasets. This keeps costs at $0 initially!
