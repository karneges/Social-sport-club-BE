"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.editPost = exports.getPosts = exports.addPostToCLub = exports.getClub = exports.getClubs = void 0;
const async_1 = __importDefault(require("../middleware/async"));
const club_1 = __importDefault(require("../models/club"));
const post_1 = __importDefault(require("../models/post"));
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
//@desc         Add new post to club
//@route        POST /api/v1/clubs/:id/post
//@access       Private
exports.addPostToCLub = async_1.default(async (req, res, next) => {
    const clubId = req.params.id;
    const post = await post_1.default.create(req.body);
    const club = await club_1.default.findById(clubId).select('+posts');
    if (!club) {
        return next(new errorHandler_1.default(`No club with ID${post.id}`, 400));
    }
    club.posts.push(post.id);
    await club.save();
    res.status(201).json({
        status: 'success',
        post
    });
});
//@desc         Get club posts
//@route        GET /api/v1/clubs/:id/posts
//@access       Public
exports.getPosts = async_1.default(async (req, res, next) => {
    const { posts } = (await club_1.default.findById(req.params.id).populate('posts').select('posts'));
    if (!posts) {
        return next(new errorHandler_1.default(`No club with ID${req.params.id}`, 400));
    }
    res.status(200).json({
        status: 'success',
        posts
    });
});
exports.editPost = async_1.default(async (req, res, next) => {
    let post = await post_1.default.findById(req.params.postId);
    if (!post) {
        return next(new errorHandler_1.default(`No club with ID${req.params.postId}`, 400));
    }
    for (let field in req.body) {
        // @ts-ignore
        post[field] = req.body[field];
    }
    await post.save();
    res.status(200).json({
        status: 'success',
        post
    });
});
exports.deletePost = async_1.default(async (req, res, next) => {
    const post = await post_1.default.findByIdAndDelete();
    res.status(202).json({
        status: 'success'
    });
});
//# sourceMappingURL=clubs.controller.js.map