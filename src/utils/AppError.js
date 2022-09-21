const constants = require('./api.constants')
const {
  STATUS: {
    INTERNAL_ERROR,
    NOT_FOUND,
    BAD_REQUEST
  }
} = constants

class AppError extends Error {
  constructor (code, message) {
    super()
    this.code = code
    this.message = message
  }

  static notFound (msg) {
    return new AppError(NOT_FOUND.code, `${NOT_FOUND.tag} ${msg}`)
  }

  static badRequest (msg) {
    return new AppError(BAD_REQUEST.code, `${BAD_REQUEST.tag} ${msg}`)
  }

  static internal (msg) {
    return new AppError(INTERNAL_ERROR.code, `${INTERNAL_ERROR.tag} ${msg}`)
  }
}

module.exports = AppError