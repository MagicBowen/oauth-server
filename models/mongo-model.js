var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.model('OAuthClients', new Schema({
    id     : { type: String, required: true },
    secret : { type: String, required: true },
    name   : { type: String },
    accessTokenLifetime   : { type: Number },
    refreshTokenLifetime  : { type: Number },
    redirectUris: { type: Array },
    grants      : { type: Array },
    validScopes : { type: Array }
  }));

mongoose.model('OAuthUsers', new Schema({
  id: { type: String, unique: true, required: true},
  username: { type: String, required: true },
  password: { type: String, required: true },
}));

mongoose.model('OAuthCodes', new Schema({
  authorizationCode: { type: String },
  expiresAt : { type: Date },
  client    : { type: Object },
  user      : { type: Object },
  scope     : { type: String },
  redirectUri : { type: String }
}));

mongoose.model('OAuthTokens', new Schema({
  accessToken  : { type: String },
  refreshToken : { type: String },
  accessTokenExpiresAt : { type: Date },
  refreshTokenExpiresAt: { type: Date },
  client : { type: Object },
  user   : { type: Object },
  scope  : { type: String },  
}));

var Token  = mongoose.model('OAuthTokens');
var Code   = mongoose.model('OAuthCodes');
var Client = mongoose.model('OAuthClients');
var User   = mongoose.model('OAuthUsers');

const model = {};

model.init = async () => {
    mongoose.connect('mongodb://localhost:27017/oauth');

    var result = await Client.findOne({id : 'xiaomi'}).exec();
    if (!result) {
        var xiaomi = new Client({
            id: 'xiaomi',
            secret: '123456', 
            name: 'xiao mi ai audio device',
            accessTokenLifetime: 3600,
            refreshTokenLifetime: 604800,
            redirectUris: [],
            grants: ['authorization_code'],
            validScopes: ['course'],                
        });        
        await xiaomi.save();
        console.log('Save client(xiaomi) in mongo successful!');
    } else {
        console.log('OAuth client(xiaomi) is already in mongo!');
    }
    console.log('Init mongo db model successful!');
}

model.getClient = async (id, secret) => {
    console.log(`Looking up client ${id}:${secret}`);

    const condition = (secret) ? {id : id, secret : secret} : {id : id};

    return await Client.findOne(condition).exec();
};

model.updateClient = async (client) => {
    console.log(`Update client ${client.id}`);

    const oriClient = await Client.findOne({id : client.id}).exec();
    if (!oriClient) {
        console.log(`Find client (${client.id}) failed when update`);
        return;
    }

    oriClient.set(client);
    await oriClient.save();

    console.log(`Save client(${client.id}) success when update`);
}

model.getUser = async (username, password) => {
    console.log(`Looking up user ${username}:${password}`);

    const condition = {username : username, password : password};
    return await User.findOne(condition).exec();
};

model.getUserById = async (id) => {
    console.log(`Looking up user by id = ${id}`);

    const condition = {id : id};
    return await User.findOne(condition).exec();
};

model.getAccessToken = async (accessToken) => {
    console.log(`Get access token ${accessToken}`);

    const token = await Token.findOne({accessToken : accessToken}).exec();
    if(!token) { return false; }

    token.user = await User.findOne({id : token.user.id}).exec();
    token.client = await Client.findOne({id : token.client.id}).exec();

    return token;
};

model.getRefreshToken = async (refreshToken) => {
    console.log(`Get refresh token ${refreshToken}`);

    const token = await Token.findOne({refreshToken : refreshToken}).exec();
    if(!token) { return false; }

    token.user = await User.findOne({id : token.user.id}).exec();
    token.client = await Client.findOne({id : token.client.id}).exec();

    return token;
};

model.saveToken = async (token, client, user) => {
    console.log(`Save token ${token.accessToken}`);

    token.user   = { id: user.id }; 
    token.client = { id: client.id };

    const newTocken = new Token(token);
    await newTocken.save();
    
    return token;
};

model.revokeToken = async (token) => {
    console.log(`Revoke token ${token.refreshToken}`);

    const oriToken = await Token.findOne({refreshToken : token.refreshToken}).exec();

    if(!oriToken) { return false; }

    await Token.deleteOne({refreshToken : token.refreshToken});

    token.refreshTokenExpiresAt = new Date(1984);
    return token;
};

model.getAuthorizationCode = async (code) => {
    console.log(`Retrieving authorization code ${code}`);

    return await Code.findOne({authorizationCode : code}).exec();
};

model.saveAuthorizationCode = async (code, client, user) => {
    console.log(`Saving authorization code ${code.authorizationCode}`);

    code.user   = { id: user.id };
    code.client = { id: client.id };

    const newCode = new Code(code);
    await newCode.save();

    return code;
};

model.revokeAuthorizationCode = async (code) => {
    console.log(`Revoking authorization code ${code.authorizationCode}`);
    
    const oriCode = await Code.findOne({authorizationCode : code.authorizationCode}).exec();

    if(!oriCode) { return false; }

    await Code.deleteOne({authorizationCode : code.authorizationCode});

    code.expiresAt.setYear(1984);
    return code;
};

module.exports = model;