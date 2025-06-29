# cPanel Deployment Guide for Next.js Application

## Prerequisites

1. **cPanel hosting with Node.js support** (most modern cPanel providers support this)
2. **SSH access** (recommended but not always required)
3. **Domain/subdomain** configured in cPanel

## Step-by-Step Deployment Guide

### Phase 1: Prepare Your Local Project

1. **Build your Next.js project for production:**
   ```bash
   npm run build
   ```

2. **Test your server.js locally:**
   ```bash
   NODE_ENV=production node server.js
   ```

3. **Create a production build archive:**
   ```bash
   # Remove development dependencies and files not needed in production
   rm -rf node_modules
   npm install --production
   
   # Create a zip file of your project
   zip -r nextsiders-production.zip . -x "*.git*" "*.DS_Store*" "node_modules/.cache/*"
   ```

### Phase 2: cPanel Setup

1. **Log into your cPanel account**

2. **Navigate to "Node.js Selector" or "Node.js App"**
   - Usually found in the "Software" section
   - If not available, contact your hosting provider

3. **Create a New Node.js Application:**
   - Click "Create Application"
   - **Node.js Version:** Select the latest LTS version (18.x or higher)
   - **Application Mode:** Production
   - **Application Root:** `nextsiders` (or your preferred folder name)
   - **Application URL:** Your domain or subdomain
   - **Application Startup File:** `server.js`

### Phase 3: File Upload and Configuration

1. **Upload your project files:**
   
   **Option A: File Manager (Recommended for beginners)**
   - Go to cPanel → File Manager
   - Navigate to your application root folder (e.g., `/public_html/nextsiders/`)
   - Upload and extract your `nextsiders-production.zip`
   
   **Option B: SSH/SFTP (Recommended for developers)**
   ```bash
   # Using SCP
   scp nextsiders-production.zip username@yourdomain.com:~/public_html/nextsiders/
   
   # Then SSH in and extract
   ssh username@yourdomain.com
   cd ~/public_html/nextsiders/
   unzip nextsiders-production.zip
   ```

2. **Set proper file permissions:**
   ```bash
   chmod 644 *.js *.json *.md
   chmod 755 server.js
   chmod -R 755 .next/
   chmod -R 755 public/
   ```

### Phase 4: Environment Configuration

1. **Create environment variables in cPanel:**
   - Go back to Node.js App
   - Select your application
   - In "Environment Variables" section, add:
     ```
     NODE_ENV=production
     PORT=3000
     ```

2. **Install dependencies:**
   - In the Node.js App interface, click "Run NPM Install"
   - Or via SSH:
     ```bash
     cd ~/public_html/nextsiders/
     npm install --production
     ```

### Phase 5: Domain Configuration

1. **Configure your domain/subdomain:**
   - If using main domain: Point it to your application folder
   - If using subdomain: Create subdomain pointing to application folder

2. **Update .htaccess file** (create in your domain root if needed):
   ```apache
   RewriteEngine On
   RewriteRule ^$ http://127.0.0.1:3000/ [P,L]
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule ^(.*)$ http://127.0.0.1:3000/$1 [P,L]
   ```

### Phase 6: Start Your Application

1. **Start the Node.js application:**
   - In cPanel → Node.js App
   - Click "Start App" next to your application
   - The status should change to "Running"

2. **Verify deployment:**
   - Visit your domain/subdomain
   - Check the application logs in cPanel for any errors

### Phase 7: SSL Configuration (Optional but Recommended)

1. **Enable SSL/HTTPS:**
   - Go to cPanel → SSL/TLS
   - Install SSL certificate (Let's Encrypt is usually free)
   - Force HTTPS redirects

2. **Update .htaccess for HTTPS redirect:**
   ```apache
   RewriteEngine On
   RewriteCond %{HTTPS} !=on
   RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
   
   RewriteRule ^$ http://127.0.0.1:3000/ [P,L]
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule ^(.*)$ http://127.0.0.1:3000/$1 [P,L]
   ```

## Troubleshooting

### Common Issues:

1. **Application won't start:**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check application logs in cPanel

2. **"Cannot find module" errors:**
   - Run `npm install --production` again
   - Ensure all required dependencies are in package.json

3. **Static files not loading:**
   - Verify file permissions (644 for files, 755 for directories)
   - Check if .next folder was uploaded completely

4. **404 errors:**
   - Verify .htaccess configuration
   - Check domain pointing configuration

### Useful Commands for SSH Access:

```bash
# Check application status
pm2 list

# View application logs
pm2 logs

# Restart application
pm2 restart all

# Check Node.js version
node --version

# Check port usage
netstat -tulpn | grep :3000
```

## Maintenance

### Updating Your Application:

1. Build locally: `npm run build`
2. Upload new files via File Manager or SFTP
3. Restart application in cPanel Node.js App interface

### Monitoring:

- Regularly check application logs in cPanel
- Monitor server resources usage
- Keep dependencies updated

## Alternative Deployment Methods

### Using Git (if supported by your host):

1. **Initialize Git repository on server:**
   ```bash
   cd ~/public_html/nextsiders/
   git init
   git remote add origin your-repo-url
   ```

2. **Deploy updates:**
   ```bash
   git pull origin main
   npm install --production
   pm2 restart all
   ```

## Notes

- Replace `yourusername` and `yourdomain.com` with your actual details
- Some hosting providers may have slightly different cPanel interfaces
- Always test in a staging environment first if possible
- Keep backups of your working configurations

## Support

If you encounter issues:
1. Check your hosting provider's documentation
2. Contact their support team
3. Verify Node.js version compatibility
4. Check application and server error logs 