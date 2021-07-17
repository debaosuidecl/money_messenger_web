// const { requestModule } = require("../helperfunctions/requestModule");

// (async () => {
//   const res = await requestModule(
//     "get",
//     `https://api.namecheap.com/xml.response?APIKey=456695e07b3648ae8daeb66ea750f3db&ClientIP=105.112.185.237&UserName=freshdatanow&APIUser=freshdatanow&Command=namecheap.users.getBalances`,
//     null,
//     false
//   );

//   console.log(res.data);
// })();
var lineReader = require("line-reader");

// read line by line:
lineReader.open("phone.txt", function (err, reader) {
  if (err) throw err;
  if (reader.hasNextLine()) {
    reader.nextLine(function (err, line) {
      try {
        if (err) throw err;
        console.log(line, 22);
      } finally {
        reader.close(function (err) {
          if (err) throw err;
        });
      }
    });
  } else {
    reader.close(function (err) {
      if (err) throw err;
    });
  }
});
