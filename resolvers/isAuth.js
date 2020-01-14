const isAuth = req => {
  if (!req.isAuth) {
    throw new Error("Invalid Token");
  }
};

export default isAuth;
