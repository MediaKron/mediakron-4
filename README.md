![MediaKron Banner](mkbanner.png)
# Mediakron V4

This repository contains the code as well as the build and deployment tooling to support both local builds and deployment to the EY environment
for properly credentialed users.

You can start development immediately by booting the applicaiton locally with docker.

### Local Build Requirements ###

* Docker 17.12+ 
* Docker Compose 1.18+
* PHP Composer
* Node 6+
* NPM

## Development
Run `npm install` from the root directory to get all the npm modules you'll need
cd into the api directory and run `composer install` to build the api dependencies
To start the local dev environment run `docker-compose up`
To Build JS and Css `npm run dev`
To watch and build on changes run `npm run watch`


## Structure
* api
  * Contains the root larvel application for boot and api methods
* docker
  * Contains the root larvel application for boot and api methods
* public
  * The public web root with any servable files and the main executable
* src
  * This will contain all of the buildable code for the mediakron js application

### PHP MyAdmin 
You can access phpmyadmin at `http://localhost:8080`
