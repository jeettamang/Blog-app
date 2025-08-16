import UserModel from "../modules/user/user.model.js";
import { verifyJWT } from "./token.js";

const secureAPI = (sysRoles = []) => {
  return async (req, res, next) => {
    try {
      const { access_token = null } = req.headers;
      console.log({ Token: access_token });
      if (!access_token) throw new Error("Token is missing");
      console.log({ AcessToken: access_token });
      const { data, exp } = verifyJWT(access_token);
      const currentTime = Math.ceil(Date.now() / 1000);
      if (currentTime > exp) throw new Error("Token has expired");
      const { email } = data;
      const user = await UserModel.findOne({
        email,
        isActive: true,
        isEmailVerified: true,
      });
      console.log(user);
      if (!user) throw new Error("User not found");
      if (sysRoles.length == 0) {
        next();
      } else {
        const isValidRole = sysRoles.some((role) => user?.roles.includes(role));
        if (!isValidRole) throw new Error("User is unauthorized");
        next();
      }
    } catch (error) {
      next(error);
    }
  };
};

export { secureAPI };
