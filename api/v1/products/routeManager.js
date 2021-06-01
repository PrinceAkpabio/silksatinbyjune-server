const express = require("express");
const router = express.Router();

const { handleGetProductList, handleGetSingleProduct } = require("./products");
/**
 * @openapi
 * /:
 *   get:
 *     description: Welcome to swagger-jsdoc!
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
router.get("/list", (req, res, next) => {
  console.log("Get all products");
  handleGetProductList(req, res, next);
});

/**
 * Retrive single product
 */

router.get("/:id", (req, res, next) => {
  console.log("Get single product");
  handleGetSingleProduct(req, res, next);
});

module.exports = router;
