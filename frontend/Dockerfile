# frontend/Dockerfile
FROM node:16-alpine

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . .

RUN npm run build

# Use a simple HTTP server to serve the static build
RUN npm install -g serve

EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]