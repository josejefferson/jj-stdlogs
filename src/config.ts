import { MissingFunctionError } from './errors'
import type { Config, ISaveFnParams } from './types'

export const config: Config = {
  saveFn: null
}

/**
 * Sets database save function
 */
export function setSaveFn(fn: Config['saveFn']) {
  if (typeof fn !== 'function' && fn !== null) {
    throw new Error('Invalid function')
  }

  config.saveFn = fn
}

/**
 * Automatically sets Mongoose schema and model
 * @param mongoose Mongoose
 * @returns Schema and Model
 */
export function setMongoose(mongoose: any) {
  const existingModel = mongoose.models['StdLogs']
  if (existingModel) {
    setMongooseModel(existingModel)
    return { schema: existingModel.schema, model: existingModel }
  }

  const schema = new mongoose.Schema({
    date: { type: Date, expires: 604800 },
    lastUpdate: Date,
    length: Number,
    preview: String,
    content: [String]
  })

  const model = mongoose.model('StdLogs', schema)
  setMongooseModel(model)

  return { schema, model }
}

/**
 * Sets logger functions from an existing Mongoose model
 * @param model Mongoose model
 */
export function setMongooseModel(model: any) {
  config.saveFn = async ({
    isNew,
    date,
    lastUpdate,
    length,
    preview,
    content
  }) => {
    if (model.db.readyState !== 1) {
      await new Promise((resolve) => model.db.once('connected', resolve))
    }

    if (isNew) {
      return model.create({
        date,
        lastUpdate,
        length,
        preview,
        content: [content]
      })
    }

    return model.updateOne(
      { date },
      {
        $push: { content },
        $set: { lastUpdate, length, preview }
      }
    )
  }
}

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
export async function save(params: ISaveFnParams) {
  if (!config.saveFn) {
    throw new MissingFunctionError('No save function')
  }

  return config.saveFn(params)
}
