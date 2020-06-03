"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const clubs_controllers_1 = require("../controllers/clubs.controllers");
const advancedQuery_1 = __importDefault(require("../middleware/advancedQuery"));
const club_1 = __importDefault(require("../models/club"));
const router = express_1.Router();
router.get('/', advancedQuery_1.default(club_1.default, ['owner']), clubs_controllers_1.getClubs);
router.get('/:id', clubs_controllers_1.getClub);
router.get('/:id/posts', clubs_controllers_1.getPosts);
router.post('/:id/post', clubs_controllers_1.addPostToCLub);
exports.default = router;
//# sourceMappingURL=clubs.routes.js.map