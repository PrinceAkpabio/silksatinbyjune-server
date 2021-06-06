const swaggerJsdoc = require("swagger-jsdoc");

/**
 * Options serve as main json object that will be imported in the main server.js and passed to the swagger jsdoc function as an argument
 */
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "silksatinbyjune-server",
      version: "0.1.0",
      description:
        "E-commerce web application for nightware apparell brand and documented with Swagger",
      license: {
        name: "ISC",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Prince Akpabio",
        url: "https://apabioprince.netlify.app",
        email: "princeakpabio90@gmail.com",
      },
    },
    servers: [
      {
        url: "https://silksatinbyjune-server-api-dev.herokuapp.com/",
      },
      {
        url: "http://localhost:4000/",
      },
    ],
  },
  apis: ["./api/v1/products/productRouter.js"],
};

/**
 * This block fetches all jsdoc comments with the @openapi tag, groups them, then converts it to json and adds the grouped json to the options object above and returns a complete json object.
 *
 * It is also exported for use in the main api docs file that is used in the online version of swagger. It will however first be converted to YAML.
 */
const openapiSpecification = swaggerJsdoc(options);

module.exports = {
  options,
  openapiSpecification,
};
