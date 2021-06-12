const fs = require("fs");
const YAML = require("json-to-pretty-yaml");
const { openapiSpecification } = require("./swagger-ui-options");

/**
 * Converts api json file to yaml format and creates/updates an api-docs file in the api/docs folder for easy updating for the online swagger docs
 * @param  {path} path
 * @param  {data} data
 */
const handleWriteAndUpdateApiDocsFile = (path, data, fileWatched) => {
  try {
    const convertJsonFileToYaml = YAML.stringify(data);

    fs.writeFile(path, convertJsonFileToYaml, (err) => {
      err === null
        ? console.log(`File-- ${fileWatched} changed!`)
        : console.log("API write error: ", err);
    });
  } catch (err) {
    console.log("API catch error: ", err);
  }
};

/**
 * call function to write new api docs in yaml format.
 * Script to run file: npm run generate-docs is being automatically ran with a watcher file when a router file changes
 */
const filename = process.argv[2];

handleWriteAndUpdateApiDocsFile(
  "./api/v1/docs/api-docs.yaml",
  openapiSpecification,
  filename
);
