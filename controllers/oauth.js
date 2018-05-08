const db    = require('../models/db')

// Token acquisition endpoint
var oauthToken = async (ctx, next) => {
    var run = ctx.oauth.token();
    return run(ctx, next);
};

var oauthAuthorize = async (ctx, next) => {
    if(!ctx.session.userId) {
        console.log('User not authenticated, redirecting to /login');
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

    const client = db.clients.find((client) => {
        return client.id === ctx.session.query.client_id;
    });

    if(!client) { ctx.throw(401, 'No such client'); }

    ctx.render('authorize.html', client);
};

// OAuth authorization endpoint (authcode grant flow)
var authCodeGrant = async (ctx, next) => {
    if(!ctx.session.userId) {
        console.log('User not authenticated, redirecting to /login');
        ctx.redirect('/login');
        return;
    }

    console.log('User authenticated!')
    ctx.request.body         = ctx.session.query;
    ctx.request.body.user_id = ctx.session.userId;
    ctx.session.query        = null;

    return next();
};

var doAuthorize = async (ctx, next) => {
    var run = ctx.oauth.authorize({
        authenticateHandler: {
            handle: (req, res) => {
                return db.users.find((user) => {
                    console.log(`user.id = ${user.id}, user_id = ${req.body.user_id}`);
                    return user.id === req.body.user_id;
                });
            }
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