# 云端化改造操作指南

## 改造内容摘要

| 模块 | 改造前 | 改造后 |
|------|--------|--------|
| 图片资源 | 根目录本地 `.png` 文件 | GitHub + jsDelivr CDN |
| Python 后端 | 本地 Python 环境 + pip 安装 | Docker 容器 |
| 前端 | 本地 Vite dev server | 任意静态托管（Vercel/Cloudflare Pages/OSS） |

---

## 第一步：推送图片资源到 GitHub

```bash
# 1. 在 GitHub 上创建仓库 alidor4702/joy-pet（若不存在）

# 2. 在项目根目录初始化 git 并推送
cd "/Desktop/PET agent"
git init
git remote add origin https://github.com/alidor4702/joy-pet.git
git add assets/
git add joy-pet.html joy-pet_副本.html index.html src/ public/ rili.html server.mjs
git add package.json package-lock.json tsconfig*.json vite.config.ts .gitignore
git commit -m "feat: cloud migration - images to CDN, add Docker for DogTranslator"
git push -u origin main
```

图片推送完成后，CDN URL 自动生效（jsDelivr 会缓存 GitHub 内容）：
```
https://cdn.jsdelivr.net/gh/alidor4702/joy-pet@main/assets/images/trophy-1.png
https://cdn.jsdelivr.net/gh/alidor4702/joy-pet@main/assets/images/trophy-2.png
```

> **注意**：jsDelivr 缓存刷新需要 24 小时，可用 `https://purge.jsdelivr.net/gh/alidor4702/joy-pet@main/assets/images/trophy-1.png` 强制刷新。

---

## 第二步：前端构建和部署

### 方案 A：Vercel（推荐）
```bash
# 安装 Vercel CLI
npm install -g vercel

# 在项目根目录
vercel --prod
```

### 方案 B：Cloudflare Pages
在 Cloudflare Pages 控制台连接 GitHub 仓库，设置：
- Build command: `npm run build`
- Output directory: `dist`

### 方案 C：手动部署
```bash
npm install
npm run build
# 将 dist/ 目录上传到任意静态托管
```

---

## 第三步：部署 DogTranslator Python 后端

### 方案 A：Docker（任意云服务器）

1. 将模型文件放入 `DogTranslator/models/henri_model.pt`（若有）
2. 创建环境变量文件：

```bash
cd DogTranslator
cp .env .env.production
# 编辑 .env.production，填入真实 API Key：
# CEREBRAS_API_KEY=你的key
# GRADIUM_API_KEY=你的key
```

3. 构建并运行：

```bash
# 构建镜像（约 10-15 分钟，下载 PyTorch）
docker build -t dog-translator .

# 运行（--env-file 传入 API Key）
docker run -d \
  --name dog-translator \
  -p 8000:8000 \
  --env-file .env.production \
  -v $(pwd)/models:/app/models:ro \
  -v $(pwd)/uploads:/app/uploads \
  --restart unless-stopped \
  dog-translator

# 验证服务
curl http://localhost:8000/health
```

4. 或使用 docker-compose：

```bash
docker-compose up -d
```

### 方案 B：Railway 一键部署

1. 进入 [railway.app](https://railway.app)，连接 GitHub
2. 选择 `DogTranslator/` 子目录
3. 在环境变量面板填入 `CEREBRAS_API_KEY` 和 `GRADIUM_API_KEY`
4. 部署完成后获取公网 URL

---

## 验收检查清单

- [ ] 在不同设备/网络下访问前端，`trophy-1.png` / `trophy-2.png` 正常显示
- [ ] 所有 `assets/images/` 图片可通过 jsDelivr URL 访问（HTTP 200）
- [ ] `npm install` 后 `npm run dev` 正常运行，无本地图片 404
- [ ] Docker 容器 `/health` 返回 `{"status": "ok"}`
- [ ] 狗语翻译功能（录音→分析→播放）端到端正常

---

## 图片 CDN URL 速查

```
https://cdn.jsdelivr.net/gh/alidor4702/joy-pet@main/assets/images/trophy-1.png
https://cdn.jsdelivr.net/gh/alidor4702/joy-pet@main/assets/images/trophy-2.png
https://cdn.jsdelivr.net/gh/alidor4702/joy-pet@main/assets/images/call.png
https://cdn.jsdelivr.net/gh/alidor4702/joy-pet@main/assets/images/call-top.png
https://cdn.jsdelivr.net/gh/alidor4702/joy-pet@main/assets/images/call-bottom.png
https://cdn.jsdelivr.net/gh/alidor4702/joy-pet@main/assets/images/start.png
https://cdn.jsdelivr.net/gh/alidor4702/joy-pet@main/assets/images/xingge.png
https://cdn.jsdelivr.net/gh/alidor4702/joy-pet@main/assets/images/jiangbei.png
```
