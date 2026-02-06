const router = require("express").Router();
const authRoutes = require("./modules/auth/auth.routes");
// const userRoutes = require("./modules/user/user.routes");

// Mount routes
router.use("/auth", authRoutes);
// router.use("/user", userRoutes);

module.exports = router;
