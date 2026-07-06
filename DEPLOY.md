# 赤赫汽保工具 — 部署指南（免备案）

> Vercel 服务器在境外，使用 `*.vercel.app` 域名 **不需要 ICP 备案**。

---

## 步骤 1：注册账号（5 分钟）

| 服务 | 网址 | 说明 |
|------|------|------|
| **GitHub** | https://github.com | 存放代码 |
| **Vercel** | https://vercel.com | 托管网站（用 GitHub 登录） |
| **Neon** | https://neon.tech | 免费 PostgreSQL 数据库 |

三个服务都有**免费额度**，足够个体工商护网站使用。

---

## 步骤 2：创建 Neon 数据库（3 分钟）

1. 登录 https://neon.tech （用 GitHub 账号即可）
2. 点击 **Create project**
3. 项目名填 `chihqibao`（或任意名字）
4. 创建完成后，在 **Dashboard → Connection Details** 中复制连接字符串
5. 格式类似：`postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require`

---

## 步骤 3：修改代码，推送到 GitHub

### 3.1 修改数据库配置

编辑 `prisma/schema.prisma`，将：

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

改为：

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 3.2 推送到 GitHub

```bash
git init
git add .
git commit -m "赤赫汽保工具 - 初始版本"
git branch -M main
git remote add origin https://github.com/你的用户名/仓库名.git
git push -u origin main
```

---

## 步骤 4：在 Vercel 中部署（3 分钟）

1. 登录 https://vercel.com
2. 点击 **Add New → Project**
3. 选择你刚推送的 GitHub 仓库
4. 在 **Environment Variables** 中添加：

| 变量名 | 值 |
|--------|-----|
| `DATABASE_URL` | 第 2 步中 Neon 的连接字符串 |
| `SESSION_SECRET` | 随机生成一个长字符串（如：`chih-2024-secure-key-8a7f3c2e1b`） |
| `ADMIN_USERNAME` | `admin` |
| `ADMIN_PASSWORD` | `admin123`（上线后建议到后台修改密码） |

5. 点击 **Deploy**，等待 2-3 分钟构建完成

---

## 步骤 5：验证

1. 打开 Vercel 给的网址（`https://xxx.vercel.app`）
2. 访问 `https://xxx.vercel.app/admin/login` 登录后台
3. 用 admin/admin123 登录
4. 到「修改密码」页面更换默认密码

---

## 可选：绑定自定义域名（仍免备案）

如果想使用自己的域名（如 `chihqibao.com`）：
1. 购买一个 `.com` / `.net` 等国际域名（阿里云万网、GoDaddy 等）
2. 在 Vercel 项目 → Settings → Domains 中添加域名
3. 按 Vercel 提示在域名后台添加 DNS 记录

**`.com` 域名解析到 Vercel 无需 ICP 备案**，因为服务器在境外。

---

## 本地继续开发

部署后如需在本地继续开发，将 `prisma/schema.prisma` 中的 provider 改回 `sqlite`，再运行：

```bash
prisma db push
npm run db:seed
npm run dev
```
