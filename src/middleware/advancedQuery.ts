import {Model} from "mongoose";
import {NextFunction, RequestHandler,Request as ExpRequest, Response} from "express";
import {Request} from "../type-models/Post";
import {Pagination} from "../type-models/Pagintaion";

const advancedResults = (model: Model<any>, populate?:any) => async (req: Request | ExpRequest, res: Response, next: NextFunction) => {
  const reqQuery = { ...req.query };

  //Field to exclude
  const removeFields = ['select', 'sort', 'limit', 'page'];

  //Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  //Create query string
  let queryStr = JSON.stringify(reqQuery);

  //Create operators ($get,$gte...)

  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  //Finding resource
  let query = model.find(JSON.parse(queryStr));

  if (populate) {
    query = query.populate(populate);
  }

  //Select fields
  if (req.query.select) {
    const fields = (req.query.select as string).split(',').join(' ');
    query = query.select(fields);
  }

  //Sort
  if (req.query.sort) {
    const sortBy = (req.query.sort as string).split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt((req.query.page as string), 10) || 1;
  const limit = parseInt((req.query.limit as string), 10) || 25;
  const startIndex = (page -1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();

  query = query.skip(startIndex).limit(limit);
  // Executing query
  const result = await query;

  // Pagination result
  let pagination: Pagination = {total};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }
  }

  // @ts-ignore
  req.advancedResult = {
    success: true,
    count: result.length,
    pagination,
    data: result
  };
  next();
};

export default advancedResults;
