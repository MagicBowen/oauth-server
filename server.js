const Koa = require('koa');
const Router  = require('koa-router');
const session = require('koa-session');
const convert = require('koa-convert');
const bodyParser = require('koa-bodyparser');
const controller = require('./controller');
const templating = require('./templating');
const staticFiles = require('./static-files');
const model = require('./models/model');

///////////////////////////////////////////////////////////
const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 3000;
const host = process.env.PORT || '127.0.0.1';

model.init();

///////////////////////////////////////////////////////////
const app = new Koa();
app.keys = ['superupersessionsecret'];
app.use(convert(session(app)))

///////////////////////////////////////////////////////////
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
    console.log(`process request for '${ctx.request.method} ${ctx.request.url}' ...`);
    var start = new Date().getTime();
    await next();
    var execTime = new Date().getTime() - start;
    ctx.response.set('X-Response-Time', `${execTime}ms`); 
    console.log(`... response in duration ${execTime}ms`);
});

///////////////////////////////////////////////////////////
// deal static files:
app.use(staticFiles('/static/', __dirname + '/static'));
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
process.on('uncaughtException',function(err){
    console.log('uncaughtException-->'+err.stack+'--'+new Date().toLocaleDateString()+'-'+new Date().toLocaleTimeString());
    process.exit();
});

///////////////////////////////////////////////////////////
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
console.log(`Server is running on ${host}:${port}...`);