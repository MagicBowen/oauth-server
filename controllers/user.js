const model = require('../models/model')

var getUser = async (ctx, next) => {
    var token = ctx.query.token;
    var accessToken = await model.getAccessToken(token);
    if (accessToken) {
        ctx.response.type = "application/json";
        ctx.response.body = {username : accessToken.user.username};
    } else {
        ctx.response.status = 404;
    }
};

module.exports = {
    'GET /user': getUser,
};