const express = require("express");
const router = express.Router();
const {
  handleGetProductList,
  handleGetSingleProduct,
  handleAddProduct,
  handleDeleteProduct,
  handleAddProductCategory,
  handleDeleteCategory,
  handleGetProductCategories,
  handleUpdateProduct,
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
 *             - name: count
 *               in: query
 *               description: This returns the number of products you set in the count field
 *               schema:
 *                 type: integer
 *             - name: last_item_id
 *               in: query
 *               description: Returns an array of data with less than the last row id passed. If not passed, it defaults to zero
 *               schema:
 *                  type: integer
 *             - name: select_all
 *               in: query
 *               description: This is returns all products assigned to the database.
 *               schema:
 *                 type: integer
 *             responses:
 *                   200:
 *                     description: Successfully fetched all products from database
 *                   400:
 *                     description: Could not fetch products from db, check your parameter values
 */
router.get("/list", (req, res, next) => {
  handleGetProductList(req, res, next);
});

/**
 * @openapi
 * /product/item/id:
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

router.get("/item/:id", (req, res, next) => {
  handleGetSingleProduct(req, res, next);
});

/**
 * @openapi
 * /product/delete/id:
 *        post:
 *            tags:
 *            - Products
 *            summary: Delete a product from the product list.
 *            description: Delete a product from the product list.
 *            responses:
 *                    200:
 *                      description: Successfully delete product.
 *            requestBody:
 *                 content:
 *                   application/json:
 *                        schema:
 *                             type: object
 *                             properties:
 *                                    id:
 *                                     type: integer
 */
router.post("/delete/:id", urlParser, (req, res, next) => {
  handleDeleteProduct(req, res, next);
});

/**
 * @openapi
 * /product/update:
 *                post:
 *                  tags:
 *                  - Products
 *                  summary: Update product in the product list.
 *                  description: Update product in the product list.
 *                  responses:
 *                        200:
 *                          description: Successfully updated product.
 *                  requestBody:
 *                      content:
 *                          application/json:
 *                                schema:
 *                                    type: object
 *                                    properties:
 *                                            id:
 *                                               type: integer
 *                                            name:
 *                                               type: string
 *                                            category_id:
 *                                               type: integer
 *                                            image:
 *                                               type: string
 *                                            price:
 *                                               type: integer
 *                                            size:
 *                                               type: integer
 *                                            color:
 *                                               type: string
 *                                            size_unit:
 *                                               type: string
 *                                            description:
 *                                               type: string
 */
router.post("/update", urlParser, (req, res, next) => {
  handleUpdateProduct(req, res, next);
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
 * /product/delete-category:
 *              post:
 *                tags:
 *                - Products
 *                summary: Delete a single category from category list.
 *                description: Delete a single category from category list.
 *                responses:
 *                       200:
 *                         description: Successfully deleted category.
 *                requestBody:
 *                    content:
 *                        application/json:
 *                                schema:
 *                                    type: object
 *                                    properties:
 *                                        id:
 *                                          type: integer
 */
router.post("/delete-category", (req, res, next) => {
  handleDeleteCategory(req, res, next);
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
 *             - name: count
 *               in: query
 *               description: Fetch categories by a defined limit or count
 *               schema:
 *                 type: integer
 *             - name: last_item_id
 *               in: query
 *               description: Returns an array of data with less than the last row id passed. If not passed,it defaults to zero
 *               schema:
 *                  type: integer
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
