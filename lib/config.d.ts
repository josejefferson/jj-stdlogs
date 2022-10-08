import type { Config, ISaveFnParams } from './types';
export declare const config: Config;
/**
 * Sets database save function
 */
export declare function setSaveFn(fn: Config['saveFn']): void;
/**
 * Automatically sets Mongoose schema and model
 * @param mongoose Mongoose
 * @returns Schema and Model
 */
export declare function setMongoose(mongoose: any): {
    schema: any;
    model: any;
};
/**
 * Sets logger functions from an existing Mongoose model
 * @param model Mongoose model
 */
export declare function setMongooseModel(model: any): void;
/**
 * Automatically sets Sequelize model
 * @param sequelize Sequelize module
 * @param connection Sequelize connection
 * @returns Model
 */
/**
 * Sets logger functions from an existing Sequelize model
 * @param model Sequelize model
 */
/**
 * Run the database save function
 */
export declare function save(params: ISaveFnParams): Promise<any>;
