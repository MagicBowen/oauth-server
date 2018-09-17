const logger = require('../logger').logger('mongo-model');
var uuid = require('node-uuid');
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
  timestamp: { type: Number, required: true },
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

    var client = await Client.findOne({id : 'xiaomi'}).exec();
    if (!client) {
        var xiaomi = new Client({
            id: 'xiaomi',
            secret: '123456', 
            name: 'xiao mi ai audio device',
            accessTokenLifetime: 3600,
            refreshTokenLifetime: 604800,
            redirectUris: [],
            grants: ['authorization_code'],
            validScopes: [],                
        });        
        await xiaomi.save();
        logger.info('Save client(xiaomi) in mongo successful!');
    } else {
        logger.info('OAuth client(xiaomi) is already in mongo!');
    }

    var user = await User.findOne({username : '13759947708'}).exec();
    if (!user) {
        await model.addUser('13759947708', '123456');
        logger.info('Save user(13759947708) in mongo successful!');
    } else {
        logger.info('OAuth user(13759947708) is already in mongo!');
    }

    logger.info('Init mongo db model successful!');
}

model.getClient = async (id, secret) => {
    logger.debug(`Looking up client ${id}:${secret}`);

    const condition = (secret) ? {id : id, secret : secret} : {id : id};

    return await Client.findOne(condition).exec();
};

model.updateClient = async (client) => {
    logger.debug(`Update client ${client.id}`);

    const oriClient = await Client.findOne({id : client.id}).exec();
    if (!oriClient) {
        logger.error(`Find client (${client.id}) failed when update`);
        return;
    }

    oriClient.set(client);
    await oriClient.save();

    logger.debug(`Save client(${client.id}) success when update`);
}

model.getUser = async (username, password) => {
    logger.debug(`Looking up user ${username}:${password}`);

    const condition = {username : username, password : password};
    return await User.findOne(condition).exec();
};

model.getUserById = async (id) => {
    logger.debug(`Looking up user by id = ${id}`);

    const condition = {id : id};
    return await User.findOne(condition).exec();
};


model.addUser = async (username, password) => {
    const timestamp = new Date().getTime();
    logger.debug(`Try add new user ${username}:${password} at ${timestamp}`);

    const oriUser = await User.findOne({username : username}).exec();
    if (oriUser) {
        logger.warn(`user(${username}) is already in mongo, delete it now!`);
        await User.deleteOne({username : username}).exec();
    }
    const user = new User({
        id : uuid.v1(),
        username : username,
        password : password,
        timestamp: timestamp
    });
    await user.save();
    logger.debug(`Add new user ${username}:${password} successful!`);
}

model.deleteUser = async (username) => {
    const timestamp = new Date().getTime();
    logger.warn(`Delete user ${username} at ${timestamp}`);

    await User.deleteOne({username : username});
}

model.getAccessToken = async (accessToken) => {
    logger.debug(`Get access token ${accessToken}`);

    const token = await Token.findOne({accessToken : accessToken}).exec();
    if(!token) { return false; }

    logger.debug(`find token ${JSON.stringify(token)}`)

    token.user = await User.findOne({id : token.user.id}).exec();
    logger.debug(`find user ${JSON.stringify(token)}`)
    token.client = await Client.findOne({id : token.client.id}).exec();
    logger.debug(`find client ${JSON.stringify(token)}`)

    return token;
};

model.getRefreshToken = async (refreshToken) => {
    logger.debug(`Get refresh token ${refreshToken}`);

    const token = await Token.findOne({refreshToken : refreshToken}).exec();
    if(!token) { return false; }

    token.user = await User.findOne({id : token.user.id}).exec();
    token.client = await Client.findOne({id : token.client.id}).exec();

    return token;
};

model.saveToken = async (token, client, user) => {
    logger.debug(`Save token ${token.accessToken}`);

    token.user   = { id: user.id }; 
    token.client = { id: client.id };

    const newTocken = new Token(token);
    await newTocken.save();
    
    return token;
};

model.revokeToken = async (token) => {
    logger.debug(`Revoke token ${token.refreshToken}`);

    const oriToken = await Token.findOne({refreshToken : token.refreshToken}).exec();

    if(!oriToken) { return false; }

    await Token.deleteOne({refreshToken : token.refreshToken});

    token.refreshTokenExpiresAt = new Date(1984);
    return token;
};

model.getAuthorizationCode = async (code) => {
    logger.debug(`Retrieving authorization code ${code}`);

    return await Code.findOne({authorizationCode : code}).exec();
};

model.saveAuthorizationCode = async (code, client, user) => {
    logger.debug(`Saving authorization code ${code.authorizationCode}`);

    code.user   = { id: user.id };
    code.client = { id: client.id };

    const newCode = new Code(code);
    await newCode.save();

    return code;
};

model.revokeAuthorizationCode = async (code) => {
    logger.debug(`Revoking authorization code ${code.authorizationCode}`);
    
    const oriCode = await Code.findOne({authorizationCode : code.authorizationCode}).exec();

    if(!oriCode) { return false; }

    await Code.deleteOne({authorizationCode : code.authorizationCode});

    code.expiresAt.setYear(1984);
    return code;
};

module.exports = model;