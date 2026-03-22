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

const validateProfileEditData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "photoUrl",
    "about",
    "skills",
    "gender",
    "age",
  ];
  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field),
  );
  return isEditAllowed;
};

module.exports = { validateSignUpData, validateProfileEditData };
