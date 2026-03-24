import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
  try {
    let { token } = req.cookies;
    if (!token) {
      return res.status(400).json({ message: "User does't not have token" });
    }

    let verifyToken = await jwt.verify(token, process.env.JWT_SECRET);

    if (!verifyToken) {
      return res
        .status(400)
        .json({ message: "User does't not have vaild token" });
    }

    req.userId = verifyToken.userId;
    next();
  } catch (e) {
    return res.status(500).json({ message: `isAuth error is coming ${e}` });
  }
};

export default isAuth;
