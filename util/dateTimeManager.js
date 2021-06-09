const momentTz = require("moment-timezone");

/**
 * Convert timevalue to standard double digit values for use in moment timezone
 * @param {object} timeValue
 * @param {integer} addedValue
 * @returns string
 */
const convertToDoubleDateTimeValue = (timeValue, addedValue) => {
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

/**
 * Generate time in, date in and date updated for varied use in APIs for date and time consistency
 * @param {function} convert
 * @returns object
 */
const createTimeDateIn = (convert) => {
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

module.exports = {
  convertToDoubleDateTimeValue,
  createTimeDateIn,
};
