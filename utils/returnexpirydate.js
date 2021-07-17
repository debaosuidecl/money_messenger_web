const moment = require("moment");
function returnexpiry(period, extra) {
  return new Date(
    moment().add("months", period).add("days", extra).toString()
  ).getTime();
}

module.exports = {
  returnexpiry,
};
