
class HttpResponse {
    constructor(logger){
        this.logger = logger;
    }

    sendSuccess(res, status) {
		this.logger.log(`a request has been made and proccessed successfully at: ${new Date()}`, 'info');
		return (data) => {
			if (!status) {
				status = 200;
			}
			res.status(status).json({
				type: 'success',
                data
			});
		};
	}

}

module.exports = HttpResponse;