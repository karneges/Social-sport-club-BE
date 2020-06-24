"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const messages_controller_1 = require("../controllers/messages.controller");
const auth_1 = require("../middleware/auth");
const router = express_1.Router();
router.get('/message/:userId', auth_1.protect, messages_controller_1.getMessages);
exports.default = router;
//# sourceMappingURL=message.routes.js.map