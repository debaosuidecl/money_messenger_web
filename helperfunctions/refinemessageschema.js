const PipeRandomSchemaSave = require("../models/PipeRandomSchemaSave");
var faker = require("faker");
const { fiveIncrements, tenIncrements } = require("./increments");
faker.locale = "en_US";
function refinemessage(messageFormat, user) {
  return new Promise(async (resolve, reject) => {
    let arrayOfSpecialWords = [];
    let indicesOfOpening = getIndicesOf("{{", messageFormat, false);

    let indicesOfClosing = getIndicesOf("}}", messageFormat, false);

    if (
      indicesOfClosing.length === indicesOfOpening.length &&
      indicesOfOpening.length !== 0
    ) {
      for (let i = 0; i < indicesOfOpening.length; i++) {
        let word = messageFormat.substring(
          indicesOfOpening[i],
          indicesOfClosing[i] + 2
        );
        const search1RegExp = /{{/gi;
        const search2RegExp = /}}/gi;
        const replaceWith = "";

        word = word.replace(search1RegExp, replaceWith);
        word = word.replace(search2RegExp, replaceWith);
        arrayOfSpecialWords.push(word);
      }
    }
    for (let i = 0; i < arrayOfSpecialWords.length; i++) {
      var search1RegExp = new RegExp("{{" + arrayOfSpecialWords[i] + "}}", "g");

      let replaceWith = await PipeRandomSchemaSave.findOne({
        name: arrayOfSpecialWords[i],
        user,
      });
      if (replaceWith) {
        replaceWith = replaceWith.pipeList;
        messageFormat = messageFormat.replace(search1RegExp, replaceWith);
      }
    }

    resolve(messageFormat);
  });
}

