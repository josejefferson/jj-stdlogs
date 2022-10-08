import { logger } from './logger'

const processStdout = process.stdout.write.bind(process.stdout)
const processStderr = process.stderr.write.bind(process.stderr)

const logToLogger = function (str: string) {
  logger.append(str)
}

process.stdout.write = function (...args: any[]) {
  logToLogger(args[0])
  return processStdout(...args)
}

process.stderr.write = function (...args: any[]) {
  logToLogger(args[0])
  return processStderr(...args)
}
