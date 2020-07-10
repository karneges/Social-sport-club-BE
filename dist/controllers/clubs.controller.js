"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClub = exports.getClubs = void 0;
const async_1 = __importDefault(require("../middleware/async"));
const club_1 = __importDefault(require("../models/club"));
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
//@desc         Get all clubs
//@route        GET /api/v1/clubs/
//@access       Public
exports.getClubs = async_1.default(async (req, res) => {
    res.status(200).json(req.advancedResult);
});
//@desc         Get single clubs
//@route        GET /api/v1/clubs/:id
//@access       Public
exports.getClub = async_1.default(async (req, res, next) => {
    const { id } = req.params;
    const club = await club_1.default.findById(id);
    if (!club) {
        return next(new errorHandler_1.default(`No club with ID${id}`, 400));
    }
    res.status(200).json({
        success: true,
        club
    });
});
// export const addUserToClub = asyncHandler(async (req: Request<Params>, res: Response, next: NextFunction) => {
//     const user = await User.findById()
// })
//# sourceMappingURL=clubs.controller.js.map