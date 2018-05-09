const db = {
    clients: [{
        id: 'xiaomi',
        secret: '123456', 
        name: 'xiao mi ai audio device',
        accessTokenLifetime: 3600,
        refreshTokenLifetime: 604800,
        redirectUris: [],
        grants: ['client_credentials', 'refresh_token', 'authorization_code', 'password'],
        validScopes: ['course'],
    }],
    users: [{
        id: '1',
        username: 'wangbo@xiaoda.ai',
        password: '123456',
    }],
    tokens: [],
    authCodes: []
};

const model = {};

model.init = () => {
    console.log('Init memory db model successful!');
}

// Client lookup - Note that for *authcode* grants, the secret is not provided
model.getClient = (id, secret) => {
    console.log(`Looking up client ${id}:${secret}`);

    const lookupMethod = !secret
        ? (client) => { return client.id === id; }
        : (client) => { return client.id === id && client.secret === secret };

    return db.clients.find(lookupMethod);
};

model.updateClient = (client) => {
    const oriClient = model.getClient(client.id);
    for (var k in client) {
        oriClient[k] = client[k]
    }
}

model.getUser = (username, password) => {
    console.log(`Looking up user ${username}:${password}`);

    return db.users.find((user) => {
        return user.username === username && user.password === password;
    });
};

model.getUserById = (id) => {
    console.log(`Looking up user id = ${id}`);

    return db.users.find((user) => {
        return user.id === id;
    });
};

// Performs a lookup on the provided string and returns a token object
model.getAccessToken = (accessToken) => {
    console.log(`Get access token ${accessToken}`);

    const token = db.tokens.find((token) => {
        return token.accessToken === accessToken;
    });

    if(!token) { return false; }

    // Populate with user and client model instances
    token.user = db.users.find((user) => {
        return user.id === token.user.id;
    });

    token.client = db.clients.find((client) => {
        return client.id === token.client.id;
    });

    return token;
};

// Performs a lookup on the provided string and returns a token object
model.getRefreshToken = (refreshToken) => {
    console.log(`Get refresh token ${refreshToken}`);
    const token = db.tokens.find((token) => {
        return token.refreshToken === refreshToken;
    });

    if(!token) { return false; }

    // Populate with user and client model instances
    token.user = db.users.find((user) => {
        return user.id === token.user.id;
    });

    token.client = db.clients.find((client) => {
        return client.id === token.client.id;
    });

    return token;
};

// Saves the newly generated token object
model.saveToken = (token, client, user) => {
    console.log(`Save token ${token.accessToken}`);

    token.user   = { id: user.id }; 
    token.client = { id: client.id };

    db.tokens.push(token);
    return token;
};

// Revoke refresh token after use - note ExpiresAt detail!
model.revokeToken = (token) => {
    console.log(`Revoke token ${token.refreshToken}`);

    // Note: This is normally the DB object instance from getRefreshToken, so
    // just token.delete() or similar rather than the below findIndex.
    const idx = db.tokens.findIndex((item) => {
        return item.refreshToken === token.refreshToken;
    });

    if(idx == -1) { return false; }
    db.tokens.splice(idx, 1);

    // Note: Presently, this method must return the revoked token object with
    // an expired date. This is currently being discussed in
    // https://github.com/thomseddon/node-oauth2-server/issues/251
    
    token.refreshTokenExpiresAt = new Date(1984);
    return token;
};

// Retrieves an authorization code
model.getAuthorizationCode = (code) => {
    console.log(`Retrieving authorization code ${code}`);

    return db.authCodes.find((authCode) => {
        return authCode.authorizationCode === code;
    });
};

// Saves the newly generated authorization code object
model.saveAuthorizationCode = (code, client, user) => {
    console.log(`Saving authorization code ${code.authorizationCode}`);
    code.user   = { id: user.id };
    code.client = { id: client.id };

    db.authCodes.push(code);
    return code;
};

// Revokes the authorization code after use - note ExpiresAt detail!
model.revokeAuthorizationCode = (code) => {
    console.log(`Revoking authorization code ${code.authorizationCode}`);
    
    const idx = db.authCodes.findIndex((authCode) => {
        return authCode.authorizationCode === code.authorizationCode;
    });

    if(idx == -1) { return false; }

    db.authCodes.splice(idx, 1);
    code.expiresAt.setYear(1984); // Same as for `revokeToken()`

    return code;
};

module.exports = model;