exports.errorHandler = (res, module, statusCode, message, err) => {
  console.error(`[${module}]`, message, err);
  res.status(statusCode).send({ message });
}