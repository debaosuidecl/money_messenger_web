const moment = require("moment");

function returndate(count) {
  return new Date(
    moment().add("months", count).add("days", 2).toString()
  ).getTime();
}

console.log(returndate(1), new Date(returndate(1)));
