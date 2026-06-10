FROM node:20-alpine

WORKDIR /app
RUN apk add --no-cache libreoffice font-noto-cjk
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5001
CMD ["npm", "start"]
