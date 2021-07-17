function split(a, n) {
  let newArray = [];
  let total = a;
  for (let i = 0; i < total.length; i++) {
    if (a.length <= 0) return newArray;
    newArray.push([...a.slice(0, n)]);
    a = a.slice(n);
  }
  return newArray;
}

module.exports = split;
