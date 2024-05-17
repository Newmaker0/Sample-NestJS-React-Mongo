FROM node:20-alpine

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 3003

# Command to run the application
CMD ["npm", "run", "start"]
