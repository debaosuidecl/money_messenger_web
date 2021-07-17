export default function fmt(num, options) {
  // split into two; integer and fraction part
  if (typeof num === "number") {
    num = num.toFixed(options?.tofixednumber || 2);
  }

  var arr = num.match(/^(\d+)((?:\.\d+)?)$/);

  // format integer part and append fraction part
  return arr[1].replace(/(\d)(?=(?:\d{3})+$)/g, "$1,") + arr[2];
}
