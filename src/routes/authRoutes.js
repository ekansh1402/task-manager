const router = require("express").Router();

const { signup, signin } = require("../controllers/authController");
const { userSchema, authSchema } = require("../validators/authValidators");
const validateRequest = require("../middleware/validation");

router.post("/signup", validateRequest(userSchema), signup);
router.post("/signin", validateRequest(authSchema), signin);

module.exports = router;
