const {
  findsmsroutes,
  findOnesmsroute,
  findAndUpdatesmsroute,
  deletesmsroute,
  createsmsroute,
  sendmessage,
} = require("../services/smsroutes.service");
const escapeRegex = require("../utils/escapeRegex");
const { errorreturn } = require("../utils/returnerrorschema");
const LIMIT = 30;

const axios = require("axios");
const { validationResult } = require("express-validator");
const getconfigobject = require("../utils/getconfigobject");
const { replacevariables } = require("../utils/replacevariables");
const {
  bind,
  connectsmpp,
  sendmessagesmpp,
} = require("../helperfunctions/smppfunc");
const {
  findOnesendingphonegroup,
} = require("../services/sendingphonesgroup.service");

async function findrouteshandler(req, res) {
  const { page = 0, limit = 30, searchvalue } = req.query;

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

  try {
    const smsroutes = await findsmsroutes(yourquery, LIMIT, page);

    res.json(smsroutes);
  } catch (error) {
    res.status(400).send({
      errors: [{ msg: "Server Error" }],
    });
  }
}
async function editsmsroutehandler(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    let { name } = req.body;
    const smsroute = await findOnesmsroute({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!smsroute) {
      return res.status(400).json({
        errors: [
          {
            error: true,
            msg: "SMSROUTE Doesn't exist",
          },
        ],
      });
    }

    const updatesmsroute = await findAndUpdatesmsroute(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      {
        name,
      },
      "set"
    );

    //   console.log(updatesmsroute, "smsroute update data");
    res.json(updatesmsroute);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: true,
      message: "An error occured. try again later please",
    });
  }
}

async function fuzzysearchsmsroutehandler(req, res) {
  if (req.query.value) {
    const regex = new RegExp(escapeRegex(req.query.value), "gi");
    const smsroutes = await findsmsroutes(
      {
        user: req.user.id,
        name: regex,
      },
      LIMIT,
      req.query.page
    );

    res.send(smsroutes);
  } else {
    const smsroutes = await findsmsroutes(
      {
        user: req.user.id,
      },
      LIMIT,
      req.query.page
    );
    res.send(smsroutes);
  }
}

async function deleteroutehandler(req, res) {
  try {
    const smsroute = await findOnesmsroute({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!smsroute) {
      return res.status(400).json({
        errors: [
          {
            error: true,
            msg: "Dataowner Doesn't exist",
          },
        ],
      });
    }

    const smsroutedelete = await deletesmsroute({
      _id: req.params.id,
      user: req.user.id,
    });

    console.log(smsroutedelete, "SMSROUTE delete data");

    res.json(smsroutedelete);
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

async function findsingleroute(req, res) {
  try {
    if (req.params.id.length < 24 || req.params.id.length > 24) {
      return res.send({
        // success: false
      });
    }
    const smsroute = await findOnesmsroute({
      user: req.user.id,
      _id: req.params.id,
    });

    if (!smsroute) {
      return res.send({});
    }

    res.send(smsroute);
  } catch (error) {
    console.log(error);
    res.status(500).json([{ msg: "Server Error" }]);
  }
}
async function createsmsroutehandler(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { name, routetype, username, password, endpoint, bindtype, port } =
      req.body;

    if (routetype === "API") {
      const smsroute = await createsmsroute({
        name,
        routetype,
        user: req.user.id,
      });

      return res.json(smsroute);
    }

    if (routetype === "SMPP") {
      const smsroute = await createsmsroute({
        name,
        routetype,
        user: req.user.id,
        config: {
          user: username,
          pass: password,
          endpoint,
          bindType: bindtype,
          port: parseInt(port),
        },
      });

      res.json(smsroute);
    }

    //   await smsroute.save();
  } catch (error) {
    console.log(error);

    res.status(400).json({
      errors: [
        {
          error: true,
          msg: "Unable to store route",
          errorMessage: error,
        },
      ],
    });
  }
}

async function editsmppconfighandler(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { user, pass, endpoint, bindType, port } = req.body;

    const smsroute = await findAndUpdatesmsroute(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      {
        config: {
          user: user,
          pass,
          endpoint,
          bindType,
          port: parseInt(port),
        },
      },
      "set"
    );

    if (!smsroute) {
      return errorreturn(res, 401, "Could not update schema");
    }
    res.json(smsroute);

    //   await smsroute.save();
  } catch (error) {
    console.log(error);

    res.status(400).json({
      errors: [
        {
          error: true,
          msg: "Unable to store route",
          errorMessage: error,
        },
      ],
    });
  }
}
async function editurlhandler(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    // find smsroute

    const { sendsmsurl, sendsmsmethod } = req.body;
    const smsroute = await findOnesmsroute({
      user: req.user.id,
      _id: req.params.id,
    });

    if (!smsroute) {
      return res.status(400).json({
        errors: [
          {
            error: true,
            msg: "SMS ROUTE NOT FOUND",
          },
        ],
      });
    }

    const updateres = await findAndUpdatesmsroute(
      {
        user: req.user.id,
        _id: req.params.id,
      },
      {
        sendsmsurl,
        sendsmsmethod,
      },
      "set"
    );

    res.send(updateres);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      errors: [
        {
          error: true,
          msg: "A server error occured please try again later",
          errorMessage: error,
        },
      ],
    });
  }
}
async function editheaderhandler(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    // find smsroute

    const { key, value } = req.body;
    const smsroute = await findOnesmsroute({
      user: req.user.id,
      _id: req.params.id,
    });

    if (!smsroute) {
      return res.status(400).json({
        errors: [
          {
            error: true,
            msg: "SMS ROUTE NOT FOUND",
          },
        ],
      });
    }

    const newheader = {
      key,
      value,
    };
    const updateres = await findAndUpdatesmsroute(
      {
        user: req.user.id,
        _id: req.params.id,
      },
      {
        smsheaders: newheader,
      },
      "push"
    );

    if (!updateres) {
      return res.status(401).json({
        errors: [
          {
            error: true,
            msg: "Could not update smsroute",
          },
        ],
      });
    }
    res.send(updateres);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      errors: [
        {
          error: true,
          msg: "A server error occured please try again later",
          errorMessage: error,
        },
      ],
    });
  }
}

