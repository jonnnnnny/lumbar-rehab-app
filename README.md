# 腰椎康复训练 Web 应用

纯静态 Web 应用（HTML + CSS + 原生 JavaScript，无构建步骤、无外部依赖），用于腰椎间盘突出与腰肌劳损的康复训练：训练计划生成、动作库、跟练模式、训练记录。

## 功能

- **计划**：选择周次（1–12）、健身房频率（每周 2/3 次）、康复路径（腰突伴腿症状 / 局部腰痛），生成 7 天排期，点击任意一天进入跟练
- **动作库**：20 个康复动作，支持搜索与居家/健身房筛选，含动作要领、常见错误、停止信号
- **跟练**：按课程逐项引导，次数计数器 / 保持倒计时 / 组间休息 30 秒，完成后红绿灯自评并保存
- **记录**：训练记录保存在浏览器 localStorage，按周统计红绿灯，可删除

## 本地直接使用

无需服务器，直接用浏览器打开 `index.html` 即可（`file://` 协议下 localStorage 可用，数据已内联在 `js/data.js` 中）。

## Docker 部署

```bash
# 构建并启动（访问 http://NAS_IP:8080）
docker compose up -d --build

# 查看状态
docker compose ps

# 停止
docker compose down
```

镜像基于 `nginx:alpine`，单页应用路由已配置 fallback，gzip 已开启。

## 群晖 DSM 部署（Container Manager）

1. 将本项目文件夹上传到 NAS，例如 `/docker/lumbar-rehab-app`
2. 打开 **Container Manager** → **项目** → **新增**
3. 项目名称填 `lumbar-rehab`，路径选择上传的文件夹，来源选择"创建 docker-compose.yml"，将本项目的 `docker-compose.yml` 内容粘贴进去
4. 下一步 → 完成，等待镜像构建并启动
5. 浏览器访问 `http://NAS_IP:8080` 即可使用

## 威联通 QTS 部署（Container Station）

1. 将本项目文件夹上传到 NAS，例如 `/share/Container/lumbar-rehab-app`
2. 打开 **Container Station** → **创建** → **从 Docker Compose 创建**
3. 应用名称填 `lumbar-rehab`，将本项目的 `docker-compose.yml` 内容粘贴进去
4. 验证无误后点击**创建**，等待构建完成
5. 浏览器访问 `http://NAS_IP:8080` 即可使用

> 内网使用说明：本应用无任何外部 CDN 依赖，全部原生实现，NAS 无外网也可正常运行。训练记录保存在使用设备的浏览器中，更换设备/浏览器记录不互通。

## 项目结构

```
lumbar-rehab-app/
├── index.html          # SPA 入口
├── css/style.css       # 移动端优先样式
├── js/
│   ├── data.js         # 动作库（20个）+ 课程 + 12周计划模板
│   ├── app.js          # 主入口、Tab 路由
│   ├── plan.js         # 计划生成逻辑
│   ├── player.js       # 跟练模式
│   ├── log.js          # localStorage 训练记录
│   └── library.js      # 动作库页面
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
└── README.md
```

## 免责声明

本应用为康复训练辅助工具，不构成医疗建议。开始训练前请咨询医生或物理治疗师；训练中出现大小便失禁、鞍区麻木、下肢进行性无力等情况请立即就医并停止训练。
