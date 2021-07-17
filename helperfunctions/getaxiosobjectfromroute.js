function getaxiosobjectfromroute(smsroute, message, fromphone, tophone) {
  let axiosobject = {};
  let errors = [];
  // if (!smsroute) {
  // }

  // console.log(smsroute, message, fromphone, tophone, 9);

  // return;

  if (!smsroute.sendsmsurl || !smsroute.sendsmsmethod) {
    // console.log("There is no SMS URL OR METHOD");
    errors.push("There is no SMS URL OR METHOD");

    return errors;
  }
  let finalpostbody = undefined;
  if (smsroute.postbody) {
    finalpostbody = getConfigObject(
      replacevariables(smsroute.postbody, message, fromphone, tophone)
    );
  }
  let headers = undefined;
  if (smsroute.smsheaders && smsroute.smsheaders.length > 0) {
    headers = getConfigObject(
      replacevariables(smsroute.smsheaders, message, fromphone, tophone)
    );
  }

  let authcredexist = false;

  if (smsroute.smsauthpassword && smsroute.smsauthusername) {
    authcredexist = true;
  }

  axiosobject = {
    method: smsroute.sendsmsmethod
      ? smsroute.sendsmsmethod.toLowerCase()
      : undefined,
    url: replacevariables(
      smsroute.sendsmsurl,
      encodeURIComponent(message),
      fromphone,
      tophone
    ),
    data: finalpostbody ? finalpostbody : undefined,
    auth: authcredexist
      ? {
          username: smsroute.smsauthusername,
          password: smsroute.smsauthpassword,
        }
      : undefined,
    headers:
      smsroute.smsheaders && smsroute.smsheaders.length ? headers : undefined,
  };

  // console.log(axiosobject, 46);

  return axiosobject;
}

function replacevariables(body, message, from, to) {
  return JSON.parse(
    JSON.stringify(body)
      .replace("{message}", message)
      .replace("{from_phone}", from)
      .replace("{to_phone}", to)
  );
}

function getConfigObject(resultofvariablereplacement) {
  let finalpostbody = {};
  for (let i = 0; i < resultofvariablereplacement.length; i++) {
    finalpostbody[resultofvariablereplacement[i].key] =
      resultofvariablereplacement[i].value;
  }

  return finalpostbody;
}
module.exports = getaxiosobjectfromroute;
