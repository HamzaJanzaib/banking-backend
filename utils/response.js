const sendSuccess = (res, statusCode, message, data = null) => {
    res.status(statusCode).json({
        success: true,
        message,
        ...(data && { data })
    });
};

const sendError = (res, statusCode, message) => {
    res.status(statusCode).json({
        success: false,
        message
    });
};

const sendBadRequest = (res, message) => {
    sendError(res, 400, message);
};

const sendUnauthorized = (res, message) => {
    sendError(res, 401, message);
};

const sendServerError = (res, message = "Server Error") => {
    sendError(res, 500, message);
};

const sendCreated = (res, message, data = null) => {
    sendSuccess(res, 201, message, data);
};

const sendOk = (res, message, data = null) => {
    sendSuccess(res, 200, message, data);
};

module.exports = { 
    sendSuccess, 
    sendError, 
    sendBadRequest, 
    sendUnauthorized, 
    sendServerError, 
    sendCreated, 
    sendOk 
};
