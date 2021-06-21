import AutoIncrementFactory from 'mongoose-sequence';
import type { Connection, Schema, Document } from 'mongoose';

type IDField<T extends object> = {
    [K in keyof T]: K extends `${infer U}Id`
        ? `${U}Id`
        : K extends `${infer U}_id`
        ? `${U}_id`
        : K extends 'id'
        ? 'id'
        : never;
}[keyof T];

function createAutoIncrementFactory<T extends object>(schema: Schema<Document<T>>, field: IDField<T>) {
    return async (connection: Connection) => {
        const _schema = schema;
        const AutoIncrement = AutoIncrementFactory(connection);
        _schema.plugin(AutoIncrement, { inc_field: field });
        return _schema;
    };
}

export const SequenceUtil = Object.freeze({ createAutoIncrementFactory });
