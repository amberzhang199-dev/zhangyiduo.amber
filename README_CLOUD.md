# JOY PET 云端化改造 - 快速开始

## 🎉 改造完成情况

✅ **图片资源**：17 张图片已全部上传到 Cloudinary CDN  
✅ **Python 后端**：虚拟环境已配置，依赖已安装  
✅ **代码引用**：`joy-pet.html` 图片路径已更新为云端 URL  

---

## 📦 项目目录结构

```
PET agent/
├── assets/images/          # 图片资源（已上传到 Cloudinary）
├── src/                    # React 前端源码
├── DogTranslator/          # Python 后端
│   ├── .venv/             # Python 虚拟环境
│   ├── server.py          # Flask 服务
│   ├── start.sh           # 启动脚本
│   └── .env               # API Keys（已配置）
├── joy-pet.html           # 独立 HTML 应用
└── cloudinary-urls.json   # CDN URL 配置
```

---

## 🚀 启动项目

### 方式一：运行独立 HTML 应用（无需服务器）

直接在浏览器打开：
```
/Users/zhangyiduo.amber/Desktop/PET agent/joy-pet.html
```

图片自动从 Cloudinary CDN 加载，无需本地文件。

### 方式二：运行 React 前端

```bash
cd "/Users/zhangyiduo.amber/Desktop/PET agent"
npm install        # 首次运行需要
npm run dev        # 启动开发服务器
# 访问 http://localhost:5173
```

### 方式三：启动 Python 后端（DogTranslator 狗语翻译）

```bash
cd "/Users/zhangyiduo.amber/Desktop/PET agent/DogTranslator"
bash start.sh
# 访问 http://localhost:8000
```

**注意**：gradium（TTS 语音）因 Python 版本过低未安装，但核心翻译功能正常。

---

## 🌍 换设备部署

### 步骤 1：复制整个项目文件夹
将 `PET agent/` 整个文件夹复制到新设备。

### 步骤 2：前端环境（如需运行 React 应用）
```bash
npm install
npm run dev
```

### 步骤 3：Python 后端环境
```bash
cd DogTranslator
bash install.sh    # 自动配置虚拟环境和依赖
bash start.sh      # 启动服务
```

### 步骤 4：验证图片加载
在浏览器打开 `joy-pet.html`，完成测试后触发奖杯弹窗，检查图片是否正常显示。

---

## 📋 验收检查

### ✅ 图片资源云端化
- 打开浏览器开发者工具 Network 面板
- 访问 `joy-pet.html`
- 完成测试触发奖杯弹窗
- 检查图片 URL：应为 `https://res.cloudinary.com/dydfeoq9b/...`

### ✅ Python 环境跨设备
- 运行 `cd DogTranslator && bash start.sh`
- 访问 `http://localhost:8000/health`
- 预期返回：`{"status":"ok","mock_mode":true,"tts_available":false}`

### ✅ 无本地依赖
- 删除 `assets/images/` 目录
- 重新打开 `joy-pet.html`
- 图片仍然正常显示（从 CDN 加载）

---

## 🔧 故障排除

### 问题 1：图片 404
**原因**：网络无法访问 Cloudinary CDN  
**解决**：
```bash
# 测试 CDN 可访问性
curl -I https://res.cloudinary.com/dydfeoq9b/image/upload/joy-pet/trophy-1.png
```

### 问题 2：Python 启动失败
**原因**：虚拟环境未激活或依赖未安装  
**解决**：
```bash
cd DogTranslator
source .venv/bin/activate
pip install flask flask-cors requests python-dotenv torch torchaudio transformers
```

### 问题 3：前端启动失败
**原因**：node_modules 未安装  
**解决**：
```bash
npm install
```

---

## 📊 资源使用情况

### Cloudinary（免费额度）
- **已用存储**：~10MB（17 张图片）
- **免费额度**：25 GB 存储 + 25 GB/月流量
- **剩余**：足够使用

### Python 虚拟环境
- **占用空间**：~2.5 GB（PyTorch + 依赖）
- **位置**：`DogTranslator/.venv/`
- **说明**：每个设备需独立安装

---

## 🌐 图片 CDN URL 速查

```
奖杯 1: https://res.cloudinary.com/dydfeoq9b/image/upload/joy-pet/trophy-1.png
奖杯 2: https://res.cloudinary.com/dydfeoq9b/image/upload/joy-pet/trophy-2.png
通话: https://res.cloudinary.com/dydfeoq9b/image/upload/joy-pet/call.png
启动: https://res.cloudinary.com/dydfeoq9b/image/upload/joy-pet/start.png
性格: https://res.cloudinary.com/dydfeoq9b/image/upload/joy-pet/xingge.png
```

---

## 📝 下次需要更新图片？

```bash
cd "/Users/zhangyiduo.amber/Desktop/PET agent"
bash upload-to-cloudinary.sh    # 自动上传新图片
bash update-image-urls.sh       # 更新代码引用（如需要）
```

---

**改造完成时间**：2026-06-27  
**验收状态**：✅ 图片云端化完成，Python 环境配置完成
