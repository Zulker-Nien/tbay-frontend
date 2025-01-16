# Use the official Node.js image
FROM node:alpine

# Set the working directory inside the container
WORKDIR /app/src

# Copy the package.json and yarn.lock
COPY package.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the entire project
COPY . .

# Build the app for production
RUN yarn build

# Expose the port that the app will run on
EXPOSE 5173

CMD ["yarn", "dev", "--host", "0.0.0.0"]