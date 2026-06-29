# 🚀 最简单的云端部署方案（纯网页操作）

## 准备完毕
✅ 图片已上传 Cloudinary CDN  
✅ Worker 代码已准备（cloudflare-worker/worker.js）  
✅ 静态文件已打包（dist-static/）  
✅ Python 后端配置已就绪（DogTranslator/render.yaml）  

---

## 第一步：部署 AI 对话代理到 Cloudflare Workers（3 分钟）

1. **登录 Cloudflare**  
   访问 https://dash.cloudflare.com/ 并登录

2. **创建 Worker**  
   - 左侧菜单点击 **"Workers & Pages"**
   - 点击右上角 **"Create"** → **"Create Worker"**
   - 名字改为 `joy-pet-chat-proxy`
   - 点击 **"Deploy"**

3. **替换代码**  
   - 部署完成后，点击 **"Edit Code"**
   - 删除默认代码，粘贴以下内容：

```javascript
const BASE_URL = 'https://modelservice.jdcloud.com/anthropic';
const AUTH_TOKEN = 'pk-0f965c3e-2133-4976-9a77-9910de9f20f0';
const MODEL = 'Claude-Sonnet-4.6';

export default {
  async fetch(request) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const url = new URL(request.url);
    if (request.method !== 'POST' || url.pathname !== '/chat') {
      return new Response('Not Found', { status: 404, headers: corsHeaders });
    }

    try {
      const { messages, system } = await request.json();

      const apiRes = await fetch(`${BASE_URL}/v1/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AUTH_TOKEN}`,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 2048,
          system,
          messages,
        }),
      });

      const data = await apiRes.json();
      return new Response(JSON.stringify(data), {
        status: apiRes.ok ? 200 : apiRes.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: { message: 'Proxy error: ' + e.message } }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },
};
```

4. **保存并部署**  
   - 点击右上角 **"Save and Deploy"**
   - 记下 Worker URL：`https://joy-pet-chat-proxy.你的子域名.workers.dev`

**✅ 把这个 URL 发给我**

---

## 第二步：部署 Python 后端到 Render（5 分钟）

### 先推送代码到 GitHub

打开终端执行：

```bash
cd "/Users/zhangyiduo.amber/Desktop/PET agent"

# 初始化 git（如果还没有）
git init
git add .
git commit -m "cloud deployment ready"

# 推送到 GitHub（替换成你的仓库地址）
git branch -M main
git remote add origin https://github.com/alidor4702/joy-pet.git
git push -u origin main
```

### 在 Render 部署

1. **登录 Render**  
   访问 https://dashboard.render.com/register  
   用 GitHub 账号登录

2. **新建 Web Service**  
   - 点击 **"New"** → **"Web Service"**
   - 点击 **"Build and deploy from a Git repository"** → **"Next"**
   - 选择 `joy-pet` 仓库（如果没有，点 "Configure account" 授权 GitHub）

3. **配置服务**  
   - Name: `dog-translator`
   - Region: `Oregon (US West)`
   - Root Directory: `DogTranslator`
   - Runtime: `Python 3`
   - Build Command:  
     ```
     pip install flask flask-cors requests python-dotenv torch torchaudio transformers --index-url https://download.pytorch.org/whl/cpu
     ```
   - Start Command:  
     ```
     python server.py
     ```
   - Instance Type: `Free`

4. **添加环境变量**  
   展开 **"Advanced"**，添加：
   - `CEREBRAS_API_KEY` = `csk-kdvcchcmrf9546ev8e4nknrmyckd9nvjndw82d5nkxdn8y4d`
   - `GRADIUM_API_KEY` = `gsk_727385b3813538b0540c99a592cbaeff6020f6a31600087bff075b7223e1d6ba`

5. **部署**  
   - 点击 **"Create Web Service"**
   - 等待约 5-10 分钟（首次部署需下载 PyTorch）
   - 部署成功后，记下 URL：`https://dog-translator-xxx.onrender.com`

**✅ 把这个 URL 也发给我**

---

## 第三步：更新前端 API 地址并部署（2 分钟）

**我拿到两个 URL 后会自动帮你替换代码，然后告诉你最后一步怎么上传静态文件。**

---

## 最后一步：部署静态文件到 Cloudflare Pages（1 分钟）

1. **访问 Cloudflare Pages**  
   https://dash.cloudflare.com/ → **"Workers & Pages"** → **"Create"** → **"Pages"** → **"Upload assets"**

2. **上传文件**  
   - Project name: `joy-pet`
   - 拖入整个 `dist-static` 文件夹（包含 index.html 和 assets/）
   - 点击 **"Deploy site"**

3. **获取前端 URL**  
   部署完成后显示：`https://joy-pet-xxx.pages.dev`

---

## 验收

打开前端 URL，在任意设备测试：
- ✅ 完成宠物测试，奖杯图片正常显示
- ✅ AI 对话功能正常
- ✅ 狗语翻译功能正常

**全部完成后，无需本地环境，任意设备均可使用 ✅**
