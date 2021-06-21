declare module 'mongoose-sequence' {
    import { Schema, Document, Model, Connection } from 'mongoose';
    const func: (
        _connection: Connection,
    ) => <T>(_schema: Schema<Document<T, any>, Model<Document<T, any>, {}, {}>, undefined>, _opts?: any) => {};
    export = func;
}
