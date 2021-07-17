const { findoneuser } = require("../services/user.service");
const { errorreturn } = require("../utils/returnerrorschema");

module.exports = async (req, res, next) => {
  try {
    const user = await findoneuser({ _id: req.user.id });

    if (!user.premium) {
      return errorreturn(
        res,
        400,
        "You are not authorized to make this action because you are not a premium user"
      );
    }
    console.log(user, user.servername, 150809);
    if (!user.admin) {
      console.log(user);
      return errorreturn(
        res,
        400,
        "You are not authorized to make this action because you are not an admin user"
      );
    }

    req.servername = user.servername;
    next();
  } catch (error) {
    console.log(error);
    return errorreturn(res, 400, "Error occured in verifying user");
  }
};
