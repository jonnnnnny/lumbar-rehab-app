FROM nginx:alpine

# 静态文件
COPY . /usr/share/nginx/html

# SPA 路由 + gzip 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
