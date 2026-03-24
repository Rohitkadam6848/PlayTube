import jwt from "jsonwebtoken";
const gentoken = async (userId) => {
  try {
    const token = await jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    console.log(token);
    return token;
  } catch (e) {
    console.log(`token error is comming ${e} `);
  }
};

export default gentoken;
