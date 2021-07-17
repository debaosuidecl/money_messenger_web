function replacevariables(body, message, from, to) {
  return JSON.parse(
    JSON.stringify(body)
      .replace("{message}", message)
      .replace("{from_phone}", from)
      .replace("{to_phone}", to)
  );
}

module.exports = {
  replacevariables,
};
