import jwt from "jsonwebtoken";

const jwtSecretKey = "put your secret key on environment!";

export default async (req, res, next) => {
  const token = req.get("Authorization");
  if (!token || token === "") {
    req.isAuth = false;
    return next();
  }

  let decoded;
  try {
    decoded = await jwt.verify(token, jwtSecretKey);
  } catch (error) {
    req.isAuth = false;
    return next();
  }

  if (!decoded) {
    req.isAuth = false;
    return next();
  }

  req.isAuth = true;
  req.user = decoded.user;
  return next();
};
