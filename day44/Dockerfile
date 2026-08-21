# 使用 Node.js 22 + Alpine Linux 當基礎 image
FROM node:22-alpine

# 設定 Docker 裡的工作目錄
WORKDIR /app

# 安裝 serve，用來提供前端 build 後的靜態檔案
RUN npm install -g serve

# 先複製 package.json 和 package-lock.json
COPY package*.json ./

# 安裝專案依賴
RUN npm install

# 複製剩下的專案檔案
COPY . .

# 建立前端 production 版本，產生 dist/
RUN npm run build

# Container 啟動時，用 serve 提供 dist，監聽 8080 port
CMD ["serve", "-s", "dist", "-l", "8080"]