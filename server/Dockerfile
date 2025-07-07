FROM node:20

WORKDIR /app

COPY package*.json ./

# Fix for sharp
RUN npm install --include=optional

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