function randomizefoundpipes(messageFormat, o, domain, shortid) {
  let newMessage = "";
  let arrayOfWordsToRandomize = [];
  let arrayOfWordsToReplace = [];
  let indicesOfOpeningSingle = getIndicesOf("<<", messageFormat, false);

  let indicesOfClosingSingle = getIndicesOf(">>", messageFormat, false);
  if (
    indicesOfClosingSingle.length === indicesOfOpeningSingle.length &&
    indicesOfOpeningSingle.length !== 0
  ) {
    for (let l = 0; l < indicesOfOpeningSingle.length; l++) {
      let word = messageFormat.substring(
        indicesOfOpeningSingle[l],
        indicesOfClosingSingle[l] + 2
      );

      let wordToSplit = word.replace("<<", "").replace(">>", "");
      let wordSplit = wordToSplit.split("|");

      let selectedWord =
        wordSplit[Math.floor(Math.random() * wordSplit.length)];
      arrayOfWordsToReplace.push(word);
      arrayOfWordsToRandomize.push(selectedWord);
    }
    for (let m = 0; m < arrayOfWordsToRandomize.length; m++) {
      const wordToReplace = arrayOfWordsToReplace[m];
      const replaceWith = arrayOfWordsToRandomize[m];
      if (newMessage) {
        newMessage = newMessage.split(wordToReplace).join(replaceWith);
      } else {
        newMessage = messageFormat.split(wordToReplace).join(replaceWith);
      }
    }
  } else {
    newMessage = messageFormat;
  }

  //   let o = jsonArray[i];
  //   console.log(o);
  let addressToForward = o.address;
  if (o.address) {
    if (o.address.indexOf(" drive") !== -1) {
      addressToForward = o.address.split(" drive")[0] + " Dr";
    } else if (o.address.indexOf(" Drive") !== -1) {
      addressToForward = o.address.split(" Drive")[0] + " Dr";
    } else if (o.address.indexOf(" dr") !== -1) {
      addressToForward = o.address.split(" dr")[0] + " Dr";
    } else if (o.address.indexOf(" Dr") !== -1) {
      addressToForward = o.address.split(" Dr")[0] + " Dr";
    } else if (o.address.indexOf(" DR") !== -1) {
      addressToForward = o.address.split(" DR")[0] + " Dr";
    }

    //Junction

    if (o.address.indexOf(" drive") !== -1) {
      addressToForward = o.address.split(" drive")[0] + " Dr";
    } else if (o.address.indexOf(" Drive") !== -1) {
      addressToForward = o.address.split(" Drive")[0] + " Dr";
    } else if (o.address.indexOf(" dr") !== -1) {
      addressToForward = o.address.split(" dr")[0] + " Dr";
    } else if (o.address.indexOf(" Dr") !== -1) {
      addressToForward = o.address.split(" Dr")[0] + " Dr";
    } else if (o.address.indexOf(" DR") !== -1) {
      addressToForward = o.address.split(" DR")[0] + " Dr";
    }

    //BOULEVARD CHECK
    else if (o.address.indexOf(" Boulevard") !== -1) {
      addressToForward = o.address.split("Boulevard")[0] + " Blvd";
    } else if (o.address.indexOf(" boulevard") !== -1) {
      addressToForward = o.address.split("boulevard")[0] + " Blvd";
    } else if (o.address.indexOf(" Blvd") !== -1) {
      addressToForward = o.address.split("Blvd")[0] + " Blvd";
    } else if (o.address.indexOf(" blvd") !== -1) {
      addressToForward = o.address.split("blvd")[0] + " Blvd";
    } else if (o.address.indexOf(" BLVD") !== -1) {
      addressToForward = o.address.split("BLVD")[0] + " Blvd";
    }

    //AVENUE CHECK
    else if (o.address.indexOf(" Avenue") !== -1) {
      addressToForward = o.address.split(" Avenue")[0] + " Ave";
    } else if (o.address.indexOf(" avenue") !== -1) {
      addressToForward = o.address.split("avenue")[0] + " Ave";
    } else if (o.address.indexOf(" Ave") !== -1) {
      addressToForward = o.address.split("Ave")[0] + " Ave";
    } else if (o.address.indexOf(" ave") !== -1) {
      addressToForward = o.address.split("ave")[0] + " Ave";
    } else if (o.address.indexOf(" AVE") !== -1) {
      addressToForward = o.address.split("AVE")[0] + " Ave";
    }

    // STREET CHECK
    else if (o.address.indexOf(" Street") !== -1) {
      addressToForward = o.address.split("Street")[0] + " st";
    } else if (o.address.indexOf(" street") !== -1) {
      addressToForward = o.address.split("street")[0] + " st";
    } else if (o.address.indexOf(" St") !== -1) {
      addressToForward = o.address.split("St")[0] + " st";
    } else if (o.address.indexOf(" st") !== -1) {
      addressToForward = o.address.split("st")[0] + " st";
    } else if (o.address.indexOf(" Str") !== -1) {
      addressToForward = o.address.split("Str")[0] + " st";
    } else if (o.address.indexOf(" str") !== -1) {
      addressToForward = o.address.split("str")[0] + " st";
    } else if (o.address.indexOf(" STR") !== -1) {
      addressToForward = o.address.split("STR")[0] + " st";
    } else if (o.address.indexOf(" ST") !== -1) {
      addressToForward = o.address.split("ST")[0] + " st";
    }
    //rOAD CHECK
    else if (o.address.indexOf(" Road") !== -1) {
      addressToForward = o.address.split(" Road")[0] + " rd";
    } else if (o.address.indexOf(" road") !== -1) {
      addressToForward = o.address.split(" road")[0] + " rd";
    } else if (o.address.indexOf(" rd") !== -1) {
      addressToForward = o.address.split(" rd")[0] + " rd";
    } else if (o.address.indexOf(" Rd") !== -1) {
      addressToForward = o.address.split(" Rd")[0] + " rd";
    } else if (o.address.indexOf(" RD") !== -1) {
      addressToForward = o.address.split(" RD")[0] + " rd";
    }

    //lane check
    else if (o.address.indexOf("Lane") !== -1) {
      addressToForward = o.address.split("Lane")[0] + "Ln";
    } else if (o.address.indexOf("lane") !== -1) {
      addressToForward = o.address.split("lane")[0] + "Ln";
    } else if (o.address.indexOf(" Ln") !== -1) {
      addressToForward = o.address.split(" Ln")[0] + " Ln";
    } else if (o.address.indexOf(" ln") !== -1) {
      addressToForward = o.address.split(" ln")[0] + " Ln";
    } else if (o.address.indexOf(" LN") !== -1) {
      addressToForward = o.address.split(" LN")[0] + " Ln";
    }

    //circle check
    else if (o.address.indexOf("Circle") !== -1) {
      addressToForward = o.address.split("Circle")[0] + " cir";
    } else if (o.address.indexOf("circle") !== -1) {
      addressToForward = o.address.split("circle")[0] + " cir";
    }

    // place check
    else if (o.address.indexOf("Place") !== -1) {
      addressToForward = o.address.split("Place")[0] + "pl";
    } else if (o.address.indexOf("place") !== -1) {
      addressToForward = o.address.split("place")[0] + "pl";
    } else if (o.address.indexOf(" PL") !== -1) {
      addressToForward = o.address.split(" PL")[0] + " pl";
    } else {
      let items = [
        " your home",
        " your residence",
        " your property",
        " your house",
      ];
      addressToForward = items[Math.floor(Math.random() * items.length)];
    }
  }

  let title = o.title ? o.title : "Mx.";
  let last_name = o.lastname ? o.lastname : "";
  let email = o.email ? o.email : "";
  let state = o.state ? o.state : "";
  let city = o.city ? o.city : "";
  let carrier =
    o.carrier === "Other" || o.carrier === "other" ? "mobile" : o.carrier;
  let first_name = o.firstname ? o.firstname : "Mate";
  newMessage = newMessage
    .replace("{first_name}", first_name)
    .replace("{last_name}", last_name)
    .replace("{random_name}", generateRandomName())
    .replace("{random_name}", generateRandomName())
    .replace("{address}", capitalizeFirstName(addressToForward))
    .replace("{4_random_digits}", getRandomInt(2000, 5000))
    .replace("{multiples_of_5_5k}", return5kMultiplesRandom())
    .replace("{multiples_of_5_10k}", return10MultiplesRandom())
    .replace("{city}", city)
    .replace("{title}", title)
    .replace("{carrier}", carrier)
    .replace("{email}", email)
    .replace("{state}", state)
    .replace("Your Home", "your home")
    .replace("Your House", "your house")
    .replace("Your Residence", "your residence")
    .replace("Your Property", "your property")

    .replace("{domain}", `${domain}/${shortid}`);

  return newMessage;
}

