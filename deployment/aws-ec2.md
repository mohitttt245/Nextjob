# AWS EC2 Deployment Guide

## 1. Launch the server

1. Create an Ubuntu EC2 instance.
2. Open inbound rules for:
   - `22` for SSH
   - `80` for HTTP
   - `443` for HTTPS if you add SSL later
3. SSH into the instance:

```bash
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```

## 2. Install runtime dependencies

```bash
sudo apt update
sudo apt install -y nginx
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

## 3. Copy the project

```bash
git clone <your-repository-url> /home/ubuntu/nextjob
cd /home/ubuntu/nextjob
npm install
```

If you prefer separate installs:

```bash
cd /home/ubuntu/nextjob/backend && npm install
cd /home/ubuntu/nextjob/frontend && npm install
```

## 4. Configure environment variables

Create production env files:

```bash
cp /home/ubuntu/nextjob/backend/.env.example /home/ubuntu/nextjob/backend/.env
cp /home/ubuntu/nextjob/frontend/.env.example /home/ubuntu/nextjob/frontend/.env
```

Recommended values:

```env
# backend/.env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/nextjob
CLIENT_URL=https://your-domain.com
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace-this-password
ADMIN_NAME=NextJob Admin
JWT_SECRET=replace-this-with-a-long-random-secret
JWT_EXPIRES_IN=12h
OPENAI_API_KEY=your_openai_key
OPENAI_MODEL=gpt-4.1-mini
UPLOADS_DIR=
```

```env
# frontend/.env
VITE_API_BASE_URL=/api
```

## 5. Seed the database

```bash
cd /home/ubuntu/nextjob
npm run seed
```

## 6. Build the frontend

```bash
cd /home/ubuntu/nextjob
npm run build
sudo mkdir -p /var/www/nextjob/frontend
sudo rsync -av --delete /home/ubuntu/nextjob/frontend/dist/ /var/www/nextjob/frontend/dist/
```

## 7. Start the backend with PM2

Review the `cwd` in [deployment/pm2/ecosystem.config.cjs](/C:/Users/mohit/Desktop/nextjob/deployment/pm2/ecosystem.config.cjs) and adjust it if your deploy path differs.

```bash
cd /home/ubuntu/nextjob
pm2 start deployment/pm2/ecosystem.config.cjs
pm2 save
pm2 startup
```

## 8. Configure Nginx

Copy the prepared Nginx file:

```bash
sudo cp /home/ubuntu/nextjob/deployment/nginx/nextjob.conf /etc/nginx/sites-available/nextjob
sudo ln -s /etc/nginx/sites-available/nextjob /etc/nginx/sites-enabled/nextjob
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

If you used a different frontend deploy path, update the `root` value inside [deployment/nginx/nextjob.conf](/C:/Users/mohit/Desktop/nextjob/deployment/nginx/nextjob.conf).

## 9. Optional SSL with Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 10. Update workflow

```bash
cd /home/ubuntu/nextjob
git pull
npm install
npm run build
sudo rsync -av --delete /home/ubuntu/nextjob/frontend/dist/ /var/www/nextjob/frontend/dist/
pm2 restart nextjob-api
sudo systemctl reload nginx
```

## 11. Admin login

After deployment, the admin dashboard is available at:

- `https://your-domain.com/admin/login`

Sign in using the `ADMIN_EMAIL` and `ADMIN_PASSWORD` values from `backend/.env`.
