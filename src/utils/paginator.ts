import { DocumentQuery, Model, Document } from 'mongoose';
import { Request } from 'express';
import { ClubModel } from '../models/club';

export const paginatorFromModel = async <T extends Document>(
    model: Model<any>,
    req: Request,
    queryModel: DocumentQuery<T | null, T, {}>
): Promise<DocumentQuery<T | null, T, {}>> => {
    const page = parseInt((req.query.page as string), 10) || 1;
    const limit = parseInt((req.query.limit as string), 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();
    return queryModel.skip(startIndex).limit(limit);
}

export const paginator = (page: number = 1, limit: number) => {
    const skip = (page - 1) * limit
    return {skip, limit}
}
