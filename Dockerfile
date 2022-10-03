FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install && npm install typescript -g

RUN mkdir data

COPY . ./
RUN tsc 
ENV PORT 8080

EXPOSE ${PORT}

CMD ["npm","start"]