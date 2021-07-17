const path = require("path");
const uuid = require("uuid");
const group = {
  name: "lead-uploads/sdfawef.csv",
};
const editable = path.join(__dirname, "..", group.name + uuid.v4() + ".csv");

console.log(editable.split("lead-uploads")[1].slice(1));
