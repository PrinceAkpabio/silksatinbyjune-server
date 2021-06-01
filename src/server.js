const express = require("express");
const routeManager = require("../api/v1/products/routeManager");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const { options } = require("../api/v1/docs/swagger-ui-options");

/**
 * Initialise application with express
 */

const app = express();
const PORT = process.env.PORT || 4000;

/**
 * Set up middleware
 */

app.use(express.json());

/**
 * Fire Routers
 */

app.use("/product", routeManager);

/**
 *  Setup swagger Ui with optional properties if needed and swagger-jsdocs for easier conversion for jsdoc comments from api files to a json
 */
const swaggerOptions = {
  explorer: true,
};

const openApiSpecs = swaggerJsdoc(options);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(openApiSpecs, swaggerOptions)
);

/**
 * Listen to app server
 */

app.listen(PORT, () => {
  console.log("Slik satin's server started: ", PORT);
});
