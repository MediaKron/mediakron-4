![MediaKron Banner](mkbanner.png)
# Mediakron V4

This repository contains the code as well as the build and deployment tooling to support both local builds and deployment to the EY environment for properly credentialed users.

You can start development immediately by booting the application locally with Docker.

General information about MediaKron: [http://mediakron.bc.edu](http://mediakron.bc.edu)

## Structure
* **api**: Contains the root Larvel application for boot and api methods
* **docker**: Contains the root Larvel application for boot and api methods
* **public**: The public web root with any servable files and the main executable
* **app**: Buildable code for the front-facing MediaKron JS application
* **docs**: MediaKron technical documentation

## Local Build Requirements
* [Docker](https://docs.docker.com/install/) 17.12+ 
* [Docker Compose](https://docs.docker.com/compose/) 1.18+
* [Node](https://nodejs.org) 6+
* [NPM](https://www.npmjs.com/)

## Installation
* Run `npm install` from the root directory to get all the npm modules you'll need
* Run `npm run mediakron:install` to build the application dependencies
* Copy the .env.example file to .env and customize as needed
* To start the local dev environment run `docker-compose up`
* Go to your mediakron site at `localhost:81`

## How to build
* **Development**: `npm run mediakron:build`
* **Watch and Build**: `npm run mediakron:watch`
* **Production** `npm run mediakron:build:prod`

## PHP MyAdmin 
You can access phpmyadmin at `http://localhost:8080`
