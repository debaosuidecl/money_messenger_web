const parse = require("csv-parse");

const fs = require("fs");
const got = require("got");

const parseCSV = (path, delimiter = ",", options) => {
  return new Promise(async (resolve, reject) => {
    const csvData = [];

    const stream = options.remote
      ? //@ts-ignore
        got.stream(path)
      : fs.createReadStream(path);
    stream
      .pipe(
        parse({
          delimiter,
          relax_column_count: true,
          // raw: true,
        })
      )
      .on("data", function (dataRow) {
        csvData.push(dataRow);
      })
      .on("end", function () {
        resolve(csvData);
      })

      .on("error", function (err) {
        resolve(err);
      });
  });
};

module.exports = parseCSV;
