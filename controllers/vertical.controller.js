const {
  findVerticals,
  createVertical,
  findAndUpdateVertical,
  deleteVertical,
  findOneVertical,
} = require("../services/vertical.services");
const queryString = require("query-string");
const { validationResult } = require("express-validator");

const LIMIT = 30;

async function fuzzySearchVertical(req, res) {
  if (req.query.value) {
    const regex = new RegExp(escapeRegex(req.query.value), "gi");
    const verticals = await findVerticals(
      {
        user: req.user.id,
        name: regex,
      },
      LIMIT,
      req.query.page
    );
    res.send(verticals);
  } else {
    const verticals = await findVerticals(
      {
        user: req.user.id,
      },
      LIMIT,
      req.query.page
    );

    res.send(verticals);
  }
}

async function verticalCreateHandler(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { name, url } = req.body;

    if (url.toLowerCase().indexOf("{clickid}") === -1) {
      return res.status(400).json([{ msg: "URL must contain {clickid}" }]);
    }

    const querystrings = url.split("?")[1];

    if (!querystrings) {
      return res.status(400).json([{ msg: "No query strings detected" }]);
    }

    // make postback
    console.log(querystrings, "query strings");
    if (querystrings.indexOf("={clickid}") === -1) {
      return res
        .status(400)
        .json([{ msg: "URL string is in an incorrect schema" }]);
    }
    const queryObj = queryString.parseUrl(url).query;

    console.log(queryObj, "qobj");

    const keys = Object.keys(queryObj);
    const values = Object.values(queryObj);

    let postback = `https://moneymessenger.com/api/leadactivity/converter/${req.user.id}?`;

    console.log(values);
    let anyseenimportant = 0;
    for (let i = 0; i < keys.length; i++) {
      if (values[i] === "{campaignid}") {
        postback += `campaignid={${keys[i]}}${
          anyseenimportant <= 0 ? "&" : ""
        }`;
        anyseenimportant++;
      }
      if (values[i] === "{clickid}") {
        postback += `clickid={${keys[i]}}${anyseenimportant <= 0 ? "&" : ""}`;
        anyseenimportant++;
      }
    }

    postback += "&payout={payout}";
    const vertical = await createVertical({
      name,
      url,
      postback,
      user: req.user.id,
    });

    console.log(vertical);

    return res.json(vertical);
  } catch (error) {
    console.log(error);
    res.status(500).json([{ msg: "Server Error" }]);
  }
}

async function getOneVerticalHandler(req, res) {
  const { page = 0, limit = LIMIT } = req.query;

  try {
    const verticals = await findVerticals(
      {
        user: req.user.id,
        name: req.query.value,
      },
      limit,
      page
    );

    res.json(verticals);
  } catch (error) {
    res.status(400).send({
      errors: [{ msg: "Server Error" }],
    });
  }
}

async function verticalEditHandler(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { name, url, postback } = req.body;

    if (
      // url.toLowerCase().indexOf("{campaignid}") === -1 ||
      url.toLowerCase().indexOf("{clickid}") === -1
    ) {
      return res.status(400).json({
        errors: [{ msg: "URL must contain {clickid}" }],
      });
    }

    const querystrings = url.split("?")[1];

    if (!querystrings) {
      return res
        .status(400)
        .json({ errors: [{ msg: "No query strings detected" }] });
    }
    console.log(querystrings, "query strings");
    const queryObj = queryString.parseUrl(url).query;

    console.log(queryObj, "qobj");

    const keys = Object.keys(queryObj);
    const values = Object.values(queryObj);

    let postbackBaseURL = `https://app.powersms.land/api/leadactivity/converters/${req.user.id}`;

    console.log(keys);

    if (
      // values.indexOf("{campaignid}") === -1 ||
      values.indexOf("{clickid}") === -1
    ) {
      return res.status(400).json({
        errors: [
          {
            msg: "Tracking URL must contain  a {clickid} as pixel value",
          },
        ],
      });
    }

    if (postback.split("?")[0] !== postbackBaseURL) {
      // if (postback.indexOf(postbackBaseURL) === -1) {
      return res.status(400).json({
        errors: [
          {
            msg: `The postback base URL must be the same as was previously provided`,
          },
        ],
      });
    }
    console.log(queryString.parseUrl(postback).query, "qpbo");
    const queryPostbackObj = JSON.parse(
      JSON.stringify(queryString.parseUrl(postback).query)
    );

    if (!queryPostbackObj.hasOwnProperty("clickid")) {
      return res.status(400).json({
        errors: [{ msg: "Postback must contain a clickid" }],
      });
    }

    const result = await findAndUpdateVertical(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      {
        name,
        url,
        postback,
      },

      "set"
    );

    if (!result) {
      return res
        .status(401)
        .json({ errors: [{ msg: "Could not find Vertical" }] });
    }
    return res.json(result);

    // const vertical = new Verticals({
    //   name,
    //   url,
    //   postback,
    //   user: req.user.id,
    // });

    // const result = await vertical.save();
    // console.log(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
}

async function deleteVerticalHandler(req, res) {
  try {
    const result = await deleteVertical({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!result) {
      return res.status(400).json({
        errors: [
          {
            msg: "Vertical does not exist",
          },
        ],
      });
    }

    return res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
}

async function findOneVerticalHandler(req, res) {
  try {
    if (req.params.id.length < 24 || req.params.id.length > 24) {
      return res.send({});
    }
    const vertical = await findOneVertical({
      user: req.user.id,
      _id: req.params.id,
    });

    if (!vertical) {
      return res.send({});
    }

    res.send(vertical);
  } catch (error) {
    console.log(error);
    res.status(500).json([{ msg: "Server Error" }]);
  }
}

async function findVerticalsHandler(req, res) {
  try {
    const { page = 0, limit = LIMIT, searchvalue } = req.query;

    // console.log(req.query, page, limit);

    let yourquery = {
      user: req.user.id,
    };

    if (searchvalue) {
      const regex = new RegExp(escapeRegex(searchvalue), "gi");

      yourquery = {
        user: req.user.id,
        name: regex,
      };
    }

    const verticals = await findVerticals(yourquery, limit, parseInt(page));
    // console.log(verticals);
    res.send(verticals);
  } catch (error) {
    res.status(500).json([{ msg: "Server Error" }]);
  }
}
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = {
  fuzzySearchVertical,
  verticalCreateHandler,
  getOneVerticalHandler,
  verticalEditHandler,
  deleteVerticalHandler,
  findOneVerticalHandler,
  findVerticalsHandler,
};
