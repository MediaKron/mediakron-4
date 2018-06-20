/**
 * This uses docker to build the mediakron dependencies.
 * 
 * TODO: Improve the output to catch and handle errors and explain what's going on
 */

const spawn = require("child-process-promise").spawn;
var composer = spawn(
  "docker",
  [
    "run",
    "--rm",
    "--interactive",
    "--volume $PWD/api:/app",
    "--volume $PWD/docker/composer:/tmp",
    "composer",
    "install  --ignore-platform-reqs --no-scripts"
  ],
  { shell: true }
);
