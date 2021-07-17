exports.errorreturn = (res, status, msg) => {
  return res.status(status).send({
    errors: [
      {
        msg,
      },
    ],
  });
};
