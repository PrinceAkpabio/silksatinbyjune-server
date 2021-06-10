/**
 * Manages server responses from controllers
 * @param {object} res
 * @param {integer} status
 * @param {string} msg
 * @param {object} data
 * @returns object
 */
module.exports.statusManager = (res, status, msg, data = [], params = null) => {
  // Handles responses which return data to the client
  if (data[0] !== undefined && params === null) {
    return res.status(status).json({
      error: status <= 201 ? false : true,
      message: msg,
      data: data,
    });
  } else if (params !== null) {
    // Handles responses which return data to the client with extra parameters for continous querying of the db
    return res.status(status).json({
      error: status <= 201 ? false : true,
      message: msg,
      data: data,
      params: params,
    });
  } else {
    // Handles confirmation/boolean responses sent to the client
    return res.status(status).json({
      error: status <= 201 ? false : true,
      message: msg,
    });
  }
};
