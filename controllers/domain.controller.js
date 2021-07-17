const {
  findnamecheapcredential,
  finddomains,
  createNamecheapConfig,
  updatenamecheapcredentials,
} = require("../services/domain.service");
const tldList = require("../models/_tldList");
const { validationResult } = require("express-validator");

const escapeRegex = require("../utils/escapeRegex");
const methods = ["namecheap"];
const LIMIT = 30;
async function checkconfigurationstatushandler(req, res) {
  try {
    if (methods.indexOf(req.params.id) === -1) {
      return res.status(400).send({
        errors: [
          {
            msg: "Method does not exist",
          },
        ],
      });
    }

    const namecheapcred = await findnamecheapcredential({
      user: req.user.id,
    });

    res.json(namecheapcred);
  } catch (error) {
    res.status(400).send({
      errors: [{ msg: "Server Error" }],
    });
  }
}
async function finddomainshandler(req, res) {
  const { page = 0, limit = 30, searchvalue } = req.query;
  console.log(req.query);

  let yourquery = {
    user: req.user.id,
  };

  if (searchvalue) {
    const regex = new RegExp(escapeRegex(req.query.searchvalue), "gi");

    yourquery = {
      user: req.user.id,
      name: regex,
    };
  }

  try {
    const domains = await finddomains(yourquery, LIMIT, page);
    // console.log(domains);

    res.json(domains);
  } catch (error) {
    res.status(400).send({
      errors: [{ msg: "Server Error" }],
    });
  }
  //   const { page = 1, limit = 30 } = req.query;

  //   try {
  //     const domains = finddomains(
  //       {
  //         user: req.user.id,
  //       },
  //       LIMIT,
  //       page
  //     );
  //     console.log(domains);
  //     res.json(domains);
  //   } catch (error) {
  //     res.status(400).send({
  //       errors: [{ msg: "Server Error" }],
  //     });
  //   }
}

async function fuzzysearchdomainshandler(req, res) {
  if (req.query.value) {
    const regex = new RegExp(escapeRegex(req.query.value), "gi");
    const domains = await finddomains(
      { user: req.user.id, name: regex },
      LIMIT,
      req.query.page
    );

    res.send(domains);
  } else {
    const domains = await finddomains(
      { user: req.user.id },
      LIMIT,
      req.query.page
    );

    res.send(domains);
  }
}

async function gettldlist(_, res) {
  res.send(tldList);
}

async function configureapikey(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { apikey, username } = req.body;

    let alreadyexists = await findnamecheapcredential({
      user: req.user.id,
    });

    if (alreadyexists) {
      // update credentials
      let updatedcredentials = await updatenamecheapcredentials(
        {
          user: req.user.id,
        },
        {
          apikey,
          username,
        },

        "set"
      );

      return res.json(updatedcredentials);
    }

    const namecheapcred = await createNamecheapConfig({
      apikey,
      user: req.user.id,
      username,
    });

    res.json(namecheapcred);
  } catch (error) {
    console.log(error);

    res.status(400).json({
      errors: [
        {
          error: true,
          msg: "Unable to store user",
          errorMessage: error,
        },
      ],
    });
  }
}
module.exports = {
  checkconfigurationstatushandler,
  finddomainshandler,
  fuzzysearchdomainshandler,
  gettldlist,
  configureapikey,
};
