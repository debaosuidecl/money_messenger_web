const {
  findleadgroups,
  findOneleadgroup,
  createleadgroup,
  deleteleadgroup,
} = require("../services/leadgroup.service");
const escapeRegex = require("../utils/escapeRegex");
const uuidv4 = require("uuid");
const multer = require("multer");
const DIR = "lead-uploads/";
const readOneLine = require("../helperfunctions/readOneLine");
const path = require("path");
const { validationResult } = require("express-validator");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary").v2;
const { findoneuser } = require("../services/user.service");
dotenv.config();
// configure cloudinary with ENV Variables
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});
// @ts-ignore

const socket1 = require("socket.io-client")(
  "http://localhost:" + process.env.uploadleads1 // edit here
);
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    console.log(file);
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, uuidv4.v4() + "-" + fileName);
  },
});

var maxSize = 1 * 20 * 1000 * 1000;

var upload = multer({
  storage: storage,
  limits: {
    fileSize: maxSize,
  },
  fileFilter: (req, file, cb) => {
    console.log(file);
    if (
      file.mimetype == "application/vnd.ms-excel" ||
      file.mimetype == "text/csv"
    ) {
      console.log("Hit here2222");
      cb(null, true);
    } else {
      console.log("there is an error leeeeads");
      //@ts-ignore
      req.mymultererror = "Only CSV Files are allowed";
      cb(null, false);
      // cb(new Error("Only CSV Files are allowed"));
    }
  },
}).single("leads");

const LIMIT = 30;

async function findleadshandler(req, res) {
  const { page = 0, limit = 30, campaigncreation, searchvalue } = req.query;

  let oroptions = campaigncreation
    ? [
        {
          status: "done",
        },
      ]
    : [
        {
          status: "scheduled",
        },

        {
          status: "processing",
        },
        {
          status: "done",
        },
      ];

  let yourquery = {
    user: req.user.id,
    $or: oroptions,
  };

  if (searchvalue) {
    const regex = new RegExp(escapeRegex(req.query.searchvalue), "gi");

    yourquery = {
      user: req.user.id,
      $or: oroptions,

      friendlyname: regex,
    };
    //   console.log(leadgroup);
  }
  try {
    const leadgroup = await findleadgroups(yourquery, LIMIT, page);

    console.log(leadgroup);
    res.json(leadgroup);
  } catch (error) {
    res.status(400).send({
      errors: [{ msg: "Server Error" }],
    });
  }
}

async function findsingleleadhandler(req, res) {
  try {
    if (req.params.id.length < 24 || req.params.id.length > 24) {
      return res.send({});
    }
    const leadgroup = await findOneleadgroup({
      user: req.user.id,
      _id: req.params.id,
    });

    if (!leadgroup) {
      return res.send({});
    }
    res.send(leadgroup);
  } catch (error) {
    console.log(error);
    res.status(500).json([{ msg: "Server Error" }]);
  }
}

async function uploadhandler(req, res) {
  console.log(req.body);

  if (req.mymultererror) {
    return res.status(500).json({
      errors: [{ msg: req.mymultererror }],
    });
  }
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      console.log("a multer error occured");
      return res.status(500).json({
        errors: [{ msg: err }],
      });
    } else if (err) {
      // return res.status(500).json(err);

      return res.status(500).json({
        errors: [{ msg: err }],
      });
    }
  });
  try {
    const firstline = await readOneLine(
      path.join(__dirname, "..", "lead-uploads", req.file.filename)
    );
    let cloudinaryurl = "";
    let cloudinaryid = "";

    try {
      console.log("uploading csv");
      console.time("uploading csv");

      const uploadres = await cloudinary.uploader.upload(
        path.join(__dirname, "..", "lead-uploads", req.file.filename),
        { resource_type: "raw" }
      );
      console.timeEnd("uploading csv");
      console.log(uploadres);

      cloudinaryurl = uploadres.url;
      cloudinaryid = uploadres.public_id;
    } catch (error) {
      console.log(error, 162);
      return res.status(400).json({
        errors: [
          {
            msg: "File upload failed please try again later",
          },
        ],
      });
    }
    console.log(firstline, "firstline");

    if (!firstline) {
      return res.status(400).json({
        errors: [
          {
            msg: "Content not detected",
          },
        ],
      });
    }
    // return;

    // console.log("hit here", req.file);

    let neworiginalname = req.file.originalname;
    //   let friendlyname = generate({ number: true }).dashed;

    let servername = "";

    try {
      const user = await findoneuser({ _id: req.user.id });

      servername = user.servername;
    } catch (error) {
      console.log(error);
    }
    const leadgroupnew = await createleadgroup({
      user: req.user.id,
      friendlyname: req.query.name,
      name: "lead-uploads/" + req.file.filename,
      originalname: neworiginalname,
      headers: firstline.split(","),
      cloudinaryurl,
      cloudinaryid,
      servername,
    });

    //   await leadgroupnew.save();

    res.status(201).send(leadgroupnew);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      errors: [
        {
          msg: "An error occured in upload",
        },
      ],
    });
  }
}

