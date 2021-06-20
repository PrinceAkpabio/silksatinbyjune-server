const momentTz = require("moment-timezone");

/**
 * General utils library for functions that will be used often across APIs
 * @returns object
 */
module.exports.generalUtil = () => {
  // Main utils library object which encapsulates all the methods we will be working with
  const _utilLibrary = {};

  /**
   * ------------------------------------------------------
   * All library methods will be added from henceforth
   * ------------------------------------------------------
   */

  /**.......................................
   * Convert timevalue to standard double
   * digit values for use in moment timezone
   * @param {object} timeValue
   * @param {integer} addedValue
   * @returns string
   * .......................................
   */
  _utilLibrary.convertToDoubleDateTimeValue = (timeValue, addedValue) => {
    //get the length of timevalue
    const length = timeValue.toString().length;

    // Add extra zero (0) to beginning of timevalue if length is less than 2
    if (length < 2) {
      return addedValue
        ? `0${parseInt(timeValue.toString()) + addedValue}`
        : `0${timeValue.toString()}`;
    }

    // Return timevalue if length is greater than 2
    if (length >= 2) {
      return addedValue
        ? `${parseInt(timeValue.toString()) + addedValue}`
        : timeValue.toString();
    }
  };

  /**.........................................
   * Generate time in, date in and date updated
   *  for varied use in APIs for date and time
   *  consistency
   * @param {function} convert
   * @returns object
   * .........................................
   */
  _utilLibrary.createTimeDateIn = (convert) => {
    // Initialize current local date
    const newDateTime = new Date();

    // Get singular time values for new local date
    const hour = convert(newDateTime.getHours()),
      minutes = convert(newDateTime.getMinutes()),
      day = convert(newDateTime.getDate()),
      month = convert(newDateTime.getMonth(), 1),
      year = convert(newDateTime.getFullYear());

    //Format local time and date for use in moment
    const local_time_in = `${hour}:${minutes}`,
      local_date_in = `${year}-${month}-${day}`;

    // Convert and format local date and time to Lagos timezone for date consistency
    const m = momentTz.tz(`${local_date_in} ${local_time_in}`, "Africa/Lagos");
    const time_in = m.format("HH:mm:ss");
    const date_in = m.format("DD/MM/YYYY");
    const date_updated = m.format("DD/MM/YYYY");

    return {
      time_in,
      date_in,
      date_updated,
    };
  };

  /**.........................................
   * Manages server responses from controllers
   * @param {object} res
   * @param {integer} status
   * @param {string} msg
   * @param {object} data
   * @returns object
   * .........................................
   */
  _utilLibrary.statusManager = (res, status, msg, data = [], params = null) => {
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

  /**.........................
   * @param value
   * @returns boolean -
   * True if value is a string,
   * else false if value is not
   * a string
   * ........................
   */
  _utilLibrary.isString = (value) => {
    // console.log(
    //   "IS STRING: ",
    //   isNaN(value),
    //   typeof value === "string",
    //   value instanceof String,
    //   value
    // );
    return isNaN(value) || value instanceof String;
  };

  /**
   *
   * @param {object} res
   * @param {any} value
   * @param {string} message
   * @param {boolean} status
   * @returns value if not an empty string, else sends an error response to the client
   */
  _utilLibrary.isValueEmptyString = (
    res,
    value,
    message,
    connect,
    status = false
  ) => {
    // Check value for new lines, tabs and certain sql queries and alert it's status
    const check = _utilLibrary.isInjected(value);

    if (value == "") {
      return res.status(400).json({
        error: true,
        message: message,
      });
    } else if (check === true) {
      return res.status(400).json({
        error: true,
        message: message,
      });
    } else {
      status = true;
      return {
        value: _utilLibrary.checkIfNULL(connect.escape(value), connect),
        status: status,
      };
    }
  };

  /**
   * Check if connection.escape method returns a NULL string
   * @param {any} value
   * @returns null is condition is true. When false, value is returned back
   */
  _utilLibrary.checkIfNULL = (value, conn) => {
    if (_utilLibrary.isString(value) === false) {
      return value;
    } else {
      return value === undefined || value === null ? null : conn.escape(value);
    }
  };

  /**
   * Validate if an sql statement was injected by an attacker
   * @param {string} str
   * @returns boolean
   */
  _utilLibrary.isInjected = (str) => {
    const injections = [
      "(\n+)",
      "(\r+)",
      "(\t+)",
      "(%0A+)",
      "(%0D+)",
      "(%08+)",
      "(%09+)",
    ];
    const inject = injections.join("|");
    const injectRegx = /injections.join("|")/i;

    // console.log("regx: ", injectRegx, " injectStr: ", inject);

    if (injectRegx.test(str)) {
      return true;
    } else {
      return false;
    }
  };

  // Escape strings from values
  _utilLibrary.mysqlEscape = (stringToEscape) => {
    if (stringToEscape == "") {
      return stringToEscape;
    }
    if (typeof stringToEscape === "string") {
      return stringToEscape
        .replace(/\\/g, "\\\\")
        .replace(/\'/g, "\\'")
        .replace(/\"/g, '\\"')
        .replace(/\n/g, "\\\n")
        .replace(/\r/g, "\\\r")
        .replace(/\x00/g, "\\\x00")
        .replace(/\x1a/g, "\\\x1a");
    }
  };

  // Make library object avaliable for use in APIs
  return _utilLibrary;
};
