![MediaKron Banner](mkbanner.png)
# Mediakron V4

This repository contains the code as well as the build and deployment tooling to support both local builds and deployment to the EY environment for properly credentialed users.

You can start development immediately by booting the application locally with Docker.

General information about MediaKron: [http://mediakron.bu.edu](http://mediakron.bu.edu)

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
* To install the documentation site (Catalog), go to the docs directory and run "npm install catalog". Then, to start run "npm run catalog-start"

## How to build
* **Development**: `npm run mediakron:build`
* **Watch and Build**: `npm run mediakron:watch`
* **Production** `npm run mediakron:build:prod`

## PHP MyAdmin 
You can access phpmyadmin at `http://localhost:8080`


## Provisioning
Provisioning is done by ansible.  You must have python 2.7 or greater and ansible 2.4 installed, and having installed the libraries from ansible galaxy.  To install the requirements, run `ansible-galaxy install -r provisioning\requirements.yml`

You can provision a server by running the playbooks on particular hosts or host groups.  Set provision.yml to point at the host group you want to provision and then run `ansible-playbook provisioning/provision.yml`

To add new hosts, add them to provisoning/hosts.yml

Changes to roles should be done in the provisioning/vars folder.  New roles can be added in provisioning/roles, though you should check to see if a good role exists in the galaxy before building one from scratch.  geerlingguy is especially good at building roles.

## Deployment
To deploy code to api, install Deployer.php and run `dep deploy {stage}` 
where stage is dev, staging or prod

To deploy frontend app, `run npm mediakron:deploy:{stage}` w

---
Copyright Trustees of Boston University [GNU General Public License v3.0](https://choosealicense.com/licenses/gpl-3.0/)
