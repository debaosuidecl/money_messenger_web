const {
  findmessageschemas,
  findOnemessageschema,
  createpipelineschema,
  findpipelines,
  updatepipeline,
  deletepipeline,
  findAndUpdatemessageschema,
  deletemessageschema,
  createmessageschema,
} = require("../services/message.service");
const escapeRegex = require("../utils/escapeRegex");
const LIMIT = 30;

const { validationResult } = require("express-validator");
const { errorreturn } = require("../utils/returnerrorschema");

async function findmessageschemashandler(req, res) {
  const { page = 0, limit = 30, searchvalue } = req.query;

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
    const mymessageschema = await findmessageschemas(yourquery, LIMIT, page);

    res.json(mymessageschema);
  } catch (error) {
    res.status(400).send({
      errors: [{ msg: "Server Error" }],
    });
  }
}
async function fuzzysearchmessageschemahandler(req, res) {
  if (req.query.value) {
    const regex = new RegExp(escapeRegex(req.query.value), "gi");
    const domaingroups = await findmessageschemas(
      {
        user: req.user.id,
        name: regex,
      },
      LIMIT,
      req.query.page
    );

    res.send(domaingroups);
  } else {
    const domaingroups = await findmessageschemas(
      {
        user: req.user.id,
      },
      LIMIT,
      req.query.page
    );

    res.send(domaingroups);
  }
}
async function findsinglemessageschemahandler(req, res) {
  // res.send("auth Route");
  console.log(req.params.id);
  try {
    // const { page = 1, limit = 30 } = req.query;

    if (req.params.id.length < 24 || req.params.id.length > 24) {
      return res.send({
        // success: false
      });
    }
    const ms = await findOnemessageschema({
      user: req.user.id,
      _id: req.params.id,
    });

    //   console.log(ms, 68);
    if (!ms) {
      return res.send({
        // success: false
      });
    }

    // res.send();

    res.send(ms);
  } catch (error) {
    console.log(error);
    res.status(500).json([{ msg: "Server Error" }]);
  }
}

async function createpipelinemaphandler(req, res) {
  try {
    const { pipeList, pipeName } = req.body;
    const pipeToSave = await createpipelineschema({
      pipeList,
      name: pipeName,
      user: req.user.id,
    });

    if (!pipeToSave) {
      return res.status(401).send({
        errors: [{ msg: "Could not create pipeline schema" }],
      });
    }

    res.json({
      success: true,
      message: "Pipeline randomization created",
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      errors: [{ msg: "Server Error" }],
    });
  }
}

async function getpipelineshandler(req, res) {
  try {
    const userCreatedSchemas = await findpipelines({
      user: req.user.id,
    });

    res.json(userCreatedSchemas);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      errors: [{ msg: "Server Error" }],
    });
  }
}

async function updatepipelinemaphandler(req, res) {
  const { pipeName, pipeList } = req.body;

  const response = await updatepipeline(
    {
      user: req.user.id,
      _id: req.params.id,
    },
    {
      pipeList,
      name: pipeName,
    },

    "set"
  );

  console.log(response);

  if (!response) {
    return res.status(400).send({
      errors: [
        {
          msg: "Rule Not Found",
        },
      ],
    });
  }

  res.json({
    success: true,
    message: "updated",
  });
}

async function deletepipelinehandler(req, res) {
  try {
    const response = await deletepipeline({
      user: req.user.id,
      _id: req.params.id,
    });

    if (!response) {
      return res.status(400).json({
        errors: [
          {
            error: true,
            msg: "Pipeline does not exist",
          },
        ],
      });
    }
    //   console.log(response);
    res.json({
      success: true,
      message: "deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      errors: [
        {
          error: true,
          msg: "Unable to delete pipeline",
          errorMessage: error,
        },
      ],
    });
  }
}

async function saveschemahandler(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    const response = await findAndUpdatemessageschema(
      {
        user: req.user.id,
        _id: req.params.id,
      },
      {
        messagestructure: req.body.formatSchema,
      },
      "set"
    );

    // console.log(response, 232);
    if (!response) {
      return res.status(400).json({
        errors: [
          {
            error: true,
            msg: "Unable to save pipeline",
          },
        ],
      });
    }

    console.log(response);
    res.json({
      success: true,
      message: "saved",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      errors: [
        {
          error: true,
          msg: "Unable to delete pipeline",
          errorMessage: error,
        },
      ],
    });
  }
}
async function getonehandlermessage(req, res) {
  const { page = 0, limit = 30 } = req.query;

  try {
    const domaingroups = await findmessageschemas(
      {
        user: req.user.id,
        name: req.query.value,
      },
      LIMIT,
      page
    );

    res.json(domaingroups);
  } catch (error) {
    res.status(400).send({
      errors: [{ msg: "Server Error" }],
    });
  }
}
async function editschemahandler(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    let { name } = req.body;
    const domaingroup = await findOnemessageschema({
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

    const updatedmessageschema = await findAndUpdatemessageschema(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      {
        name,
      },
      "set"
    );

    if (!updatedmessageschema) {
      return res.status(401).json({
        error: true,
        message: "Could not edit schema, does not exist, try again later",
      });
    }

    console.log(updatedmessageschema, "domaingroup update data");
    res.json(updatedmessageschema);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: true,
      message: "An error occured. try again later please",
    });
  }
}

async function deletemessageschemahandler(req, res) {
  try {
    const messageschema = await findOnemessageschema({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!messageschema) {
      return res.status(400).json({
        errors: [
          {
            error: true,
            msg: "messageschema Doesn't exist",
          },
        ],
      });
    }

    const deleted = await deletemessageschema({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deleted) {
      return res.status(401).json({
        errors: [
          {
            msg: "Could not find message schema. try again later please",
          },
        ],
      });
    }

    console.log(deleted, "messageschema delete data");

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

async function createmessageschemahandler(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { name } = req.body;
    const messageschema = await createmessageschema({
      name,
      user: req.user.id,
    });

    res.json(messageschema);
  } catch (error) {
    console.log(error);

    res.status(500).json({
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
  findmessageschemashandler,
  findsinglemessageschemahandler,
  fuzzysearchmessageschemahandler,
  createpipelinemaphandler,
  getpipelineshandler,
  updatepipelinemaphandler,
  deletepipelinehandler,
  editschemahandler,
  saveschemahandler,
  deletemessageschemahandler,
  createmessageschemahandler,
  getonehandlermessage,
};
