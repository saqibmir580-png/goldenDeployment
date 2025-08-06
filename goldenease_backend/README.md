# Document Validator API

A FastAPI-based Python application for validating documents, deployed on an Ubuntu server with systemd and Nginx for process management and secure access.

---

## ⚙️ Requirements

- Python 3.10.11
- Uvicorn
- FastAPI
- Other dependencies listed in `requirements.txt`

---

## 🚀 Getting Started

### 1. Clone the repository and navigate to the project directory
```bash
git clone <repo-url>
cd uploads
```

### 2. Set up a virtual environment
```bash
python3 -m venv env
source env/bin/activate
```

### 3. Install dependencies
```bash
pip3 install -r requirements.txt
```

---

## 🔧 Running the Application with systemd

Create a systemd service file (e.g., `/etc/systemd/system/document-validator.service`):

```ini
[Unit]
Description=FastAPI Document Validator
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/uploads
ExecStart=/home/ubuntu/uploads/env/bin/uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=5
StandardOutput=append:/var/log/myapp.log
StandardError=append:/var/log/myapp.err.log

[Install]
WantedBy=multi-user.target
```

### Enable and start the service
```bash
sudo systemctl daemon-reexec
sudo systemctl daemon-reload
sudo systemctl enable document-validator
sudo systemctl start document-validator
```

### Check status
```bash
sudo systemctl status document-validator
```

---

## 🌐 Nginx Configuration

Set up reverse proxy and HTTPS redirection with Nginx.

### Example config file (`/etc/nginx/sites-available/document-validator`)
```nginx
server {
    listen 80;
    server_name demo.maskantech.in;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name demo.maskantech.in;

    ssl_certificate /etc/letsencrypt/live/demo.maskantech.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/demo.maskantech.in/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Enable and test Nginx
```bash
sudo ln -s /etc/nginx/sites-available/document-validator /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🔐 SSL Certificates

Use **Let's Encrypt** and **Certbot** to generate SSL certificates:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d demo.maskantech.in
```

---

