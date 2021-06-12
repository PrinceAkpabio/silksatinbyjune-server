const connection = require("../../../config/db.config");
const { statusManager } = require("../../../util/statusManager");
const {
  convertToDoubleDateTimeValue,
  createTimeDateIn,
} = require("../../../util/dateTimeManager");

/**
 * Add product to products table using insert method for mysql and the following fields name, category_id, image, price, size, color, size_unit, description and status
 * @param {req} req
 * @param {res} res
 */
const handleAddProduct = (req, res) => {
  const { time_in, date_in, date_updated } = createTimeDateIn(
    convertToDoubleDateTimeValue
  );

  connection.query(
    "INSERT INTO `products`(`name`,`category_id`,`image`,`price`,`size`,`color`,`size_unit`,`description`,`status`, `time_in`, `date_in`, `date_updated`) VALUES(" +
      `'${req.body.name}', ${req.body["category_id"]}, '${req.body.image}', ${req.body.price}, ${req.body.size}, '${req.body.color}', '${req.body["size_unit"]}', '${req.body.description}', ${req.body.status}, '${time_in}', '${date_in}', '${date_updated}' ` +
      ")",
    (error, results) => {
      // Handle Errors
      if (error) {
        statusManager(res, 400, `Error occured: ${error}`);
      }
      // Return Results to client
      if ((results !== undefined || results !== null) && !error) {
        statusManager(res, 200, "New product added");
      }
    }
  );
};

/**
 * Fetch product list from products table with optional parameters such as fetch by: product id (id), category_id, and select_all (all products). All params are integers but can also be passed as strings
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * @param {integer} lastItemId
 * @param {integer} count
 */
