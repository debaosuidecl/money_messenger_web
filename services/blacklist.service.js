const { split } = require("../utils/split");
const BlacklistExecutor = require("../classes/BlacklistFetchers");
async function blacklistScrub(jsonArray) {
  try {
    onlyPhonesArray = jsonArray.map((o) => ({ phone: o.phone }));
    let twoDPhoneArray = split(onlyPhonesArray, 500);
    let concurrencyLimit = 10;
    const batchesCount = Math.ceil(twoDPhoneArray.length / concurrencyLimit);
    let bulkfetch = [];
    for (let i = 0; i < batchesCount; i++) {
      const batchStart = i * concurrencyLimit;
      const batchArguments = twoDPhoneArray.slice(
        batchStart,
        batchStart + concurrencyLimit
      );

      const batchPromises = batchArguments.map((phoneList) =>
        fetchBlacklist(phoneList)
      );

      console.log(batchPromises, 21);
      // Harvestin
      try {
        const batchResults = await Promise.all(batchPromises);
        // return batchResults;

        bulkfetch = [...bulkfetch, ...batchResults];
      } catch (e) {
        console.log(e);
        // return false
      }
    }

    return bulkfetch;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function fetchBlacklist(phoneList) {
  const blacklistExecutor = new BlacklistExecutor(
    "http://blookup.validito.com/lookup.php",
    "0af4a7de0536dff8ced8917765f663e0"
  );

  const res = await blacklistExecutor.fetchBlacklist(phoneList);

  if (!res) {
    console.log("no result");
    return [];
  }

  return res;
}

module.exports = { blacklistScrub };
