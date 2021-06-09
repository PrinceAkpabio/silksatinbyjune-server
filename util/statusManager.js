/**
 * Manages server responses from controllers
 * @param {object} res
 * @param {integer} status
 * @param {string} msg
 * @param {object} data
 * @returns object
 */
module.exports.statusManager = (res, status, msg, data = []) => {
  // Handles responses which return data to the client
  if (data[0] !== undefined) {
    return res.status(status).json({
      error: status <= 201 ? false : true,
      message: msg,
      data: data,
    });
  } else {
    // Handles confirmation/boolean responses sent to the client
    return res.status(status).json({
      error: status <= 201 ? false : true,
      message: msg,
    });
  }
};
