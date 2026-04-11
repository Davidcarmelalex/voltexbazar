# Voltex Core — Production Deployment (v9)

## 1) VPS Setup (Ubuntu)

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install docker.io docker-compose nginx certbot python3-certbot-nginx -y
sudo systemctl enable docker
```

## 2) Clone Repo

```bash
git clone https://github.com/Davidcarmelalex/voltexbazar.git
cd voltexbazar
```

## 3) Environment

Create `.env`:

```
OPENAI_API_KEY=YOUR_KEY
JWT_SECRET=CHANGE_ME
```

## 4) Run Production Stack

```bash
docker-compose -f infra/docker-compose.prod.yml up -d --build
```

## 5) Domain + DNS

- Buy domain (Namecheap/GoDaddy)
- Create A record → your VPS IP

## 6) Nginx Public Gateway

Ensure port 80 open. Your nginx container serves all routes.

## 7) SSL (HTTPS)

```bash
sudo certbot --nginx -d yourdomain.com
```

Auto-renew:

```bash
sudo crontab -e
# add
0 3 * * * certbot renew --quiet
```

## 8) Health Checks

- http://yourdomain.com
- http://yourdomain.com/api/ai/
- http://yourdomain.com/api/wallet/

## 9) Scaling (basic)

- Increase replicas (compose → scale)
- Add Redis for queues
- Move vector store to pgvector/FAISS

## 10) Security Checklist

- Change default passwords
- Use strong JWT secret
- Add rate limiting (nginx)
- Restrict DB port (internal only)

---

## Go Live

You now have a public AI SaaS endpoint behind your domain.
