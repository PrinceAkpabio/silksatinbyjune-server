const fs = require("fs");
const YAML = require("json-to-pretty-yaml");
const { openapiSpecification } = require("./swagger-ui-options");

/**
 * Converts api json file to yaml format and creates/updates an api-docs file in the api/docs folder for easy updating for the online swagger docs
 * @param  {path} path
 * @param  {data} data
 */
const handleWriteAndUpdateApiDocsFile = (path, data) => {
  try {
    const convertJsonFileToYaml = YAML.stringify(data);

    fs.writeFile(path, convertJsonFileToYaml, (err) => {
      console.log("API write error: ", err);
    });
  } catch (err) {
    console.log("API catch error: ", err);
  }
};

/**
 * call function to write new api docs in yaml format.
 * Script to run file: npm run generate-docs
 */
handleWriteAndUpdateApiDocsFile(
  "./api/v1/docs/api-docs.yaml",
  openapiSpecification
);
