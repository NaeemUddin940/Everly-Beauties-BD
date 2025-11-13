import jwt from "jsonwebtoken";

export default async function generateAccessToken(userId) {
  const token = await jwt.sign(
    { id: userId },
    process.env.JWT_SECRET_KEY_ACCESS_TOKEN,
    {
      expiresIn: process.env.JWT_SECRET_KEY_ACCESS_TOKEN_EXPIRESIN,
    }
  );
  return token;
}