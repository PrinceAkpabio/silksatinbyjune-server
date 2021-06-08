const connection = require("../../../config/db.config");
const { statusManager } = require("../../../util/statusManager");

/**
 * Add product to products table using insert method for mysql and the following fields name, category_id, image, price, size, color, size_unit, description and status
 * @param {req} req
 * @param {res} res
 */
const handleAddProduct = (req, res) => {
  connection.query(
    "INSERT INTO `products`(`name`,`category_id`,`image`,`price`,`size`,`color`,`size_unit`,`description`,`status`) VALUES(" +
      `'${req.body.name}', ${req.body["category_id"]}, '${req.body.image}', ${req.body.price}, ${req.body.size}, '${req.body.color}', '${req.body["size_unit"]}', '${req.body.description}', ${req.body.status}` +
      ")",
    (error, results) => {
      // Handle Errors
      if (error) {
        statusManager(res, 400, `Error occured: ${error}`);
        // res.status(200).json({
        //   error: true,
        //   message: `Error occured: ${error}`,
        // });
      }
      // Return Results to client
      if ((results !== undefined || results !== null) && !error) {
        statusManager(res, 200, "New product added");

        // res.status(200).json({
        //   error: false,
        //   message: "New product added",
        // });
      }
    }
  );
};

/**
 * Fetch product list from products table with optional parameters such as fetch by: product id (id), category_id, and select_all (all products). All params are integers but can also be passed as strings
 * @param {req} req
 * @param {res} res
 */
const handleGetProductList = (req, res) => {
  // Get product with id

  if (
    (req.query.id !== null || req.query.id !== undefined) &&
    (req.query.category_id === null || req.query.category_id === undefined) &&
    (req.query.select_all === null || req.query.select_all === undefined)
  ) {
    connection.query(
      "SELECT * FROM `products` WHERE `id` = ?",
      req.query.id,
      (error, results) => {
        // Handle Errors
        if (error) {
          statusManager(res, 400, `Error occured: ${error}`);
          // res.status(200).json({
          //   error: true,
          //   message: `Error occured: ${error}`,
          // });
        }
        // Return Results to client
        if ((results !== undefined || results !== null) && !error) {
          statusManager(res, 200, "Product retrieved", results);
          // res.status(200).json({
          //   error: false,
          //   message: "Product retrieved",
          //   data: results,
          // });
        }
      }
    );
  }

  // Fetch products by category id
  if (
    (req.query.category_id !== undefined || req.query.category_id !== null) &&
    (req.query.id === null || req.query.id === undefined) &&
    (req.query.select_all === null || req.query.select_all === undefined)
  ) {
    connection.query(
      "SELECT * FROM `products` WHERE `category_id` = ?",
      [req.query.category_id],
      (error, results) => {
        // Handle Errors
        if (error) {
          statusManager(res, 400, `Error occured: ${error}`);
          // res.status(200).json({
          //   error: true,
          //   message: `Error occured: ${error}`,
          // });
          // console.log("Check: ", error);
        }

        // Return Results to client
        if ((results !== undefined || results !== null) && !error) {
          statusManager(
            res,
            200,
            "All products retrieved by category",
            results
          );
          // res.status(200).json({
          //   error: false,
          //   message: "All products retrieved by category",
          //   data: results,
          // });
        }
      }
    );
  }

  // Fetch all products in db
  if (
    req.query.select_all == 1 &&
    (req.query.id === null || req.query.id === undefined) &&
    (req.query.category_id === null || req.query.category_id === undefined)
  ) {
    connection.query("SELECT * FROM `products`", [], (error, results) => {
      // Handle Errors
      if (error) {
        statusManager(res, 400, `Error occured: ${error}`);
        // res.status(200).json({
        //   error: true,
        //   message: `Error occured: ${error}`,
        // });
      }

      // Return Results to client
      if ((results !== undefined || results !== null) && !error) {
        statusManager(res, 200, "All products retrieved", results);
        // res.status(200).json({
        //   error: false,
        //   message: "All products retrieved",
        //   data: results,
        // });
      }
    });
  }
};

/**
 * Fetch a single product by product id from products table
 * @param {req} req
 * @param {res} res
 */
const handleGetSingleProduct = (req, res) => {
  if (req.query.id !== null || req.query.id !== undefined) {
    connection.query(
      "SELECT * FROM `products` WHERE `id` = ?",
      req.query.id,
      (error, results) => {
        // Handle Errors
        if (error) {
          statusManager(res, 400, `Error occured: ${error}`);

          // res.status(200).json({
          //   error: true,
          //   message: `Error occured: ${error}`,
          // });
        }

        // Return Results to client
        if ((results !== undefined || results !== null) && !error) {
          statusManager(res, 200, "Single product retrieved", results);

          // res.status(200).json({
          //   error: false,
          //   message: "Single product retrieved",
          //   data: results,
          // });
        }
      }
    );
  }
};

/**
 * Delete single product from products table using product id
 * @param {req} req
 * @param {res} res
 */
