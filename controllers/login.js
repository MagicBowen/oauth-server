const model    = require('../models/model')

var getLogin = async (ctx, next) => {
    ctx.render('login.html');
};

var postLogin = async (ctx, next) => {
    const creds = ctx.request.body;
    console.log(`Authenticating ${creds.username}`);

    const user = await model.getUser(creds.username, creds.password);

    if(!user) {
        console.log('Invalid credentials');
        ctx.redirect('/login');
        return;
    }
    console.log(`User ${user.id} Login Success!`);
    ctx.session.userId = user.id;

    // If we were sent here from grant page, redirect back
    if(ctx.session.hasOwnProperty('query')) {
        console.log('Redirecting back to grant dialog');
        ctx.redirect('/oauth/authorize');
        return;
    }

    // If not do whatever you fancy
    ctx.redirect('/');
};

var logout = async (ctx, next) => {
    ctx.session.userId = null;
    ctx.redirect('/login');
};

module.exports = {
    'GET /login': getLogin,
    'POST /login': postLogin,
    'GET /logout': logout
};