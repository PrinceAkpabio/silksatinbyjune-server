const express = require("express");
const router = express.Router();
const {
  handleGetProductList,
  handleGetSingleProduct,
  handleAddProduct,
  handleAddProductCategory,
  handleGetProductCategories,
} = require("./products");

/**
 * @openapi
 * /product/add:
 *          post:
 *            tags:
 *            - Products
 *            summary: Add new product to a category.
 *            description: Add new product to a category.
 *            responses:
 *               200:
 *                 description: Successfully added new product to the category.
 *            requestBody:
 *                 content:
 *                     application/json:
 *                        schema:
 *                             type: object
 *                             required:
 *                             - name
 *                             properties:
 *                                name:
 *                                   type: string
 *                                category_id:
 *                                   type: integer
 *                                image:
 *                                   type: string
 *                                price:
 *                                   type: integer
 *                                size:
 *                                   type: integer
 *                                color:
 *                                   type: string
 *                                size_unit:
 *                                   type: string
 *                                description:
 *                                   type: string
 *                                status:
 *                                   type: integer
 *                                time_in:
 *                                   type: string
 *                                date_in:
 *                                   type: string
 *                                date_updated:
 *                                   type: string
 */

const urlParser = express.urlencoded();
router.post("/add", urlParser, (req, res, next) => {
  handleAddProduct(req, res, next);
});

/**
 * @openapi
 * /product/list:
 *            get:
 *             tags:
 *             - Products
 *             summary: Get all products in system
 *             parameters:
 *             - name: id
 *               in: query
 *               description: This is the product id of the category we are fetching from
 *                 a database. This is for multi-category use case.
 *               schema:
 *                 type: integer
 *             - name: category_id
 *               in: query
 *               description: This is the product name of the category we are fetching from
 *                 a database. This is for multi-category use case.
 *               schema:
 *                 type: string
 *             - name: select_all
 *               in: query
 *               description: This is returns all categories assigned to the database.
 *               schema:
 *                 type: integer
 *             responses:
 *                   200:
 *                     description: Successfully fetched all products from database
 *
 */
router.get("/list", (req, res, next) => {
  handleGetProductList(req, res, next);
});

/**
 * @openapi
 * /product/id:
 *        get:
 *          tags:
 *          - Products
 *          summary: Get single product from category.
 *          responses:
 *                200:
 *                  description: Successfully retrieved single product.
 *          parameters:
 *          - name: id
 *            in: query
 *            description: This is the product-id of the product we are fetching from a category. This is for multi-products use case.
 *            schema:
 *                type: integer
 */

router.get("/:id", (req, res, next) => {
  handleGetSingleProduct(req, res, next);
});

/**
 * Product Category routers
 */

/**
 * @openapi
 * /product/add-category:
 *          post:
 *            tags:
 *            - Products
 *            summary: Add new category for products.
 *            description: Add new category for products.
 *            responses:
 *               200:
 *                 description: Successfully added new category.
 *            requestBody:
 *                 content:
 *                     application/json:
 *                        schema:
 *                             type: object
 *                             required:
 *                             - name
 *                             properties:
 *                                name:
 *                                   type: string
 */
router.post("/add-category", urlParser, (req, res, next) => {
  handleAddProductCategory(req, res, next);
});

/**
 * @openapi
 * /product/category-list:
 *            get:
 *             tags:
 *             - Products
 *             summary: Get all categories in system
 *             parameters:
 *             - name: id
 *               in: query
 *               description: This is the category id of the category we are fetching from
 *                 a database. This is for multi-category use case.
 *               schema:
 *                 type: integer
 *             - name: select_all
 *               in: query
 *               description: This is returns all categories assigned to the database.
 *               schema:
 *                 type: integer
 *             responses:
 *                   200:
 *                     description: Successfully fetched all categories from database
 *
 */
router.get("/category-list", (req, res, next) => {
  handleGetProductCategories(req, res, next);
});

module.exports = router;
