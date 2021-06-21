const connection = require("../../../config/db.config");
const { generalUtil } = require("../../../util/generalUtils");

// Get general utils for easy resuability
const {
  convertToDoubleDateTimeValue,
  createTimeDateIn,
  statusManager,
  isValueEmptyString,
  isString,
  checkIfNULL,
} = generalUtil();

/**
 * Add product to products table using insert method for mysql and the following fields name, category_id, image, price, size, color, size_unit, description and status
 * @param {req} req
 * @param {res} res
 */
const handleAddProduct = (req, res) => {
  // Check field  values from client if empty and return error response
  const name = isValueEmptyString(
    res,
    req.body.name,
    "Product Name can not be empty",
    connection
  );
  const category_id = isValueEmptyString(
    res,
    req.body.category_id,
    "Category can not be empty",
    connection
  );
  const image = isValueEmptyString(
    res,
    req.body.image,
    "Image can not be empty",
    connection
  );
  const price = isValueEmptyString(
    res,
    req.body.price,
    "Price can not be empty",
    connection
  );
  const size = isValueEmptyString(
    res,
    req.body.size,
    "Produce size can not be empty",
    connection
  );
  const color = isValueEmptyString(
    res,
    req.body.color,
    "Product color can not be empty",
    connection
  );
  const size_unit = isValueEmptyString(
    res,
    req.body.size_unit,
    "Product unit can not be empty",
    connection
  );
  const description = isValueEmptyString(
    res,
    req.body.description,
    "Product description can not be empty",
    connection
  );

  // Validate if category id and price are integers
  if (price.status === true || category_id.status === true)
    if (isString(price.value) || isString(category_id.value)) {
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
        `${name.value}, ${category_id.value}, ${image.value}, ${price.value}, ${size.value}, ${color.value}, ${size_unit.value}, ${description.value}, ${status}, '${time_in}', '${date_in}', '${date_updated}' ` +
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
  ORDER_BY = "ASC"
) => {
  // Escape user input/query values
  const id = checkIfNULL(req.query.id, connection);
  const category_id = checkIfNULL(req.query.category_id, connection);
  const select_all = checkIfNULL(req.query.select_all, connection);
  const last_item_id = checkIfNULL(req.query.last_item_id, connection);
  const count_query = checkIfNULL(req.query.count, connection);
  const sort_by = checkIfNULL(req.query.sort_by, connection);

  if (last_item_id !== null) {
    // Check if values were passed from the client for the last item id, count and sort by parameters, if any use that instead of default value. This will help in continous pagination of data.

    lastItemId = last_item_id;
  }

  if (count_query !== null) {
    count = count_query;
  }

  if (sort_by !== null) {
    ORDER_BY = sort_by == 1 ? "ASC" : "DESC";
  }

  /**
   * Choose sql statement to be used to query the products table
   */
  let sql;

  if (id !== null) {
    // Used when you want to get a single product
    sql = "SELECT * FROM `products` WHERE `id` = " + id;
  } else if (category_id !== null) {
    // Used when you want fetch products by the category they belong to.
    sql =
      "SELECT * FROM `products` WHERE `category_id` = " +
      category_id +
      " ORDER BY `id` " +
      ORDER_BY +
      " LIMIT " +
      count;
  } else if (
    (select_all !== null && select_all == 1) ||
    (last_item_id === null && count !== null)
  ) {
    // Used when you want to select every product in the products table
    sql =
      "SELECT * FROM `products` " +
      " ORDER BY `id` " +
      ORDER_BY +
      " LIMIT " +
      count;
  } else if (ORDER_BY === "DESC" && lastItemId > 0 && count !== null) {
    /**  for descending ordered list, the next page to get must be lesser that the last-item-id */
    sql =
      "SELECT * FROM `products` WHERE `id` < " +
      `${lastItemId}` +
      " ORDER BY `id` " +
      `${ORDER_BY}` +
      " LIMIT " +
      `${count}`;
  } else if (ORDER_BY === "ASC" && lastItemId > 0 && count !== null) {
    /**  assume we are using  ascending ordered list, the next page to get must be greater that the last-item-id */
    sql =
      "SELECT * FROM `products` WHERE `id` > " +
      `${lastItemId}` +
      " ORDER BY `id` " +
      `${ORDER_BY}` +
      " LIMIT " +
      `${count}`;
  }

  // After selecting the sql statement and validating user inputs/query values you want to use to query the db, the query can now be made.
  connection.query(sql, (error, results) => {
    // Handle Errors
    if (error) {
      statusManager(res, 400, error);
    }

    // Return results to client
    if ((results !== undefined || results !== null) && !error) {
      // Get parsed data as the results object returned is in packetRow data form not suitable for client consumption
      const parsedResults = JSON.parse(JSON.stringify(results));

      // Retrive last item id for use in client pagination
      let parsedLastItemId =
        parsedResults[0] === undefined
          ? null
          : parsedResults[parsedResults.length - 1].id;

      // Finally we can now sent data to the client. N/B: when id is used to query db we dont return the last item id to the client
      id !== null
        ? statusManager(res, 200, "Product found!", parsedResults)
        : statusManager(res, 200, "Products list found", parsedResults, {
            last_item_id: parsedLastItemId,
          });
    }
  });
};

/**
 * Fetch a single product by product id from products table
 * @param {req} req
 * @param {res} res
 */
const handleGetSingleProduct = (req, res, next) => {
  // Escaped user input/query values
  const id = checkIfNULL(req.query.id, connection);
  const sql = "SELECT * FROM `products` WHERE `id` = " + id;

  if (id !== null || id !== undefined) {
    connection.query(sql, (error, results) => {
      const returnedData = JSON.parse(JSON.stringify(results));

      // Handle Errors
      if (error) {
        statusManager(res, 400, `Error occured: ${error}`);
      }

      // Return Results to client
      if ((results !== undefined || results !== null) && !error) {
        statusManager(res, 200, "Single product retrieved", returnedData);
      }
    });
  }
};

/**
 * Delete single product from products table using product id
 * @param {req} req
 * @param {res} res
 */
const handleDeleteProduct = (req, res) => {
  //Ensure product id is aviable for request
  // Escaped query values
  const id = checkIfNULL(req.query.id, connection);
  const sql = "DELETE FROM `products` WHERE `id` = " + id;

  //Validate if id is integer
  if (isString(id)) {
    statusManager(res, 400, "Id can must be integer");
  }

  // Make query if id is aviable and not a string
  if (isString(id) === false) {
    connection.query(sql, (error, results) => {
      // Handle Errors
      if (error) {
        statusManager(res, 400, `Error occured: ${error}`);
      }

      // Return Results to client
      if (results !== undefined && !error) {
        statusManager(res, 200, "Product deleted from category");
      }
    });
  }
};

/**
 *  Update product in a list
 * @param {req} req
 * @param {res} res
 */
const handleUpdateProduct = (req, res) => {
  // Validate incoming query values from client and check if they are empty string and also if required integers types are valid

  const id = isValueEmptyString(
    res,
    req.body.id,
    "Id can not be empty",
    connection
  );
  const name = isValueEmptyString(
    res,
    req.body.name,
    "Product name can not be empty",
    connection
  );
  const category_id = isValueEmptyString(
    res,
    req.body.category_id,
    "Category id can not be empty",
    connection
  );
  const image = isValueEmptyString(
    res,
    req.body.image,
    "Product Image can not be empty",
    connection
  );
  const price = isValueEmptyString(
    res,
    req.body.price,
    "Product Price can not be empty",
    connection
  );
  const size = isValueEmptyString(
    res,
    req.body.size,
    "Product size can not be empty",
    connection
  );
  const color = isValueEmptyString(
    res,
    req.body.color,
    "Product Colour can not be empty",
    connection
  );
  const size_unit = isValueEmptyString(
    res,
    req.body.size_unit,
    "Product unit can not be empty",
    connection
  );
  const description = isValueEmptyString(
    res,
    req.body.description,
    "Product description can not be empty",
    connection
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
    isString(price.value) === false &&
    isString(id.value) === false
  )
    connection.query(
      "UPDATE `products` SET " +
        `name =${name.value}, category_id =${category_id.value}, image =${image.value}, price =${price.value}, size =${size.value}, color =${color.value}, size_unit =${size_unit.value}, description =${description.value}, date_updated=${date_updated} ` +
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
    "Category name can not be empty",
    connection
  );

  const { time_in, date_in, date_updated } = createTimeDateIn(
    convertToDoubleDateTimeValue
  );

  if (name.status === true) {
    connection.query(
      "INSERT INTO `categories`(`name`, `time_in`, `date_in`, `date_updated`) VALUES(" +
        `${name.value}, '${time_in}', '${date_in}', '${date_updated}'` +
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
  const id = isValueEmptyString(
    res,
    req.body.id,
    "Id can not be empty",
    connection
  );

  // Validate if id is an integer
  if (isString(id.value)) {
    statusManager(res, 400, "Id must be an integer");
  }

  if (id.status === true && isString(id.value) === false) {
    connection.query(
      "DELETE FROM `categories` WHERE `id` = " + `${id.value}`,
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
  ORDER_BY = "ASC"
) => {
  // Escape user input/query values
  const id = checkIfNULL(req.query.id, connection);
  const select_all = checkIfNULL(req.query.select_all, connection);
  const last_item_id = checkIfNULL(req.query.last_item_id, connection);
  const count_query = checkIfNULL(req.query.count, connection);
  const sort_by = checkIfNULL(req.query.sort_by, connection);

  // Check if values were passed from the client for the last item id, count and sort by parameters, if any use that instead of default value. This will help in continous pagination of data.

  if (last_item_id !== null) {
    lastItemId = last_item_id;
  }

  if (count_query !== null) {
    count = count_query;
  }

  if (sort_by !== null) {
    ORDER_BY = sort_by == 1 ? "ASC" : "DESC";
  }

  /**
   * Choose sql statement to be used to query the categories table
   */
  let sql;

  if (id !== null) {
    // Used when you want to get a single category
    sql = "SELECT * FROM `categories` WHERE `id` = " + id;
  } else if (
    (select_all !== null && select_all == 1) ||
    (last_item_id === null && count !== null)
  ) {
    // Used when you want to select every category in the categories table
    sql =
      "SELECT * FROM `categories` " +
      " ORDER BY `id` " +
      ORDER_BY +
      " LIMIT " +
      count;
  } else if (ORDER_BY === "DESC" && lastItemId > 0 && count !== null) {
    /**  for descending ordered list, the next page to get must be lesser that the last-item-id */
    sql =
      "SELECT * FROM `categories` WHERE `id` < " +
      `${lastItemId}` +
      " ORDER BY `id` " +
      `${ORDER_BY}` +
      " LIMIT " +
      `${count}`;
  } else if (ORDER_BY === "ASC" && lastItemId > 0 && count !== null) {
    /**  assume we are using  ascending ordered list, the next page to get must be greater that the last-item-id */
    sql =
      "SELECT * FROM `categories` WHERE `id` > " +
      `${lastItemId}` +
      " ORDER BY `id` " +
      `${ORDER_BY}` +
      " LIMIT " +
      `${count}`;
  }

  // After selecting the sql statement and validating user inputs/query values you want to use to query the db, the query can now be made.
  connection.query(sql, (error, results) => {
    // Handle Errors
    if (error) {
      statusManager(res, 400, error);
    }

    // Return results to client
    if ((results !== undefined || results !== null) && !error) {
      // Get parsed data as the results object returned is in packetRow data form not suitable for client consumption
      const parsedResults = JSON.parse(JSON.stringify(results));

      // Retrive last item id for use in client pagination
      const parsedLastItemId =
        parsedResults[0] === undefined
          ? null
          : parsedResults[parsedResults.length - 1].id;

      // Finally we can now sent data to the client. N/B: when id is used to query db we dont return the last item id to the client
      id !== null
        ? statusManager(res, 200, "Category found!", parsedResults)
        : statusManager(res, 200, "Category list found", parsedResults, {
            last_item_id: parsedLastItemId,
          });
    }
  });
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
