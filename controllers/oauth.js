const model = require('../models/model')
const logger = require('../logger').logger('oauth');

// Token acquisition endpoint
var oauthToken = async (ctx, next) => {
    var run = ctx.oauth.token();
    return run(ctx, next);
};

var oauthAuthorize = async (ctx, next) => {
    if(!ctx.session.userId) {
        logger.debug('User not authenticated, redirecting to /login');
        ctx.session.query = {
            state:         ctx.request.query.state,
            scope:         ctx.request.query.scope,
            client_id:     ctx.request.query.client_id,
            redirect_uri:  ctx.request.query.redirect_uri,
            response_type: ctx.request.query.response_type
        };

        ctx.redirect('/login');
        return;
    }

    const client = await model.getClient(ctx.session.query.client_id);
    
    if(!client) { ctx.throw(401, 'No such client'); }
    
    const redirect_uri = client.redirectUris.find((uri) => {
        return uri === ctx.session.query.redirect_uri;
    });

    if(!redirect_uri) {
        client.redirectUris.push(ctx.session.query.redirect_uri);
        await model.updateClient(client);
        logger.debug(`Add new redirect uri(${ctx.session.query.redirect_uri}) to client(${client.id})`);
    }
    ctx.render('authorize.html', client);
};

// OAuth authorization endpoint (authcode grant flow)
var authCodeGrant = async (ctx, next) => {
    if(!ctx.session.userId) {
        logger.debug('User not authenticated, redirecting to /login');
        ctx.redirect('/login');
        return;
    }

    logger.debug('User authenticated!')
    ctx.request.body         = ctx.session.query;
    ctx.request.body.user_id = ctx.session.userId;
    ctx.session.query        = null;

    return next();
};

var doAuthorize = async (ctx, next) => {
    var run = ctx.oauth.authorize({
        authenticateHandler: {
            handle: async (req, res) => { return await model.getUserById(req.body.user_id); }
        }
    });
    return run(ctx, next);
}

module.exports = {
    'GET /oauth/token': oauthToken,
    'POST /oauth/token': oauthToken,
    'PUT /oauth/token': oauthToken,
    'GET /oauth/authorize': oauthAuthorize,
    'POST /oauth/authorize': [authCodeGrant, doAuthorize],
};