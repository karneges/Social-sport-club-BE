"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const clubs_controller_1 = require("../controllers/clubs.controller");
const post_routes_1 = __importDefault(require("./post.routes"));
const events_routes_1 = __importDefault(require("./events.routes"));
const advancedQuery_1 = __importDefault(require("../middleware/advancedQuery"));
const club_1 = __importDefault(require("../models/club"));
const router = express_1.Router();
// Include other resource routers
router.use('/:id/posts', post_routes_1.default);
router.use('/:id/events', events_routes_1.default);
router.get('/', advancedQuery_1.default(club_1.default, ['owner']), clubs_controller_1.getClubs);
router.get('/:id', clubs_controller_1.getClub);
exports.default = router;
//# sourceMappingURL=clubs.routes.js.map