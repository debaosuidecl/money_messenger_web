var fs = require("fs");
var csv = require("csv-parse");
var i = 0;
var num = 10;
const finalArray = [];
var stream = fs.createReadStream("./helperfunctions/test.csv");
var parser = csv({
  delimiter: ",",
});

function done() {
  //   console.log("done");
  stream.unpipe(parser);
  parser.end();
  stream.destroy();
}

let k = 0;

parser.on("readable", function () {
  // parser.
  // parser.resume();

  while (k < 6) {
    // if (k < 3) {
    let r = parser.read();
    // }

    k++;
  }

  //   let r = parser.read();
  //   console.log(r, 19);
  //   if (i < num) {
  //     console.log(i, r, num);
  //     i++;
  //   } else {
  //     console.log("done");
  //     done();
  //   }
});

parser.on("data", function (dataRow) {
  //   console.log(dataRow.length, 29);

  finalArray.push(dataRow);
});

parser.on("error", function () {
  console.log("Error");
}); // TODO: Handle appropriately

parser.on("finish", done);
stream.pipe(parser);

parser.on("end", function () {
  console.log(finalArray, "final");
});

// var fs = require("fs"),
//   es = require("event-stream");

// var lineNr = 0;
// const array = [];
// var s = fs
//   .createReadStream("./helperfunctions/test.csv")
//   .pipe(es.split())
//   .pipe(
//     es
//       .mapSync(function (line) {
//         // pause the readstream
//         s.pause();

//         lineNr += 1;

//         // console.log(line, 55);
//         if (lineNr > 4) {
//           array.push(line);
//         }

//         // process line here and call s.resume() when rdy
//         // function below was for logging memory usage
//         // logMemoryUsage(lineNr);

//         // resume the readstream, possibly from a callback
//         s.resume();
//       })
//       .on("error", function (err) {
//         console.log("Error while reading file.", err);
//       })
//       .on("end", function () {
//         console.log("Read entire file.");
//         console.log(array);
//       })
//   );
