const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Enter the required fields");
  } else if (!validator.isEmail(emailId))
    throw new Error("Enter correct email id");
  else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a stronger password");
  }
};

module.exports = validateSignUpData;
