"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.save = exports.setMongooseModel = exports.setMongoose = exports.setSaveFn = exports.config = void 0;
var errors_1 = require("./errors");
exports.config = {
    saveFn: null
};
/**
 * Sets database save function
 */
function setSaveFn(fn) {
    if (typeof fn !== 'function' && fn !== null) {
        throw new Error('Invalid function');
    }
    exports.config.saveFn = fn;
}
exports.setSaveFn = setSaveFn;
/**
 * Automatically sets Mongoose schema and model
 * @param mongoose Mongoose
 * @returns Schema and Model
 */
function setMongoose(mongoose) {
    var existingModel = mongoose.models['StdLogs'];
    if (existingModel) {
        setMongooseModel(existingModel);
        return { schema: existingModel.schema, model: existingModel };
    }
    var schema = new mongoose.Schema({
        date: { type: Date, expires: 604800 },
        lastUpdate: Date,
        length: Number,
        preview: String,
        content: [String]
    });
    var model = mongoose.model('StdLogs', schema);
    setMongooseModel(model);
    return { schema: schema, model: model };
}
exports.setMongoose = setMongoose;
/**
 * Sets logger functions from an existing Mongoose model
 * @param model Mongoose model
 */
function setMongooseModel(model) {
    var _this = this;
    exports.config.saveFn = function (_a) {
        var isNew = _a.isNew, date = _a.date, lastUpdate = _a.lastUpdate, length = _a.length, preview = _a.preview, content = _a.content;
        return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(model.db.readyState !== 1)) return [3 /*break*/, 2];
                        return [4 /*yield*/, new Promise(function (resolve) { return model.db.once('connected', resolve); })];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        if (isNew) {
                            return [2 /*return*/, model.create({
                                    date: date,
                                    lastUpdate: lastUpdate,
                                    length: length,
                                    preview: preview,
                                    content: [content]
                                })];
                        }
                        return [2 /*return*/, model.updateOne({ date: date }, {
                                $push: { content: content },
                                $set: { lastUpdate: lastUpdate, length: length, preview: preview }
                            })];
                }
            });
        });
    };
}
exports.setMongooseModel = setMongooseModel;
/**
 * Automatically sets Sequelize model
 * @param sequelize Sequelize module
 * @param connection Sequelize connection
 * @returns Model
 */
// export function setSequelize(sequelize: any, connection: any) {
//   const model = connection.define('Log', {
//     id: {
//       type: sequelize.DataTypes.INTEGER,
//       autoIncrement: true,
//       allowNull: false,
//       primaryKey: true
//     },
//     content: {
//       type: sequelize.DataTypes.TEXT
//     }
//   })
//   setSequelizeModel(model)
//   return { model }
// }
/**
 * Sets logger functions from an existing Sequelize model
 * @param model Sequelize model
 */
// export function setSequelizeModel(model: any) {
//   config.saveFn = (log: ILog) => {
//     return model.create({
//       content: JSON.stringify(log)
//     })
//   }
// }
/**
 * Run the database save function
 */
function save(params) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!exports.config.saveFn) {
                throw new errors_1.MissingFunctionError('No save function');
            }
            return [2 /*return*/, exports.config.saveFn(params)];
        });
    });
}
exports.save = save;
