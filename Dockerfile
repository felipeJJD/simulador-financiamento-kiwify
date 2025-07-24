# This file is ignored by .dockerignore to force Nixpacks usage
# Railway should use nixpacks.toml instead
FROM node:20-alpine
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]