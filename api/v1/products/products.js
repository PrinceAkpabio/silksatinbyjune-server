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
      }

      if ((results !== undefined || results !== null) && !error) {
        res.status(200).json({
          error: false,
          message: "New product added",
        });

        connection.end((err) => {
          console.log("End connection error: ", err);
        });
      }
    }
  );
};

const handleGetProductList = (req, res) => {
  // Get product with id

  if (
    (req.query.id !== null || req.query.id !== undefined) &&
    (req.query.name === null || req.query.name === undefined) &&
    (req.query["select_all"] === null || req.query["select_all"] === undefined)
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
    (req.query["category_id"] !== undefined ||
      req.query["category_id"] !== null) &&
    (req.query.id === null || req.query.id === undefined) &&
    (req.query["select_all"] === null || req.query["select_all"] === undefined)
  ) {
    connection.query(
      "SELECT * FROM `products` WHERE `category_id` = `?`",
      [req.query["category_id"]],
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
            message: "All products retrieved",
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
    req.query["select_all"] == 1 &&
    (req.query.id === null || req.query.id === undefined) &&
    (req.query["category_id"] === null ||
      req.query["category_id"] === undefined)
  ) {
    connection.query(
      "SELECT * FROM `products`",
      [],
      (error, results, fields) => {
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
      }
    );
  }
};

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
        }
        if ((results !== undefined || results !== null) && !error) {
          res.status(200).json({
            error: false,
            message: "Single product retrieved",
            data: results,
          });
          console.log("result: ", results);

          connection.end((err) => {
            console.log("End connection error: ", err);
          });
        }
      }
    );
  }
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
      }

      if ((results !== undefined || results !== null) && !error) {
        res.status(200).json({
          error: false,
          message: "Category added",
        });

        connection.end((err) => {
          console.log("End connection error: ", err);
        });
      }
    }
  );
};

const handleGetProductCategories = (req, res) => {
  // Get category with id

  if (
    (req.query.id !== null || req.query.id !== undefined) &&
    (req.query["select_all"] === null || req.query["select_all"] === undefined)
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
        }

        if ((results !== undefined || results !== null) && !error) {
          console.log("categories: ", results);
          res.status(200).json({
            error: false,
            message: "Successfully fetched single category from database",
            data: results,
          });

          connection.end((err) => {
            console.log("End connection error: ", err);
          });
        }
      }
    );
  }

  // Fetch all categories in db
  if (
    req.query["select_all"] == 1 &&
    (req.query.id === null || req.query.id === undefined)
  ) {
    connection.query("SELECT * FROM `categories`", [], (error, results) => {
      if (error) {
        res.status(200).json({
          error: true,
          message: `Error occured: ${error}`,
        });
      }
      if ((results !== undefined || results !== null) && !error) {
        res.status(200).json({
          error: false,
          message: "Successfully fetched all categories from database",
          data: results,
        });

        connection.end((err) => {
          console.log("End connection error: ", err);
        });
      }
    });
  }
};

module.exports = {
  handleAddProduct,
  handleGetProductList,
  handleGetSingleProduct,
  handleAddProductCategory,
  handleGetProductCategories,
};
