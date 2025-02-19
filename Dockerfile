FROM node:20.11.1-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn install
RUN yarn global add typescript
RUN yarn global add nodemon
COPY . .
EXPOSE 3010
CMD ["yarn", "run", "start"]