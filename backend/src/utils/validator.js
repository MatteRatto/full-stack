const { body, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Errori di validazione",
      errors: errors.array(),
    });
  }
  next();
};

const validateRegister = [
  body("name")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Il nome è obbligatorio")
    .isLength({ min: 2 })
    .withMessage("Il nome deve essere di almeno 2 caratteri"),

  body("email")
    .trim()
    .not()
    .isEmpty()
    .withMessage("L'email è obbligatoria")
    .isEmail()
    .withMessage("Inserisci un'email valida")
    .normalizeEmail(),

  body("password")
    .not()
    .isEmpty()
    .withMessage("La password è obbligatoria")
    .isLength({ min: 6 })
    .withMessage("La password deve essere di almeno 6 caratteri")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "La password deve contenere almeno una lettera maiuscola, una minuscola e un numero"
    ),

  handleValidationErrors,
];

const validateLogin = [
  body("email")
    .trim()
    .not()
    .isEmpty()
    .withMessage("L'email è obbligatoria")
    .isEmail()
    .withMessage("Inserisci un'email valida")
    .normalizeEmail(),

  body("password").not().isEmpty().withMessage("La password è obbligatoria"),

  handleValidationErrors,
];

const validateProfileUpdate = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Il nome deve essere di almeno 2 caratteri"),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Inserisci un'email valida")
    .normalizeEmail(),

  body("currentPassword")
    .if(body("newPassword").exists().not().isEmpty())
    .not()
    .isEmpty()
    .withMessage("La password attuale è obbligatoria per cambiarla"),

  body("newPassword")
    .optional()
    .if(body("newPassword").exists().not().isEmpty())
    .isLength({ min: 6 })
    .withMessage("La password deve essere di almeno 6 caratteri")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "La password deve contenere almeno una lettera maiuscola, una minuscola e un numero"
    ),

  handleValidationErrors,
];

const validatePost = [
  body("title")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Il titolo è obbligatorio")
    .isLength({ min: 3, max: 255 })
    .withMessage("Il titolo deve essere tra 3 e 255 caratteri"),

  body("content")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Il contenuto è obbligatorio")
    .isLength({ min: 10, max: 5000 })
    .withMessage("Il contenuto deve essere tra 10 e 5000 caratteri"),

  handleValidationErrors,
];

module.exports = {
  validateRegister,
  validateLogin,
  validateProfileUpdate,
  validatePost,
};
