# ---------------------------------------
# Build Stage
# ---------------------------------------
FROM node:20-slim AS builder

# ネットワークやキャッシュの最適化
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_FUND=false
ENV NPM_CONFIG_AUDIT=false

WORKDIR /app

ARG VITE_MICROCMS_SERVICE_DOMAIN
ARG VITE_MICROCMS_API_KEY
ENV VITE_MICROCMS_SERVICE_DOMAIN=$VITE_MICROCMS_SERVICE_DOMAIN
ENV VITE_MICROCMS_API_KEY=$VITE_MICROCMS_API_KEY

COPY package.json package-lock.json* ./

# 【重要】--legacy-peer-deps で警告による計算ループを強制終了させます
# また --no-cache を付けてビルド時の肥大化を防ぎます
RUN npm install --legacy-peer-deps --no-package-lock

COPY . .
RUN npm run build

# ---------------------------------------
# Production Stage
# ---------------------------------------
FROM node:20-slim
WORKDIR /app

COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./package.json

ENV NODE_ENV=production
ENV PORT=3000

# 実行用の最小限のインストール
RUN npm install --omit=dev --legacy-peer-deps --no-package-lock

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
