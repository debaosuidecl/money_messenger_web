const {
  finddomaingroups,
  findOnedomaingroup,
  findAndUpdatedomaingroup,
  deletedomaingroup,
  createdomaingroup,
} = require("../services/domaingroup.service");
const escapeRegex = require("../utils/escapeRegex");
const { validationResult } = require("express-validator");

const LIMIT = 30;
async function finddomaingroupshandlers(req, res) {
  const { page = 0, limit = 30, searchvalue, removenonetraffic } = req.query;

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

  if (removenonetraffic) {
    yourquery = {
      ...yourquery,
      traffic: { $ne: null },
      dataowner: { $ne: null },
    };
  }

  try {
    const domaingroups = await finddomaingroups(yourquery, LIMIT, page);
    console.log(domaingroups);

    res.json(domaingroups);
  } catch (error) {
    res.status(400).send({
      errors: [{ msg: "Server Error" }],
    });
  }
}

async function fuzzysearchdomaingroupshandler(req, res) {
  if (req.query.value) {
    const regex = new RegExp(escapeRegex(req.query.value), "gi");
    const domaingroups = await finddomaingroups(
      { user: req.user.id, name: regex },
      LIMIT,
      req.query.page
    );

    res.send(domaingroups);
  } else {
    const domaingroups = await finddomaingroups(
      { user: req.user.id },
      LIMIT,
      req.query.page
    );

    res.send(domaingroups);
  }
}
async function findonedomaingrouphandler(req, res) {
  const { page = 0, limit = LIMIT } = req.query;

  try {
    const domaingroups = await finddomaingroups(
      {
        user: req.user.id,
        name: req.query.value,
      },
      LIMIT,
      page
    );
    console.log(domaingroups, "80");
    res.json(domaingroups);
  } catch (error) {
    res.status(400).send({
      errors: [{ msg: "Server Error" }],
    });
  }
}

async function editdomaingrouphandler(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    let { name, rotationnumber } = req.body;
    const domaingroup = await findOnedomaingroup({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!domaingroup) {
      return res.status(400).json({
        errors: [
          {
            error: true,
            msg: "domaingroup Doesn't exist",
          },
        ],
      });
    }

    const updatedomaingroup = await findAndUpdatedomaingroup(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      {
        name,
        rotationnumber,
      },
      "set"
    );

    // console.log(updatedomaingroup, "domaingroup update data");
    res.json(updatedomaingroup);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: true,
      message: "An error occured. try again later please",
    });
  }
}

async function deletedomaingrouphandler(req, res) {
  try {
    const domaingroup = await findOnedomaingroup({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!domaingroup) {
      return res.status(400).json({
        errors: [
          {
            error: true,
            msg: "domaingroup Doesn't exist",
          },
        ],
      });
    }

    const deleted = await deletedomaingroup({
      _id: req.params.id,
      user: req.user.id,
    });

    res.json(deleted);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      errors: [
        {
          msg: "An error occured. try again later please",
        },
      ],
    });
  }
}

async function createdomaingrouphandler(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { name, rotationnumber } = req.body;
    const created = await createdomaingroup({
      name,
      rotationnumber,
      user: req.user.id,
    });

    res.json(created);
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
  finddomaingroupshandlers,
  findonedomaingrouphandler,
  fuzzysearchdomaingroupshandler,
  editdomaingrouphandler,
  deletedomaingrouphandler,
  createdomaingrouphandler,
};
