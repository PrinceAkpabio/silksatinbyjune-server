const mysql = require("mysql");
// const connection = require("../../../src/server");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "silksatinbyjune-db",
});

const handleAddProduct = (req, res) => {
  //  `INSERT INTO products(name,category_id,image,price,size,color,size_unit,description,status) VALUES(${req.body.name})`;

  connection.query(
    "INSERT INTO `products`(`name`,`category_id`,`image`,`price`,`size`,`color`,`size_unit`,`description`,`status`) VALUES(" +
      `'${req.body.name}', ${req.body["category_id"]}, '${req.body.image}', ${req.body.price}, ${req.body.size}, '${req.body.color}', '${req.body["size_unit"]}', '${req.body.description}', ${req.body.status}` +
      ")",
    (error, results) => {
      if (error) {
        res.status(200).json({
          error: true,
          message: `Error occured: ${error}`,
        });

        connection.end((err) => {
          console.log("End connection error: ", err);
        });
      }

      if ((results !== undefined || results !== null) && !error) {
        res.status(200).json({
          error: false,
          message: "New product added",
        });
      }
    }
  );
};

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
        if (error) {
          res.status(200).json({
            error: true,
            message: `Error occured: ${error}`,
          });
        }

        if ((results !== undefined || results !== null) && !error) {
          res.status(200).json({
            error: false,
            message: "Product retrieved",
            data: results,
          });

          connection.end((err) => {
            console.log("End connection error: ", err);
          });
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
        if (error) {
          res.status(200).json({
            error: true,
            message: `Error occured: ${error}`,
          });
          console.log("Check: ", error);
        }
        if ((results !== undefined || results !== null) && !error) {
          res.status(200).json({
            error: false,
            message: "All products retrieved by category",
            data: results,
          });

          connection.end((err) => {
            console.log("End connection error: ", err);
          });
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
      if (error) {
        res.status(200).json({
          error: true,
          message: `Error occured: ${error}`,
        });
      }
      if ((results !== undefined || results !== null) && !error) {
        res.status(200).json({
          error: false,
          message: "All products retrieved",
          data: results,
        });
        connection.end((err) => {
          console.log("End connection error: ", err);
        });
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
        if (error) {
          res.status(200).json({
            error: true,
            message: `Error occured: ${error}`,
          });

          connection.end((err) => {
            console.log("End connection error: ", err);
          });
        }
        if ((results !== undefined || results !== null) && !error) {
          res.status(200).json({
            error: false,
            message: "Single product retrieved",
            data: results,
          });
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
      if (error) {
        res.status(200).json({
          error: true,
          message: error,
        });
      }

      if (results !== undefined && !error) {
        res.status(200).json({
          error: false,
          message: "Product deleted from category",
        });

        connection.end((error) => {
          console.log("Error occured: ", error);
        });
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
      if (error) {
        res.status(200).json({
          error: true,
          message: error,
        });
      }

      if (results !== undefined && !error) {
        res.status(200).json({
          error: false,
          message: "Product updated successfully",
          data: results,
        });

        connection.end((error) => {
          console.log("Error occured: ", error);
        });
      }
    }
  );
};

/**
 * Product Category handlers
 */

const handleAddProductCategory = (req, res) => {
  connection.query(
    "INSERT INTO `categories`(`name`) VALUES(" + `'${req.body.name}'` + ")",
    (error, results) => {
      if (error) {
        res.status(200).json({
          error: true,
          message: `Error occured: ${error}`,
        });

        connection.end((err) => {
          console.log("End connection error: ", err);
        });
      }

      if ((results !== undefined || results !== null) && !error) {
        res.status(200).json({
          error: false,
          message: "Category added",
        });
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
      if (error) {
        res.status(200).json({
          error: true,
          message: error,
        });
      }

      if (results !== undefined && !error) {
        res.status(200).json({
          error: false,
          message: "Category deleted successfully",
        });

        connection.end((error) => {
          console.log("Error occured: ", error);
        });
      }
    }
  );
};

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
        if (error) {
          res.status(200).json({
            error: true,
            message: `Error occured: ${error}`,
          });
          connection.end((err) => {
            console.log("End connection error: ", err);
          });
        }

        if ((results !== undefined || results !== null) && !error) {
          res.status(200).json({
            error: false,
            message: "Successfully fetched single category from database",
            data: results,
          });
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
      if (error) {
        res.status(200).json({
          error: true,
          message: `Error occured: ${error}`,
        });
        connection.end((err) => {
          console.log("End connection error: ", err);
        });
      }
      if ((results !== undefined || results !== null) && !error) {
        res.status(200).json({
          error: false,
          message: "Successfully fetched all categories from database",
          data: results,
        });
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
