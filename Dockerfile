FROM node:20-alpine
WORKDIR /app
COPY package.json tsconfig.json ./
RUN npm i
COPY src ./src
EXPOSE 8787
CMD ["npm","run","dev"]
