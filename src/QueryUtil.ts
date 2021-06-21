import type { Model, Document, FilterQuery } from 'mongoose';

export interface PaginatedResponse<T extends Document<T>> {
    data: T[];
    totalPage: number;
    totalCount: number;
}

export type RequestWithPagination = {
    pageSize: number;
    pageIndex: number;
};

function safeAssign<T extends Document<T>>(args: Partial<T>): FilterQuery<T> {
    return Object.entries(args).reduce((filter, [key, value]) => {
        if (value) {
            return Object.assign(filter, { [key]: value });
        }
        return filter;
    }, {});
}

async function searchByFilter<T extends Document<T>, Request extends RequestWithPagination>(
    model: Model<T>,
    request: Request,
    filter?: FilterQuery<T>,
): Promise<PaginatedResponse<T>> {
    const { pageIndex: index, pageSize: size, ...query } = request;
    const _filter = filter ?? (safeAssign(query) as FilterQuery<T>);

    const pageSize = typeof size === 'string' ? Number(size) : size;
    const pageIndex = typeof index === 'string' ? Number(index) : index;
    const data = await model
        .find(_filter)
        .skip((pageIndex - 1) * pageSize)
        .limit(pageSize);
    const totalCount = await model.countDocuments(_filter);
    return {
        data,
        totalCount,
        totalPage: Math.ceil((totalCount || 1) / pageSize),
    };
}

export const QueryUtil = Object.freeze({
    searchByFilter,
    safeAssign,
});
