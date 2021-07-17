const jsonexport = require("jsonexport");

const contacts = [
  {
    name: "Bob",
    lastname: "Smith",
  },
  {
    name: "James",
    lastname: "David",
  },
  {
    name: "Robert",
    lastname: "Miller",
  },
  {
    name: "David",
    lastname: "Martin",
  },
];

jsonexport(contacts, function (err, csv) {
  if (err) return console.error(err);
  console.log(csv);
});
