const AppError = require("../utils/AppError")

validateQueryParams = (param, allowedValues) => {

    return (req, res, next) => {
        if( allowedValues.includes(req.query[param]) ){
            next()
        }else{
            throw AppError.badRequest('Invalid query parameters')
        }
    }
}

module.exports = validateQueryParams