async function deleteheader(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    // find smsroute

    const { key, value, id } = req.body;
    const smsroute = await findOnesmsroute({
      user: req.user.id,
      _id: req.params.id,
    });

    if (!smsroute) {
      return res.status(400).json({
        errors: [
          {
            error: true,
            msg: "SMS ROUTE NOT FOUND",
          },
        ],
      });
    }
    //@ts-ignore

    if (!smsroute.smsheaders) {
      return res.status(400).json({
        errors: [
          {
            error: true,
            msg: "No SMS Headers exist",
          },
        ],
      });
    }

    //   console.log(id);

    const updateres = await findAndUpdatesmsroute(
      {
        user: req.user.id,
        _id: req.params.id,
        //   "smsheaders._id": id,
      },
      {
        smsheaders: {
          _id: id,
        },
      },
      "pull"
    );

    if (!updateres) {
      res.status(401).json({
        errors: [
          {
            error: true,
            msg: "Could not find smsroute",
          },
        ],
      });
    }
    console.log(updateres);

    res.send(updateres);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      errors: [
        {
          error: true,
          msg: "A server error occured please try again later",
          errorMessage: error,
        },
      ],
    });
  }
}

async function addpostbodyhandler(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    // find smsroute

    const { key, value } = req.body;
    const smsroute = await findOnesmsroute({
      user: req.user.id,
      _id: req.params.id,
    });

    if (!smsroute) {
      return res.status(401).json({
        errors: [
          {
            error: true,
            msg: "SMS ROUTE NOT FOUND",
          },
        ],
      });
    }

    const newpostbody = {
      key,
      value,
    };
    const updateres = await findAndUpdatesmsroute(
      {
        user: req.user.id,
        _id: req.params.id,
      },
      {
        postbody: newpostbody,
      },
      "push"
    );

    if (!updateres) {
      return res.status(401).json({
        errors: [
          {
            error: true,
            msg: "Could not add postbody",
          },
        ],
      });
    }

    res.send(updateres);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      errors: [
        {
          error: true,
          msg: "A server error occured please try again later",
          errorMessage: error,
        },
      ],
    });
  }
}

async function editpostbody(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    // find smsroute

    const { key, value, id } = req.body;
    const smsroute = await findOnesmsroute({
      user: req.user.id,
      _id: req.params.id,
    });

    if (!smsroute) {
      return res.status(400).json({
        errors: [
          {
            error: true,
            msg: "SMS ROUTE NOT FOUND",
          },
        ],
      });
    }
    //@ts-ignore

    if (!smsroute.postbody) {
      return res.status(400).json({
        errors: [
          {
            error: true,
            msg: "No SMS Headers exist",
          },
        ],
      });
    }

    const updateres = await findAndUpdatesmsroute(
      {
        user: req.user.id,
        _id: req.params.id,
        "postbody._id": id,
      },
      {
        "postbody.$.key": key,
        "postbody.$.value": value,
      },
      "set"
    );

    res.send(updateres);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      errors: [
        {
          error: true,
          msg: "A server error occured please try again later",
          errorMessage: error,
        },
      ],
    });
  }
}

