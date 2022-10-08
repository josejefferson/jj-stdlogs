import { setMongoose, setMongooseModel, setSaveFn } from './config';
export declare const config: {
    setSaveFn: typeof setSaveFn;
    setMongoose: typeof setMongoose;
    setMongooseModel: typeof setMongooseModel;
};
export * as errors from './errors';
export * from './logger';
export * from './middleware';
export * from './types';
import './process';
