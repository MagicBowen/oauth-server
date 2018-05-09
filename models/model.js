
var model = (process.env.NODE_ENV === 'production')? require('./mongo-model') : require('./mem-model');

// In the client credentials grant flow, the client itself needs to be related
// with some form of user representation
model.getUserFromClient = (client) => {
    console.log(`Looking up user for client ${client.name}`);
    return { name: client.name, isClient: true };
};

// Called in `authenticate()` - basic check for scope existance
// `scope` corresponds to the oauth server configuration option, which
// could either be a string or boolean true.
// Since we utilize router-based scope check middleware, here we simply check
// for scope existance.
model.verifyScope = (token, scope) => {
    console.log(`Verify scope ${scope} in token ${token.accessToken}`);
    if(scope && !token.scope) { return false; }
    return token;
};

// Can be used to sanitize or purely validate requested scope string
// model.validateScope = (user, client, scope) => {
//     console.log(`Validating requested scope: ${scope}`);

//     if(!scope) return false;

//     const validScope = (scope || '').split(' ').filter((key) => {
//         return client.validScopes.indexOf(key) !== -1;
//     });

//     if(!validScope.length) { return false; }

//     return validScope.join(' ');
// };

module.exports = model;


