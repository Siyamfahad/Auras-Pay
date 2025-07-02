# 🚀 AURAS Pay - Ubuntu Server Deployment Guide

This guide will help you deploy the complete AURAS Pay project on an Ubuntu server.

## 📋 What Changes for Production

### 1. Environment Variables
- Backend: Switch from localhost to your domain
- Frontend: Update API URLs to your domain  
- Database: PostgreSQL instead of SQLite

### 2. Process Management
- PM2 for keeping all services running
- Automatic restarts on crashes
- Log management

### 3. Reverse Proxy
- Nginx for serving multiple services
- SSL termination
- Static file serving

## 🔧 Prerequisites

- Ubuntu 20.04+ server
- Domain name pointing to your server
- Root access
- At least 2GB RAM

## 🚀 Quick Deployment Steps

1. **Upload project to server**
2. **Run deployment script**: `chmod +x deploy-ubuntu.sh && sudo ./deploy-ubuntu.sh`
3. **Enter your domain when prompted**
4. **Access your app at**: `https://yourdomain.com`

## 🌐 Service URLs After Deployment

- Main App: `https://yourdomain.com`
- Admin Panel: `https://yourdomain.com/admin`
- API: `https://yourdomain.com/api/*`
- Wallet Page: `https://yourdomain.com/wallet`
- Health Check: `https://yourdomain.com/health`

## 🔑 Default Admin Credentials

- Email: `admin@aurasepay.com`
- Password: `admin123`

**⚠️ Change these immediately after deployment!**

## 📊 Management Commands

```bash
# Check services
sudo -u auras pm2 status

# Restart services  
sudo -u auras pm2 restart all

# View logs
sudo -u auras pm2 logs

# Restart nginx
sudo systemctl restart nginx
```

## 📝 Important Locations

- Application: `/home/auras/auras-pay/`
- Logs: `/home/auras/auras-pay/logs/`
- Nginx Config: `/etc/nginx/sites-available/auras-pay`

## 🔒 Security Notes

1. Change default passwords immediately
2. Update Stripe keys to live keys
3. Set up monitoring (recommended)
4. Keep system updated
