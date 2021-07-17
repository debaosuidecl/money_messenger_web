const fs = require("fs");
const path = require("path");
const file = fs.readFileSync(
  path.resolve(__dirname, "..", "templates/resendemail.html"),
  "utf-8"
);

let link = "https://google.com";

console.log(
  file.replace("{link}", link).replace("https://viewstripo.email/", link),
  7
);
