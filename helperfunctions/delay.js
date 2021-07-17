const delay = (timeinmiliseconds) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("done");
    }, timeinmiliseconds);
  });
};

module.exports = delay;
