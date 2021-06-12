const fs = require("fs");
const exec = require("child_process").exec;

/**
 * This file's main objective is to watch Router files where our jsdocs comments are used to generate docs for the projects' APIs in swagger. Once the specified router file is changed and saved, the filesystem watches for this change and if true, runs an npm script to generate the yaml version of the swagger API docs
 */
const filename = process.argv[2];

if (!filename) {
  throw Error("Filename must have a path");
}

fs.watch(filename, () => {
  exec("npm run generate-docs", (error, stdout, stderr) => {
    if (error) {
      throw Error("Script didn't run");
    }
    console.log(`File- ${filename} changed!`);
  });
});

console.log(`Now watching ${filename} for changes`);
