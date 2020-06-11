"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const clubs_controller_1 = require("../controllers/clubs.controller");
const advancedQuery_1 = __importDefault(require("../middleware/advancedQuery"));
const club_1 = __importDefault(require("../models/club"));
const router = express_1.Router();
router.get('/', advancedQuery_1.default(club_1.default, ['owner']), clubs_controller_1.getClubs);
router.get('/:id', clubs_controller_1.getClub);
router
    .get('/:id/posts', clubs_controller_1.getPosts)
    .post('/:id/posts', clubs_controller_1.addPostToCLub);
router
    .put('/:id/posts/:postId', clubs_controller_1.editPost)
    .delete('/:id/posts/:postId', clubs_controller_1.deletePost);
exports.default = router;
//# sourceMappingURL=clubs.routes.js.map