# Use an official Node runtime as a parent image
FROM node:21

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install any needed packages
RUN npm install
RUN npm install -g nodemon

# Bundle your app's source code inside the Docker image
COPY . .

# Make port 6699 available to the world outside this container
EXPOSE 6699

# Define the command to run your app
CMD [ "nodemon", "src/server.ts" ]