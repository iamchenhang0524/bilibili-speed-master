# 倍数大师 - 视频倍速助手

Chrome 浏览器扩展：按住键盘 **1/2/3** 键，临时切换视频播放倍速。松开后自动恢复原速。

## 🎮 快捷键

| 按键 | 倍速 |
|------|------|
| 按住 **`1`** | **1.5x** |
| 按住 **`2`** | **2.0x** |
| 按住 **`3`** | **3.0x** |

- 按下即切换，松开即恢复
- 页面中上方显示当前倍速提示
- 支持多键叠加（按住 1 再按 2 → 切到 2.0x，松开回到 1.5x）
- 在输入框中打字时不触发

## 🌐 支持平台（34 个）

### 国内平台
Bilibili · 腾讯视频 · 爱奇艺 · 优酷 · 抖音 · 快手 · 小红书 · 芒果TV · 搜狐视频 · 西瓜视频 · 央视网 · PPTV · 咪咕视频

### 国际平台
YouTube · Netflix · Vimeo · Dailymotion · Twitch · Disney+ · Amazon Prime Video · Max / HBO Max · Hulu · TED · Peacock · Paramount+ · Plex · Crunchyroll · Udemy · Coursera

## 📦 安装

1. 克隆或下载本项目
2. 打开 Chrome，访问 `chrome://extensions/`
3. 开启右上角 **"开发者模式"**
4. 点击 **"加载已解压的扩展程序"**
5. 选择项目文件夹
6. 完成！打开任意支持的视频网站即可使用

## 🛠 项目结构

```
├── manifest.json    # 扩展配置 (Manifest V3)
├── content.js       # 核心逻辑
├── icons/           # 扩展图标
└── README.md
```

## 📄 License

MIT
