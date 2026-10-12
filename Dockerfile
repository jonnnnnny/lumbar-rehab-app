FROM nginx:alpine

# 静态文件
COPY . /usr/share/nginx/html

# 下载动作演示 GIF（构建时需要联网；运行时离线可用）
RUN apk add --no-cache wget && \
    sh /usr/share/nginx/html/tools/download-anim.sh && \
    apk del wget

# SPA 路由 + gzip 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
