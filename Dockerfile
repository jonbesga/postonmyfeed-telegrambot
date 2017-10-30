FROM node:7.7.2-alpine
WORKDIR /code
COPY . /code
RUN npm install --quiet