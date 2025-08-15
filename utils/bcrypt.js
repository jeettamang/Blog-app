import bcrypt from "bcryptjs";
const hashedPassword = (text) => {
  return bcrypt.hashSync(text, Number(process.env.BCRYPT_SALT));
};
const comparePassword = (text, hashedText) => {
  return bcrypt.compareSync(text, hashedText);
};
export { hashedPassword, comparePassword };