function return5kMultiplesRandom() {
  return fiveIncrements[
    Math.floor(Math.random() * fiveIncrements.length)
  ].toString();
}

function return10MultiplesRandom() {
  return tenIncrements[
    Math.floor(Math.random() * tenIncrements.length)
  ].toString();
}
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function capitalizeFirstName(Words) {
  if (Words == undefined) {
    return "";
  }
  let WordArray = [];
  Words.split(" ").forEach((word) => {
    if (typeof word === "string") {
      let lowerCase = word.toLowerCase();
      if (lowerCase[0] === undefined) return "";
      WordArray.push(
        lowerCase[0].toUpperCase() + lowerCase.substring(1, lowerCase.length)
      );
    } else {
      WordArray.push("");
    }
  });
  return WordArray.join(" ");
}

function getIndicesOf(searchStr, str, caseSensitive) {
  var searchStrLen = searchStr.length;
  if (searchStrLen == 0) {
    return [];
  }
  var startIndex = 0,
    index,
    indices = [];
  if (!caseSensitive) {
    str = str.toLowerCase();
    searchStr = searchStr.toLowerCase();
  }
  while ((index = str.indexOf(searchStr, startIndex)) > -1) {
    indices.push(index);
    startIndex = index + searchStrLen;
  }
  return indices;
}

function generateRandomName() {
  return faker.fake("{{name.firstName}}");
}

module.exports = { refinemessage, randomizefoundpipes };
