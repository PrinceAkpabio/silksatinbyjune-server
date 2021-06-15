const connection = require("../../../config/db.config");
const { generalUtil } = require("../../../util/generalUtils");

// Get general utils for easy resuability
const {
  convertToDoubleDateTimeValue,
  createTimeDateIn,
  statusManager,
  isValueEmptyString,
  isString,
  isInjected,
} = generalUtil();

/**
 * Add product to products table using insert method for mysql and the following fields name, category_id, image, price, size, color, size_unit, description and status
 * @param {req} req
 * @param {res} res
 */
const handleAddProduct = (req, res) => {
  // console.log("reqObj: ", req);

  // Check field  values from client if empty and return error response
  const name = isValueEmptyString(
    res,
    req.body.name,
    "Product Name can not be empty"
  );
  const category_id = isValueEmptyString(
    res,
    req.body.category_id,
    "Category can not be empty"
  );
  const image = isValueEmptyString(
    res,
    req.body.image,
    "Image can not be empty"
  );
  const price = isValueEmptyString(
    res,
    req.body.price,
    "Price can not be empty"
  );
  const size = isValueEmptyString(
    res,
    req.body.size,
    "Produce size can not be empty"
  );
  const color = isValueEmptyString(
    res,
    req.body.color,
    "Product color can not be empty"
  );
  const size_unit = isValueEmptyString(
    res,
    req.body.size_unit,
    "Product unit can not be empty"
  );
  const description = isValueEmptyString(
    res,
    req.body.description,
    "Product description can not be empty"
  );

  // Validate if category id and price are integers

  if (isString(category_id.value) || isString(price.value)) {
    statusManager(res, 400, "Category_id or price must be an integer");
  }

  // Set the product status
  //@todo: product status will be reimplement in a future date to make it the API more dynamic
  const status = req.body.status || 1;

  // Get timezone date and time on input to db
  const { time_in, date_in, date_updated } = createTimeDateIn(
    convertToDoubleDateTimeValue
  );

  // Add product to db
  if (
    name.status === true &&
    category_id.status === true &&
    image.status === true &&
    price.status === true &&
    size.status === true &&
    color.status === true &&
    size_unit.status === true &&
    description.status === true &&
    isString(category_id.value) === false &&
    isString(price.value) === false
  ) {
    connection.query(
      "INSERT INTO `products`(`name`,`category_id`,`image`,`price`,`size`,`color`,`size_unit`,`description`,`status`, `time_in`, `date_in`, `date_updated`) VALUES(" +
        `'${name.value}', ${category_id.value}, '${image.value}', ${price.value}, ${size.value}, '${color.value}', '${size_unit.value}', '${description.value}', ${status}, '${time_in}', '${date_in}', '${date_updated}' ` +
        ")",
      (error, results) => {
        // Handle Errors
        if (error) {
          statusManager(
            res,
            400,
            `Product could not be added due to: ${error}`
          );
        }
        // Return Results to client
        if ((results !== undefined || results !== null) && !error) {
          statusManager(res, 200, "New product added");
        }
      }
    );
  }
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
  const id = req.query.id;
  const sqlSt = "SELECT * FROM `products` WHERE `id` = " + `${id}`;
  console.log("sql injected: ", sqlSt);
  const check = isInjected(sqlSt);
  console.log("sql check: ", check);

  if (
    (req.query.id !== null || req.query.id !== undefined) &&
    (req.query.category_id === null || req.query.category_id === undefined) &&
    (req.query.select_all === null || req.query.select_all === undefined) &&
    (req.query.count === null || req.query.count === undefined) &&
    (req.query.last_item_id === undefined || req.query.last_item_id === null)
  ) {
    connection.query(sqlSt, (error, results) => {
      // Handle Errors
      if (error) {
        statusManager(res, 400, `Error occured: ${error}`);
      }
      // Return Results to client
      if ((results !== undefined || results !== null) && !error) {
        statusManager(res, 200, "Product retrieved", results);
      }
    });
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
  //Ensure product id is aviable for request
  const id = req.body.id;

  //Validate if id is integer
  if (isString(id)) {
    statusManager(res, 400, "Id can must be integer");
  }

  // Make query if id is aviable and not a string
  if (isString(id) === false) {
    connection.query(
      "DELETE FROM `products` WHERE `id` = ?",
      id,
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
  }
};

/**
 *  Update product in a list
 * @param {req} req
 * @param {res} res
 */
const handleUpdateProduct = (req, res) => {
  // Validate incoming query values from client and check if they are empty string and also if required integers types are valid

  const id = isValueEmptyString(res, req.body.id, "Id can not be empty");
  const name = isValueEmptyString(
    res,
    req.body.name,
    "Product name can not be empty"
  );
  const category_id = isValueEmptyString(
    res,
    req.body.category_id,
    "Category id can not be empty"
  );
  const image = isValueEmptyString(
    res,
    req.body.image,
    "Product Image can not be empty"
  );
  const price = isValueEmptyString(
    res,
    req.body.price,
    "Product Price can not be empty"
  );
  const size = isValueEmptyString(
    res,
    req.body.size,
    "Product size can not be empty"
  );
  const color = isValueEmptyString(
    res,
    req.body.color,
    "Product Colour can not be empty"
  );
  const size_unit = isValueEmptyString(
    res,
    req.body.size_unit,
    "Product unit can not be empty"
  );
  const description = isValueEmptyString(
    res,
    req.body.description,
    "Product description can not be empty"
  );

  // Validate if required integers - category_id, price and id - are valid

  if (
    isString(id.value) ||
    isString(category_id.value) ||
    isString(price.value)
  ) {
    statusManager(
      res,
      400,
      "Either Id, category_id or price must be an integer"
    );
  }

  const { date_updated } = createTimeDateIn(convertToDoubleDateTimeValue);

  if (
    name.status === true &&
    category_id.status === true &&
    image.status === true &&
    price.status === true &&
    size.status === true &&
    color.status === true &&
    size_unit.status === true &&
    description.status === true &&
    isString(category_id.value) === false &&
    isString(price) === false &&
    isString(id.value) === false
  )
    connection.query(
      "UPDATE `products` SET " +
        `name ='${name.value}', category_id =${category_id.value}, image ='${image.value}', price =${price.value}, size =${size.value}, color ='${color.value}', size_unit ='${size_unit.value}', description ='${description.value}', date_updated='${date_updated}' ` +
        "WHERE `id` =" +
        `${id.value}`,
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
  // Validated incoming query values from client

  const name = isValueEmptyString(
    res,
    req.body.name,
    "Category name can not be empty"
  );

  const { time_in, date_in, date_updated } = createTimeDateIn(
    convertToDoubleDateTimeValue
  );

  if (name.status === true) {
    connection.query(
      "INSERT INTO `categories`(`name`, `time_in`, `date_in`, `date_updated`) VALUES(" +
        `'${name.value}', '${time_in}', '${date_in}', '${date_updated}'` +
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
  }
};

/**
 *  Delete a category from category list with it's id
 * @param {req} req
 * @param {res} res
 */
const handleDeleteCategory = (req, res) => {
  // Validated incoming query values from client
  const id = isValueEmptyString(res, req.body.id, "Id can not be empty");
  // const id =  req.body.id;

  // Validate if id is an integer
  if (isString(id.value)) {
    statusManager(res, 400, "Id must be an integer");
  }

  if (id.status === true && isString(id.value) === false) {
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
  }
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
