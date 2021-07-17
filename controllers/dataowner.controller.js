const {
  finddataowners,
  findOnedataowner,
  findAndUpdatedataowner,
  deletedataowner,
  createdataowner,
} = require("../services/dataowner.service");
const escapeRegex = require("../utils/escapeRegex");
const { validationResult } = require("express-validator");

const LIMIT = 30;
async function findDataOwnerHandler(req, res) {
  const { page = 0, limit = LIMIT, searchvalue } = req.query;

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
    const myprofitsharers = await finddataowners(yourquery, limit, page);
    res.json(myprofitsharers);
  } catch (error) {
    res.status(400).send({
      errors: [{ msg: "Server Error" }],
    });
  }
}

async function findSingleDataOwnerHandler(req, res) {
  const { page = 0, limit = LIMIT } = req.query;

  try {
    const datasuppliers = await finddataowners(
      {
        user: req.user.id,
        name: req.query.value,
      },
      limit,
      page
    );

    res.json(datasuppliers);
  } catch (error) {
    res.status(400).send({
      errors: [{ msg: "Server Error" }],
    });
  }
}

async function fuzzySearchDataownerHandler(req, res) {
  if (req.query.value) {
    const regex = new RegExp(escapeRegex(req.query.value), "gi");
    const datasuppliers = await finddataowners(
      {
        user: req.user.id,
        name: regex,
      },
      LIMIT,
      req.query.page
    );

    res.send(datasuppliers);
  } else {
    const datasuppliers = await finddataowners(
      {
        user: req.user.id,
      },
      LIMIT,
      req.query.page
    );

    res.send(datasuppliers);
  }
}

async function editDataownerHandler(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    let { name } = req.body;
    const dataowner = await findOnedataowner({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!dataowner) {
      return res.status(400).json({
        errors: [
          {
            error: true,
            msg: "Dataowner Doesn't exist",
          },
        ],
      });
    }

    const updateDataOwner = await findAndUpdatedataowner(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      {
        name,
      },
      "set"
    );

    console.log(updateDataOwner, "dataowner update data");
    res.json(updateDataOwner);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: true,
      message: "An error occured. try again later please",
    });
  }
}

async function deletedataownerhandler(req, res) {
  try {
    const dataowner = await findOnedataowner({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!dataowner) {
      return res.status(400).json({
        errors: [
          {
            error: true,
            msg: "Dataowner Doesn't exist",
          },
        ],
      });
    }

    const deleteDataowner = await deletedataowner({
      _id: req.params.id,
      user: req.user.id,
    });

    console.log(deleteDataowner, "dataowner delete data");

    res.json(deleteDataowner);
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
async function createdataownerhandler(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { name } = req.body;
    const newProfitSharer = await createdataowner({
      name,
      user: req.user.id,
    });

    res.json(newProfitSharer);
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
  findDataOwnerHandler,
  findSingleDataOwnerHandler,
  fuzzySearchDataownerHandler,
  editDataownerHandler,
  deletedataownerhandler,
  createdataownerhandler,
};
