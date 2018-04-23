![MediaKron Banner](mkbanner.png)
# Mediakron V4

About MediaKron: http://mediakron.bc.edu

This repository contains the code as well as the build and deployment tooling to support both local builds and deployment to the EY environment
for properly credentialed users.

You can start development immediately by booting the application locally with Docker.

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

## Structure
* **api**: Contains the root larvel application for boot and api methods
* **docker**: Contains the root larvel application for boot and api methods
* **public**: The public web root with any servable files and the main executable
* **src**: This will contain all of the buildable code for the mediakron js application

## PHP MyAdmin 
You can access phpmyadmin at `http://localhost:8080`
