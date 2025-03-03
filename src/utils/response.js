const response = (statusCode = OK, message = "ok", data = null) => {
  return {
    statusCode,
    data: {
      ...data,
      message,
    },
    error: null,
  };
};

module.exports = response;
