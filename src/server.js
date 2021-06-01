const express = require("express");
const routeManager = require("../process/routeManager");
const swaggerUi = require("swagger-ui-express");
const swaggerJson = require("./swagger.json");
const { options } = require("../process/swagger-ui");

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
 *  Setup swagger Ui
 */
const swaggerOptions = {
  explorer: true,
};

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerJson, swaggerOptions)
);

/**
 * Listen to app server
 */

app.listen(PORT, () => {
  console.log("Slik satin's server started: ", PORT);
});