async function deletepostbodyhandler(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    // find smsroute

    const { key, value, id } = req.body;
    const smsroute = await findOnesmsroute({
      user: req.user.id,
      _id: req.params.id,
    });

    if (!smsroute) {
      return res.status(400).json({
        errors: [
          {
            error: true,
            msg: "SMS ROUTE NOT FOUND",
          },
        ],
      });
    }

    //@ts-ignore
    if (!smsroute.postbody) {
      return res.status(400).json({
        errors: [
          {
            error: true,
            msg: "No SMS Post body exist",
          },
        ],
      });
    }

    const updateres = await findAndUpdatesmsroute(
      {
        user: req.user.id,
        _id: req.params.id,
      },
      {
        postbody: {
          _id: id,
        },
      },
      "pull"
    );

    res.send(updateres);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      errors: [
        {
          error: true,
          msg: "A server error occured please try again later",
          errorMessage: error,
        },
      ],
    });
  }
}

async function setauthhandler(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    // find smsroute

    const { key, value } = req.body;
    const smsroute = await findOnesmsroute({
      user: req.user.id,
      _id: req.params.id,
    });

    if (!smsroute) {
      return res.status(400).json({
        errors: [
          {
            error: true,
            msg: "SMS ROUTE NOT FOUND",
          },
        ],
      });
    }

    const updateres = await findAndUpdatesmsroute(
      {
        user: req.user.id,
        _id: req.params.id,
      },
      {
        smsauthusername: key,
        smsauthpassword: value,
      },
      "set"
    );

    res.send(updateres);

    if (!updateres) {
      return res.status(500).json({
        errors: [
          {
            error: true,
            msg: "No SMS Route found",
          },
        ],
      });
    }
  } catch (error) {
    console.log(error);

    res.status(500).json({
      errors: [
        {
          error: true,
          msg: "A server error occured please try again later",
          errorMessage: error,
        },
      ],
    });
  }
}
async function setroutespeedhandler(req, res) {
  console.log(req.body);
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    // find smsroute

    const { speed } = req.body;
    const smsroute = await findOnesmsroute({
      user: req.user.id,
      _id: req.params.id,
    });
    console.log(smsroute, 709);

    if (!smsroute) {
      return res.status(400).json({
        errors: [
          {
            error: true,
            msg: "SMS ROUTE NOT FOUND",
          },
        ],
      });
    }

    const updateres = await findAndUpdatesmsroute(
      {
        user: req.user.id,
        _id: req.params.id,
      },
      {
        defaultsendspeed: speed,
      },
      "set"
    );

    console.log(updateres);
    if (!updateres) {
      return res.status(401).json({
        errors: [
          {
            error: true,
            msg: "Could not set speed",
          },
        ],
      });
    }
    res.send(updateres);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      errors: [
        {
          error: true,
          msg: "A server error occured please try again later",
          errorMessage: error,
        },
      ],
    });
  }
}

async function deleteauthhandler(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    // find smsroute

    const { key, value, id } = req.body;
    const smsroute = await findOnesmsroute({
      user: req.user.id,
      _id: req.params.id,
    });

    if (!smsroute) {
      return res.status(400).json({
        errors: [
          {
            error: true,
            msg: "SMS ROUTE NOT FOUND",
          },
        ],
      });
    }

    const updateres = await findAndUpdatesmsroute(
      {
        user: req.user.id,
        _id: req.params.id,
      },
      {
        smsauthusername: "",
        smsauthpassword: "",
      },
      "set"
    );
    if (!updateres) {
      return res.status(401).json({
        errors: [
          {
            error: true,
            msg: "Could not delete auth credentials",
          },
        ],
      });
    }
    res.send(updateres);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      errors: [
        {
          error: true,
          msg: "A server error occured please try again later",
          errorMessage: error,
        },
      ],
    });
  }
}

