

## **題目**

> 你要把一支後端 API 容器化。這支 API 的進入點是 `server.js`，會讀 `PORT` 和 `GYM_NAME` 兩個環境變數，並提供 `GET /healthcheck` 回傳服務狀態。請依序回答下面的問題。

**1. 讀懂這份 Dockerfile**

    FROM node:22-alpine
    WORKDIR /app
    COPY . .
    RUN npm install --omit=dev
    EXPOSE 3000
    CMD ["node", "server.js"]

請逐行說明每個指令做了什麼，並指出其中一個會讓每次 build 都變慢的問題，附上修正後的版本。

### 答案

- `FROM node:22-alpine`：使用 Node.js 22 的 Alpine Image 當作基底。
- `WORKDIR /app`：設定容器裡的工作目錄為 `/app`，後面的指令會以這裡為基準。
- `COPY . .`：把目前 build context 裡的檔案複製到容器的 `/app`。
- `RUN npm install --omit=dev`：在建置 Image 時安裝套件，`--omit=dev` 代表不安裝 `devDependencies`。
- `EXPOSE 3000`：宣告容器內的服務使用 3000 Port，但不會真的把 Port 對外開放。
- `CMD ["node", "server.js"]`：容器啟動時執行 `node server.js`。

問題在於：

    COPY . .
    RUN npm install --omit=dev

`COPY . .` 會把整個專案複製進 Image，只要程式碼有修改，這一層就會變動，後面的 `npm install` 快取也可能失效，導致每次 build 都重新安裝套件。

可以改成先複製套件相關檔案：

    FROM node:22-alpine
    WORKDIR /app
    COPY package*.json ./
    RUN npm install --omit=dev
    COPY . .
    EXPOSE 3000
    CMD ["node", "server.js"]

這樣平常只修改 `server.js` 或其他程式碼時，`npm install` 那一層可以直接使用快取，不需要重新安裝套件。

---

**2. 建置並啟動**

請寫出兩行指令：

- 用第 1 題修正後的 Dockerfile 建一個叫 `livefit-api`、標籤為 `1.0` 的 Image
- 從這個 Image 啟動容器，要求：在背景執行、容器名稱為 `livefit`、主機的 8080 對應到容器的 3000、並帶入環境變數 `PORT=3000` 與 `GYM_NAME=FitClub`

### 答案

    docker build -t livefit-api:1.0 .

    docker run -d --name livefit -p 8080:3000 -e PORT=3000 -e GYM_NAME=FitClub livefit-api:1.0

第一行會依照 Dockerfile 建立 `livefit-api:1.0` 這個 Image。

第二行則是從這個 Image 建立並啟動 `livefit` 容器：

- `-d`：讓容器在背景執行
- `--name livefit`：指定容器名稱
- `-p 8080:3000`：主機 8080 對應到容器 3000
- `-e PORT=3000`：設定 `PORT`
- `-e GYM_NAME=FitClub`：設定 `GYM_NAME`

---

**3. 容器有起來，但連不上**

容器啟動後，你在主機上執行 `curl http://localhost:8080/healthcheck`，得到的是：

    curl: (52) Empty reply from server

於是你查了兩個指令（`docker ps` 的輸出為了版面省略 `COMMAND` 與 `CREATED` 兩欄）：

    $ docker ps
    CONTAINER ID   IMAGE              STATUS         PORTS                      NAMES
    e5aa9bcbab1a   livefit-api:1.0    Up 2 minutes   0.0.0.0:8080->3000/tcp     livefit

    $ docker logs livefit
    Server listening on 127.0.0.1:3000

容器是活的，Port 對應看起來也正確。請說明為什麼連不到，以及該怎麼修。

### 答案

問題在 `docker logs` 顯示的：

    Server listening on 127.0.0.1:3000

`127.0.0.1` 代表的是「容器自己」。

所以雖然 Docker 已經設定：

    主機 8080 → 容器 3000

但 Node.js 只接受容器自己發出的連線，從容器外部進來的請求不會被接收。

因此要讓 Server 監聽 `0.0.0.0`：

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server listening on 0.0.0.0:${PORT}`);
    });

`0.0.0.0` 可以理解成接受所有網路介面的連線。

修好後，連線流程就是：

    localhost:8080
        ↓
    Docker Port 對應
        ↓
    容器的 3000
        ↓
    Node.js 監聽 0.0.0.0:3000
        ↓
    /healthcheck

所以再執行：

    curl http://localhost:8080/healthcheck

就可以正常收到 API 回應。

