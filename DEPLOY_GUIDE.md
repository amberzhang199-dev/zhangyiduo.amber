# 全云端部署指南（分步骤操作）

## 前置准备

1. **Cloudflare 账号**（免费）：https://dash.cloudflare.com/sign-up
2. **Render 账号**（免费）：https://dashboard.render.com/register（用 GitHub 登录）

---

## 第一步：部署 AI 对话代理到 Cloudflare Workers

```bash
# 1. 安装 wrangler（Cloudflare CLI）
npm install -g wrangler

# 2. 登录 Cloudflare
wrangler login
# 浏览器会自动打开授权页面，点击允许

# 3. 部署 Worker
cd "/Users/zhangyiduo.amber/Desktop/PET agent/cloudflare-worker"
wrangler deploy

# 4. 部署成功后，记下 Worker URL（https://xxx.workers.dev）
```

**获取 Worker URL 的方法：**
- 部署输出中会显示 `Published xxx (x.xx sec)`  
  `  https://joy-pet-chat-proxy.你的用户名.workers.dev`
- 或访问 https://dash.cloudflare.com/ → Workers & Pages → 点击 `joy-pet-chat-proxy`

---

## 第二步：部署 Python 后端到 Render

### 方式 A：通过 GitHub（推荐）

```bash
# 1. 在 GitHub 创建仓库（如果还没有）
# 登录 github.com，创建新仓库 joy-pet

# 2. 推送代码
cd "/Users/zhangyiduo.amber/Desktop/PET agent"
git init
git add .
git commit -m "deploy: cloud migration complete"
git branch -M main
git remote add origin https://github.com/alidor4702/joy-pet.git
git push -u origin main

# 3. 在 Render 部署
# - 访问 https://dashboard.render.com/
# - 点击 "New" → "Web Service"
# - 选择 "Build and deploy from a Git repository"
# - 连接 GitHub，选择 joy-pet 仓库
# - Root Directory: DogTranslator
# - Build Command: pip install flask flask-cors requests python-dotenv torch torchaudio transformers --index-url https://download.pytorch.org/whl/cpu
# - Start Command: python server.py
# - 添加环境变量：
#   CEREBRAS_API_KEY=csk-kdvcchcmrf9546ev8e4nknrmyckd9nvjndw82d5nkxdn8y4d
#   GRADIUM_API_KEY=gsk_727385b3813538b0540c99a592cbaeff6020f6a31600087bff075b7223e1d6ba
# - 点击 "Create Web Service"
```

### 方式 B：使用 render.yaml

Render 会自动检测 `DogTranslator/render.yaml`，按提示操作即可。

**部署完成后，记下 Render URL：**  
`https://dog-translator-xxx.onrender.com`

---

## 第三步：更新前端 API 地址

用你刚才记下的两个 URL 替换：

```bash
cd "/Users/zhangyiduo.amber/Desktop/PET agent"

# 替换 Worker URL（示例，换成你的实际 URL）
WORKER_URL="https://joy-pet-chat-proxy.你的用户名.workers.dev"
RENDER_URL="https://dog-translator-xxx.onrender.com"

# Mac 用户
sed -i '' "s|http://localhost:3001/chat|${WORKER_URL}/chat|g" joy-pet.html
sed -i '' "s|http://localhost:8000|${RENDER_URL}|g" joy-pet.html

# Linux 用户
sed -i "s|http://localhost:3001/chat|${WORKER_URL}/chat|g" joy-pet.html
sed -i "s|http://localhost:8000|${RENDER_URL}|g" joy-pet.html
```

或者手动编辑 `joy-pet.html` 第 1147-1148 行。

---

## 第四步：部署前端到 Cloudflare Pages

### 方式 A：使用 Wrangler（推荐）

```bash
cd "/Users/zhangyiduo.amber/Desktop/PET agent"

# 创建部署目录
mkdir -p dist-static
cp joy-pet.html dist-static/index.html
cp -r assets dist-static/ 2>/dev/null || true

# 部署
cd dist-static
npx wrangler pages deploy . --project-name joy-pet

# 部署成功后会显示 URL：https://joy-pet-xxx.pages.dev
```

### 方式 B：网页上传

1. 访问 https://dash.cloudflare.com/ → Pages
2. 点击 "Create a project" → "Upload assets"
3. 拖入 `joy-pet.html` 和 `assets/` 目录
4. 点击 "Deploy site"

---

## 验收检查清单

**在任意设备（手机/电脑）上测试：**

1. ✅ 访问前端 URL（https://joy-pet-xxx.pages.dev）
2. ✅ 完成宠物测试，触发奖杯弹窗 → 图片正常显示（来自 Cloudinary）
3. ✅ 测试 AI 对话功能 → 正常回复（调用 Cloudflare Worker）
4. ✅ 测试狗语翻译功能 → 正常翻译（调用 Render 后端）
5. ✅ 打开浏览器开发者工具 Network 面板，确认：
   - 图片请求：`https://res.cloudinary.com/dydfeoq9b/...`
   - AI 对话：`https://xxx.workers.dev/chat`
   - 狗语翻译：`https://xxx.onrender.com/process_audio_stream`

---

## 部署架构

```
┌─────────────────────────────────────────────┐
│  用户浏览器（任意设备）                      │
└─────────────┬───────────────────────────────┘
              │
    ┌─────────┴─────────┬──────────────┬─────────────┐
    │                   │              │             │
    v                   v              v             v
┌───────────┐   ┌──────────────┐  ┌────────┐  ┌────────────┐
│ 前端静态   │   │ AI 对话代理  │  │ 狗语翻译│  │ 图片 CDN   │
│ Cloudflare│   │ Cloudflare   │  │ Render  │  │ Cloudinary │
│ Pages     │   │ Workers      │  │ Python  │  │            │
└───────────┘   └──────────────┘  └────────┘  └────────────┘
```

**所有服务均为云端托管，无本地依赖 ✅**

---

## 部署 URL 记录

部署完成后，将 URL 记录在此：

- **前端**: https://_____________________.pages.dev
- **AI 对话**: https://_____________________.workers.dev
- **DogTranslator**: https://_____________________.onrender.com
- **图片 CDN**: https://res.cloudinary.com/dydfeoq9b/image/upload/joy-pet/

---

## 成本

- Cloudflare Workers: 免费额度 100,000 请求/天
- Cloudflare Pages: 免费额度 500 构建/月，无限流量
- Render: 免费额度 750 小时/月，自动休眠（首次访问需 30-60 秒唤醒）
- Cloudinary: 免费额度 25 GB 存储 + 25 GB/月流量

**对于个人项目，完全够用且永久免费。**
