"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_1 = require("../middleware/auth");
const router = express_1.Router();
router.post('/register', auth_controller_1.register);
router.put('/login', auth_controller_1.login);
router.get('/me', auth_1.protect, auth_controller_1.getMe);
router.get('/token', auth_1.protect, auth_controller_1.getNewAccessToken);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map