async function testsmsroutehandler(req, res) {
  // axios

  try {
    const {
      fromphone,
      tophone,

      message,
    } = req.body;

    console.log(req.body);
    const smsroute = await findOnesmsroute({
      user: req.user.id,
      _id: req.params.id,
    });

    console.log(smsroute, "sms route");

    if (!smsroute) {
      return res.status(400).json({
        errors: [
          {
            error: true,
            msg: "SMS ROUTE NOT FOUND",
          },
        ],
      });
    }
    //@ts-ignore
    if (!smsroute.sendsmsurl || !smsroute.sendsmsmethod) {
      return res.status(400).json({
        errors: [
          {
            msg: "SMS URL AND METHOD REQUIRED",
          },
        ],
      });
    }
    let finalpostbody = undefined;

    //@ts-ignore
    if (smsroute.postbody) {
      finalpostbody = getconfigobject(
        //@ts-ignore
        replacevariables(smsroute.postbody, message, fromphone, tophone)
      );
    }
    let headers = undefined;
    //@ts-ignore

    if (smsroute.smsheaders && smsroute.smsheaders.length > 0) {
      headers = getconfigobject(
        //@ts-ignore
        replacevariables(smsroute.smsheaders, message, fromphone, tophone)
      );
    }

    let authcredexist = false;
    //@ts-ignore
    if (smsroute.smsauthpassword && smsroute.smsauthusername) {
      authcredexist = true;
    }

    let axiosObject = {
      //@ts-ignore
      method: smsroute.sendsmsmethod
        ? //@ts-ignore
          smsroute.sendsmsmethod.toLowerCase()
        : undefined,
      url: replacevariables(
        //@ts-ignore
        smsroute.sendsmsurl,
        encodeURIComponent(message),
        fromphone,
        tophone
      ),
      data: finalpostbody ? finalpostbody : undefined,
      auth: authcredexist
        ? {
            //@ts-ignore
            username: smsroute.smsauthusername,
            //@ts-ignore
            password: smsroute.smsauthpassword,
          }
        : undefined,
      //@ts-ignore

      headers:
        //@ts-ignore
        smsroute.smsheaders && smsroute.smsheaders.length ? headers : undefined,
    };

    try {
      //@ts-ignore
      const { data, status } = await axios(axiosObject);

      res.send({ data, status });
    } catch (error) {
      res.send({
        error: error.response.data,
        status: error.response.status,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      errors: [
        {
          msg: "A server Error occured",
        },
      ],
    });
  }
}

async function testsmsroutehandlersmpp(req, res) {
  try {
    const {
      fromphone,
      tophone,

      message,
    } = req.body;

    console.log(req.body);
    const smsroute = await findOnesmsroute({
      user: req.user.id,
      _id: req.params.id,
    });

    console.log(smsroute, "sms route");

    if (!smsroute) {
      return errorreturn(res, 404, "SMS ROUTE NOT FOUND");
    }

    if (smsroute.routetype !== "SMPP") {
      return errorreturn(res, 401, "ROUTE IS NOT AN SMPP ROUTE");
    }

    // create session
    let session;

    try {
      // console.log(session, "fetching");
      session = await connectsmpp(smsroute.config);
      // console.log(session, "gotten");
    } catch (error) {
      return errorreturn(res, 401, "could not connect to SMPP SERVER");
    }

    // console.log(sesssion)

    if (!session) {
      return errorreturn(res, 401, "COULD NOT CONNECT SMPP SESSION");
    }

    // BIND SESSION

    let bindval;

    try {
      // console.log("binding", bindval);
      bindval = await bind(session, smsroute.config);
      // console.log("binded", bindval);
    } catch (error) {
      console.log(error);

      if (error.pducode) {
        return errorreturn(res, 401, JSON.stringify(error));
      }
      return errorreturn(
        res,
        401,
        "Binding Failed; error caught by error listener"
      );
    }

    // console.log(bindval, "binding value");
    if (!bindval) {
      return errorreturn(res, 401, "COULD NOTE BIND SMPP SESSION");
    }

    // submit message

    const messageresult = await sendmessagesmpp(
      session,
      fromphone,
      tophone,
      message
    );

    res.json(messageresult);
  } catch (e) {
    return errorreturn(res, 500, "could not initate test");
  }
}

async function checkhasphonegrouphandler(req, res) {
  try {
    const phonegroup = await findOnesendingphonegroup({
      route: req.params.routeid,
      user: req.user.id,
      $or: [{ status: "done" }, { status: "scheduled" }],
    });

    console.log(phonegroup, "phone group");

    res.send({
      phonegroup,
    });
  } catch (error) {
    res.status(500).send({
      errors: [
        {
          msg: "Server error",
        },
      ],
    });
  }
}
module.exports = {
  findrouteshandler,
  editsmsroutehandler,
  deleteroutehandler,
  fuzzysearchsmsroutehandler,
  findsingleroute,
  createsmsroutehandler,
  editurlhandler,
  editheaderhandler,
  deleteheader,
  addpostbodyhandler,
  editpostbody,
  deletepostbodyhandler,
  setauthhandler,
  setroutespeedhandler,
  deleteauthhandler,
  editsmppconfighandler,
  testsmsroutehandler,
  checkhasphonegrouphandler,
  testsmsroutehandlersmpp,
};