const handleDeleteProduct = (req, res) => {
  connection.query(
    "DELETE FROM `products` WHERE `id` = ?",
    req.body.id,
    (error, results) => {
      // Handle Errors
      if (error) {
        statusManager(res, 400, `Error occured: ${error}`);

        // res.status(200).json({
        //   error: true,
        //   message: error,
        // });
      }

      // Return Results to client
      if (results !== undefined && !error) {
        statusManager(res, 200, "Product deleted from category");

        // res.status(200).json({
        //   error: false,
        //   message: "Product deleted from category",
        // });
      }
    }
  );
};

/**
 *  Update product in a list
 * @param {req} req
 * @param {res} res
 */
const handleUpdateProduct = (req, res) => {
  connection.query(
    "UPDATE `products` SET " +
      `name ='${req.body.name}', category_id =${req.body.category_id}, image ='${req.body.image}', price =${req.body.price}, size =${req.body.size}, color ='${req.body.color}', size_unit ='${req.body["size_unit"]}', description ='${req.body.description}' ` +
      "WHERE `id` =" +
      `${req.body.id}`,
    (error, results) => {
      // Handle Errors
      if (error) {
        statusManager(res, 400, `Error occured: ${error}`);

        // res.status(200).json({
        //   error: true,
        //   message: error,
        // });
      }

      // Return Results to client
      if (results !== undefined && !error) {
        statusManager(res, 200, "Product updated successfully", results);

        // res.status(200).json({
        //   error: false,
        //   message: "Product updated successfully",
        //   data: results,
        // });
      }
    }
  );
};

/**-------------------------------------------------
 * Product Category handlers
 * -------------------------------------------------
 */

/**
 *  Add new product category to category tables
 * @param {req} req
 * @param {res} res
 */
const handleAddProductCategory = (req, res) => {
  connection.query(
    "INSERT INTO `categories`(`name`) VALUES(" + `'${req.body.name}'` + ")",
    (error, results) => {
      // Handle errors
      if (error) {
        statusManager(res, 400, `Error occured: ${error}`);

        // res.status(200).json({
        //   error: true,
        //   message: `Error occured: ${error}`,
        // });
      }
      // Return Results to client
      if ((results !== undefined || results !== null) && !error) {
        statusManager(res, 200, "Category added");

        // res.status(200).json({
        //   error: false,
        //   message: "Category added",
        // });
      }
    }
  );
};

/**
 *  Delete a category from category list with it's id
 * @param {req} req
 * @param {res} res
 */
const handleDeleteCategory = (req, res) => {
  connection.query(
    "DELETE FROM `categories` WHERE `id` = ?",
    req.body.id,
    (error, results) => {
      // Handle errors
      if (error) {
        statusManager(res, 400, `Error occured: ${error}`);

        // res.status(200).json({
        //   error: true,
        //   message: error,
        // });
      }

      // Return Results to client
      if (results !== undefined && !error) {
        statusManager(res, 200, "Category deleted successfully");

        // res.status(200).json({
        //   error: false,
        //   message: "Category deleted successfully",
        // });
      }
    }
  );
};

/**
 * Fetch categories from table with either id (single category) or select-all (all categories)
 * @param {req} req
 * @param {res} res
 */
const handleGetProductCategories = (req, res) => {
  // Get category with id

  if (
    (req.query.id !== null || req.query.id !== undefined) &&
    (req.query.select_all === null || req.query.select_all === undefined)
  ) {
    connection.query(
      "SELECT * FROM `categories` WHERE `id` = ?",
      req.query.id,
      (error, results) => {
        //Handle Errors
        if (error) {
          statusManager(res, 400, `Error occured: ${error}`);

          // res.status(200).json({
          //   error: true,
          //   message: `Error occured: ${error}`,
          // });
        }

        // Return Results to client
        if ((results !== undefined || results !== null) && !error) {
          statusManager(
            res,
            200,
            "Successfully fetched single category from database",
            results
          );
          // res.status(200).json({
          //   error: false,
          //   message: "Successfully fetched single category from database",
          //   data: results,
          // });
        }
      }
    );
  }

  // Fetch all categories in db
  if (
    req.query.select_all == 1 &&
    (req.query.id === null || req.query.id === undefined)
  ) {
    connection.query("SELECT * FROM `categories` ", [], (error, results) => {
      // Handle Errors
      if (error) {
        statusManager(res, 400, `Error occured: ${error}`);
        // res.status(200).json({
        //   error: true,
        //   message: `Error occured: ${error}`,
        // });
      }
      // Return Results to client
      if ((results !== undefined || results !== null) && !error) {
        statusManager(
          res,
          200,
          "Successfully fetched all categories from database",
          results
        );

        // res.status(200).json({
        //   error: false,
        //   message: "Successfully fetched all categories from database",
        //   data: results,
        // });
      }
    });
  }
};

module.exports = {
  handleAddProduct,
  handleGetProductList,
  handleGetSingleProduct,
  handleDeleteProduct,
  handleUpdateProduct,
  handleAddProductCategory,
  handleDeleteCategory,
  handleGetProductCategories,
};