async function scheduleuploadhandler(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    // const { page = 1, limit = 30 } = req.query;

    if (req.params.id.length < 24 || req.params.id.length > 24) {
      return res.send({});
    }
    const leadgroup = await findOneleadgroup({
      user: req.user.id,
      _id: req.params.id,
    });

    if (!leadgroup) {
      return res.status(400).send({
        errors: [
          {
            msg: "Phone group not found",
          },
        ],
      });
    }

    const { phone, firstname, lastname, address, city, state } = req.body;

    const bodyArray = [phone, firstname, lastname, address, city, state].filter(
      (val) => val
    );

    for (let i = 0; i < bodyArray.length; i++) {
      if (leadgroup.headers.indexOf(bodyArray[i]) === -1) {
        return res.status(400).send({
          // success: false

          errors: [
            {
              msg: `header: "${bodyArray[i]}" not found in list`,
            },
          ],
        });
      }
    }

    leadgroup.status = "scheduled";

    leadgroup.headerMaps = {};

    leadgroup.headerMaps.phone = phone;
    leadgroup.headerMaps.firstname = firstname;
    leadgroup.headerMaps.lastname = lastname;
    leadgroup.headerMaps.address = address;
    leadgroup.headerMaps.city = city;
    leadgroup.headerMaps.state = state;
    await leadgroup.save();

    // res.send();

    console.log(leadgroup);

    res.send(leadgroup);

    //   const sm = await ScrubManager.findOne({});
    //   console.log(sm);
    //   if (sm.currentIndex === 1) {
    //     console.log("upload sockettt");
    socket1.emit("scrub", leadgroup);
    //   } else if (sm.currentIndex === 2) {
    //     console.log("upload sockettt2");
    //     socket1.emit("scrub", leadgroup);
    //   } else if (sm.currentIndex === 3) {
    //     socket1.emit("scrub", leadgroup);
    //     console.log("upload sockettt3");
    //   }

    //   if (sm.currentindex < 3) {
    //     sm.currentindex = sm.currentindex + 1;
    //   } else {
    //     sm.currentindex = 1;
    //   }

    //   await sm.save();

    // res.send(phonegroup);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
}

async function fuzzysearchleads(req, res) {
  const { page = 0, limit = 30, campaigncreation, searchvalue } = req.query;

  let oroptions = campaigncreation
    ? [
        {
          status: "done",
        },
      ]
    : [
        {
          status: "scheduled",
        },

        {
          status: "processing",
        },
        {
          status: "done",
        },
      ];

  if (req.query.value) {
    const regex = new RegExp(escapeRegex(req.query.value), "gi");
    const leadsfound = await findleadgroups(
      {
        user: req.user.id,
        friendlyname: regex,
        $or: oroptions,
      },
      LIMIT,
      page
    );

    res.send(leadsfound);
  } else {
    const leadsfound = await findleadgroups(
      {
        user: req.user.id,
        $or: oroptions,
      },
      LIMIT,
      page
    );

    res.send(leadsfound);
  }
}

async function deleteleadgrouphandler(req, res) {
  console.log(req.params);
  try {
    const leadgroupfound = await findAndUpdateleadgroup(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      {
        status: "deleted",
      },
      "set"
    );
    if (!leadgroupfound) {
      return res.status(400).json({
        errors: [
          {
            error: true,
            msg: "Lead Group Doesn't exist",
          },
        ],
      });
    }

    const deleteleadgroupdone = await deleteleadgroup({
      _id: req.params.id,
      user: req.user.id,
    });

    //   console.log(deleteleadgroupdone, "dataowner delete data");

    if (!deleteleadgroupdone) {
      return res.status(401).json({
        errors: [
          {
            msg: "Lead group could not be deleted. try again later please",
          },
        ],
      });
    }

    res.json(deleteleadgroupdone);
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

module.exports = {
  findleadshandler,
  findsingleleadhandler,
  scheduleuploadhandler,
  uploadhandler,
  fuzzysearchleads,
  deleteleadgrouphandler,
};