const handleGetProductList = (
  req,
  res,
  next,
  lastItemId = 0,
  count = 20,
  ORDER_BY = "DESC"
) => {
  // Fetch products by count (limit)

  if (
    (req.query.count !== undefined || req.query.count !== null) &&
    (req.query.select_all === null || req.query.select_all === undefined) &&
    (req.query.id === null || req.query.id === undefined) &&
    (req.query.category_id === null || req.query.category_id === undefined) &&
    (req.query.last_item_id === undefined || req.query.last_item_id === null)
  ) {
    connection.query(
      "SELECT * FROM `products` LIMIT " + req.query.count,
      (error, results) => {
        // Handle Errors
        if (error) {
          statusManager(res, 400, error);
        }

        // Return limited results to client
        if ((results !== undefined || results !== null) && !error) {
          statusManager(
            res,
            200,
            `${req.query.count} ${
              req.query.count == 1 ? "product" : "products"
            } retrived from db`,
            results
          );
        }
      }
    );
  }

  // Get product with id

  if (
    (req.query.id !== null || req.query.id !== undefined) &&
    (req.query.category_id === null || req.query.category_id === undefined) &&
    (req.query.select_all === null || req.query.select_all === undefined) &&
    (req.query.count === null || req.query.count === undefined) &&
    (req.query.last_item_id === undefined || req.query.last_item_id === null)
  ) {
    connection.query(
      "SELECT * FROM `products` WHERE `id` = ?",
      req.query.id,
      (error, results) => {
        // Handle Errors
        if (error) {
          statusManager(res, 400, `Error occured: ${error}`);
        }
        // Return Results to client
        if ((results !== undefined || results !== null) && !error) {
          statusManager(res, 200, "Product retrieved", results);
        }
      }
    );
  }

  // Fetch products by category id
  if (
    (req.query.category_id !== undefined || req.query.category_id !== null) &&
    (req.query.id === null || req.query.id === undefined) &&
    (req.query.select_all === null || req.query.select_all === undefined) &&
    (req.query.count === null || req.query.count === undefined) &&
    (req.query.last_item_id === undefined || req.query.last_item_id === null)
  ) {
    connection.query(
      "SELECT * FROM `products` WHERE `category_id` = ?",
      [req.query.category_id],
      (error, results) => {
        // Handle Errors
        if (error) {
          statusManager(res, 400, `Error occured: ${error}`);
        }

        // Return Results to client
        if ((results !== undefined || results !== null) && !error) {
          statusManager(
            res,
            200,
            "All products retrieved by category",
            results
          );
        }
      }
    );
  }

  // Get products from db using the last item/row id from product list in both ascending and descending order

  if (
    (req.query.last_item_id !== undefined || req.query.last_item_id !== null) &&
    // (req.query.count !== undefined || req.query.count !== null) &&
    (req.query.id === null || req.query.id === undefined) &&
    (req.query.category_id === null || req.query.category_id === undefined) &&
    (req.query.select_all === null || req.query.select_all === undefined)
  ) {
    // Check if values were passed from the client for the last item id and count, if any use that instead of default value. This will help in continous pagination of data.

    if (req.query.last_item_id !== null || req.query.last_item_id !== "") {
      lastItemId = req.query.last_item_id;
    }

    if (req.query.count !== null || req.query.count !== "") {
      count = req.query.count;
    }

    /**
     * using the order_by param client can change the order the data is arranged in the array either by ascending or descending. Default order is descending
     * @todo add order_by param to client to process changes dynamically
     */
    let sql;
    if (ORDER_BY === "DESC" && lastItemId > 0) {
      /**  for desc ordered list, the next page to get must be lesser that the last-item-id */
      sql =
        "SELECT * FROM `products` WHERE `id` < " +
        `${lastItemId}` +
        " ORDER BY `id` " +
        `${ORDER_BY}` +
        " LIMIT " +
        `${count}`;
    } else {
      /**  assume we are using  asc ordered list, the next page to get must be greater that the last-item-id */
      sql =
        "SELECT * FROM `products` WHERE `id` > " +
        " ORDER BY `id` " +
        `${ORDER_BY}` +
        " LIMIT " +
        `${count}`;
    }
    connection.query(sql, (error, results) => {
      // Handle Errors
      if (error) {
        statusManager(res, 400, `Error occured: ${error}`);
      }

      // Return Results to client
      if ((results !== undefined || results !== null) && !error) {
        //Return the last item id from the results array for continous pagination of data. If results array is empty then last item id is returned as null to inform the client of the current situation
        const parsedResults = JSON.parse(JSON.stringify(results));
        const parsedLastItemId =
          parsedResults[0] === undefined
            ? null
            : parsedResults[parsedResults.length - 1].id;

        statusManager(
          res,
          200,
          parsedResults[0] === undefined
            ? "No products retrived, end of pagination"
            : "Product list retrieved with last item id",
          results,
          { last_item_id: parsedLastItemId }
        );
      }
    });
  }

  // Fetch all products in db
  if (
    req.query.select_all == 1 &&
    (req.query.id === null || req.query.id === undefined) &&
    (req.query.category_id === null || req.query.category_id === undefined) &&
    (req.query.count === null || req.query.count === undefined) &&
    (req.query.last_item_id === undefined || req.query.last_item_id === null)
  ) {
    connection.query("SELECT * FROM `products`", [], (error, results) => {
      // Handle Errors
      if (error) {
        statusManager(res, 400, `Error occured: ${error}`);
      }

      // Return Results to client
      if ((results !== undefined || results !== null) && !error) {
        statusManager(res, 200, "All products retrieved", results);
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
        }

        // Return Results to client
        if ((results !== undefined || results !== null) && !error) {
          statusManager(res, 200, "Single product retrieved", results);
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
      }

      // Return Results to client
      if (results !== undefined && !error) {
        statusManager(res, 200, "Product deleted from category");
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
  const { date_updated } = createTimeDateIn(convertToDoubleDateTimeValue);
  connection.query(
    "UPDATE `products` SET " +
      `name ='${req.body.name}', category_id =${req.body.category_id}, image ='${req.body.image}', price =${req.body.price}, size =${req.body.size}, color ='${req.body.color}', size_unit ='${req.body["size_unit"]}', description ='${req.body.description}', date_updated='${date_updated}' ` +
      "WHERE `id` =" +
      `${req.body.id}`,
    (error, results) => {
      // Handle Errors
      if (error) {
        statusManager(res, 400, `Error occured: ${error}`);
      }

      // Return Results to client
      if (results !== undefined && !error) {
        statusManager(res, 200, "Product updated successfully", results);
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
  const { time_in, date_in, date_updated } = createTimeDateIn(
    convertToDoubleDateTimeValue
  );
  connection.query(
    "INSERT INTO `categories`(`name`, `time_in`, `date_in`, `date_updated`) VALUES(" +
      `'${req.body.name}', '${time_in}', '${date_in}', '${date_updated}'` +
      ")",
    (error, results) => {
      // Handle errors
      if (error) {
        statusManager(res, 400, `Error occured: ${error}`);
      }
      // Return Results to client
      if ((results !== undefined || results !== null) && !error) {
        statusManager(res, 200, "Category added");
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
      }

      // Return Results to client
      if (results !== undefined && !error) {
        statusManager(res, 200, "Category deleted successfully");
      }
    }
  );
};

/**
 * Fetch categories from table with either id (single category) or select-all (all categories)
 * @param {req} req
 * @param {res} res
 */
const handleGetProductCategories = (
  req,
  res,
  next,
  lastItemId = 0,
  count = 20,
  ORDER_BY = "DESC"
) => {
  // Fetch categories by count (limit)

  if (
    (req.query.count !== undefined || req.query.count !== null) &&
    (req.query.select_all === null || req.query.select_all === undefined) &&
    (req.query.id === null || req.query.id === undefined) &&
    (req.query.last_item_id === undefined || req.query.last_item_id === null)
  ) {
    connection.query(
      "SELECT * FROM `categories` LIMIT " + req.query.count,
      (error, results) => {
        // Handle Errors
        if (error) {
          statusManager(res, 400, error);
        }

        // Return limited results to client
        if ((results !== undefined || results !== null) && !error) {
          statusManager(
            res,
            200,
            `${req.query.count} ${
              req.query.count == 1 ? "category" : "categories"
            } retrived from db`,
            results
          );
        }
      }
    );
  }

  // Get categories from db using the last item/row id from category list in both ascending and descending order

  if (
    (req.query.last_item_id !== undefined || req.query.last_item_id !== null) &&
    (req.query.count !== undefined || req.query.count !== null) &&
    (req.query.id === null || req.query.id === undefined) &&
    (req.query.select_all === null || req.query.select_all === undefined)
  ) {
    // Check if values were passed from the client for the last item id and count, if any use that instead of default value. This will help in continous pagination of data.
    if (req.query.last_item_id !== null || req.query.last_item_id !== "") {
      lastItemId = req.query.last_item_id;
    }

    if (req.query.count !== null || req.query.count !== "") {
      count = req.query.count;
    }

    /**
     * using the order_by param client can change the order the data is arranged in the array either by ascending or descending. Default order is descending
     * @todo add order_by param to client to process changes dynamically
     */
    let sql;
    if (ORDER_BY === "DESC" && lastItemId > 0) {
      /**  for desc ordered list, the next page to get must be lesser that the last-item-id */
      sql =
        "SELECT * FROM `categories` WHERE `id` < " +
        `${lastItemId}` +
        " ORDER BY `id` " +
        `${ORDER_BY}` +
        " LIMIT " +
        `${count}`;
    } else {
      /**  assume we are using  asc ordered list, the next page to get must be greater that the last-item-id */
      sql =
        "SELECT * FROM `categories` WHERE `id` > " +
        " ORDER BY `id` " +
        `${ORDER_BY}` +
        " LIMIT " +
        `${count}`;
    }
    connection.query(sql, (error, results) => {
      // Handle Errors
      if (error) {
        statusManager(res, 400, `Error occured: ${error}`);
      }

      // Return Results to client
      if ((results !== undefined || results !== null) && !error) {
        //Return the last item id from the results array for continous pagination of data. If results array is empty then last item id is returned as null to inform the client of the current situation
        const parsedResults = JSON.parse(JSON.stringify(results));
        const parsedLastItemId =
          parsedResults[0] === undefined
            ? null
            : parsedResults[parsedResults.length - 1].id;

        statusManager(
          res,
          200,
          parsedResults[0] === undefined
            ? "No categories retrived, end of pagination"
            : "Category list retrieved with last item id",
          results,
          { last_item_id: parsedLastItemId }
        );
      }
    });
  }

  // Get category with id

  if (
    (req.query.id !== null || req.query.id !== undefined) &&
    (req.query.select_all === null || req.query.select_all === undefined) &&
    (req.query.count === undefined || req.query.count === null) &&
    (req.query.last_item_id === undefined || req.query.last_item_id === null)
  ) {
    connection.query(
      "SELECT * FROM `categories` WHERE `id` = ?",
      req.query.id,
      (error, results) => {
        //Handle Errors
        if (error) {
          statusManager(res, 400, `Error occured: ${error}`);
        }

        // Return Results to client
        if ((results !== undefined || results !== null) && !error) {
          statusManager(
            res,
            200,
            "Successfully fetched single category from database",
            results
          );
        }
      }
    );
  }

  // Fetch all categories in db
  if (
    req.query.select_all == 1 &&
    (req.query.id === null || req.query.id === undefined) &&
    (req.query.count === undefined || req.query.count === null) &&
    (req.query.last_item_id === undefined || req.query.last_item_id === null)
  ) {
    connection.query("SELECT * FROM `categories` ", [], (error, results) => {
      // Handle Errors
      if (error) {
        statusManager(res, 400, `Error occured: ${error}`);
      }
      // Return Results to client
      if ((results !== undefined || results !== null) && !error) {
        statusManager(
          res,
          200,
          "Successfully fetched all categories from database",
          results
        );
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
