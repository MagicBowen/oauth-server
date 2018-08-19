const Koa = require('koa');
const Router  = require('koa-router');
const session = require('koa-session');
const convert = require('koa-convert');
const bodyParser = require('koa-bodyparser');
const controller = require('./controller');
const templating = require('./templating');
// const serve = require('koa-static');
const staticFiles = require('./static-files');
const model = require('./models/model');
const logger = require('./logger').logger('server');

///////////////////////////////////////////////////////////
const isProduction = true;
const port = process.env.PORT || 9000;
const host = process.env.HOST || '0.0.0.0';

// Initial DB model for OAuth
model.init();

///////////////////////////////////////////////////////////
const app = new Koa();
app.keys = ['superupersessionsecret'];
app.use(convert(session(app)))

///////////////////////////////////////////////////////////
// OAuth server setup
const OAuthServer = require('./oauth-server');
const oauth = new OAuthServer({
    scope: false, 
    model: require('./models/model'),
    allowBearerTokensInQueryString: true,
    accessTokenLifetime: 3600, 
    refreshTokenLifetime: 604800 
});

function upateOAuth(oauth) {
    return async (ctx, next) => {
        ctx.oauth = oauth;
        await next();
    };
}

app.use(upateOAuth(oauth));

///////////////////////////////////////////////////////////
// log middleware
app.use(async (ctx, next) => {
    logger.info(`process request for '${ctx.request.method} ${ctx.request.url}' ...`);
    var start = new Date().getTime();
    await next();
    var execTime = new Date().getTime() - start;
    ctx.response.set('X-Response-Time', `${execTime}ms`); 
    logger.info(`... response in duration ${execTime}ms`);
});

///////////////////////////////////////////////////////////
// deal static files:
app.use(staticFiles('/static', __dirname + '/static', 'api/oauth'));
// app.use(serve('./static', {
//     proxy: '/api/oauth'
//   }));
// parse request body:
app.use(bodyParser());
// add nunjucks as view:
app.use(templating('views', {
    noCache: !isProduction,
    watch: !isProduction
}));
// add controllers:
app.use(controller());

///////////////////////////////////////////////////////////
// Catch unhandled exceptions
process.on('uncaughtException',function(err){
    logger.error('uncaughtException-->'+err.stack+'--'+new Date().toLocaleDateString()+'-'+new Date().toLocaleTimeString());
    process.exit();
});

///////////////////////////////////////////////////////////
// Resource for oauth test
const rPrivate = new Router();
const rCourse = new Router();

rCourse.get('/', oauth.scope('course'), (ctx) => {
    ctx.response.body = { message: 'Get user course success!' };
});
rPrivate.use(oauth.authenticate());
rPrivate.use('/course', rCourse.routes());

app.use(rPrivate.routes());

///////////////////////////////////////////////////////////
app.listen(port, host);
logger.info(`Server is running on ${host}:${port}...`);