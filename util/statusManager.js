module.exports.statusManager = (res, status, msg, data = []) => {
  return res.status(status).json({
    error: status <= 201 ? false : true,
    message: msg,
    data: data,
  });
};
