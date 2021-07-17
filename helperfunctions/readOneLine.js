var lineReader = require("line-reader");
async function readOneLine(filepath) {
  return new Promise((resolve, reject) => {
    lineReader.open(filepath, function (err, reader) {
      if (err) reject(err);
      if (reader.hasNextLine()) {
        reader.nextLine(function (err, line) {
          try {
            if (err) reject(err);
            resolve(line);
          } finally {
            reader.close(function (err) {
              if (err) reject(err);
            });
          }
        });
      } else {
        reader.close(function (err) {
          if (err) reject(err);
        });
      }
    });
  });
}

module.exports = readOneLine;
