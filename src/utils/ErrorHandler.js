const AppError = require('./AppError')
const constants = require('./api.constants')

const {
  STATUS: {
    INTERNAL_ERROR
  }
} = constants

const ErrorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    res.status(err.code).json({
      status: err.code,
      error: err.message
    })
    return
  }

  return res.status(INTERNAL_ERROR.code).json({
    status: INTERNAL_ERROR.code,
    error: `${INTERNAL_ERROR.tag} An error ocurred, please contact support`
  })
}

module.exports = ErrorHandler
