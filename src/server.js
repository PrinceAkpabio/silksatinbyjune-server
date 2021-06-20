const express = require("express");
require("custom-env").env("dev");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const productRouter = require("../api/v1/products/productRouter");
const { options } = require("../api/v1/docs/swagger-ui-options");
const { generalUtil } = require("../util/generalUtils");
const { statusManager } = generalUtil();
/**
 * Initialise application with express
 */

const app = express();
const PORT = process.env.PORT || 4000;
// const PORTS = process.env.PORT;

/**
 * Set up middleware
 */

app.use(express.json());

app.use((err, req, res, next) => {
  // This check makes sure this is a JSON parsing issue, but it might be
  // coming from any middleware, not just body-parser:

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    // console.error(err);
    return statusManager(res, 400, "Invalid JSON, review your JSON object"); // Bad request
  }

  next();
});

/**
 * Fire Routers
 */
try {
  app.use("/product", productRouter);
} catch (err) {
  console.log("error log: ", err);
  statusManager(res, 400, `Request could not be made for Product: ${err}`);
}

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
