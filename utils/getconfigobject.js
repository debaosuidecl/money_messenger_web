module.exports = (resultofvariablereplacement) => {
  let finalpostbody = {};
  for (let i = 0; i < resultofvariablereplacement.length; i++) {
    finalpostbody[resultofvariablereplacement[i].key] =
      resultofvariablereplacement[i].value;
  }

  return finalpostbody;
};
