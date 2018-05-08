'use strict';

// Mock data, this would normally be database bindings, ORM wrappers, etc.

module.exports = {
    clients: [{
        id: 'xiaomi',
        secret: '123456', 
        name: 'xiao mi ai audio device',
        accessTokenLifetime: 3600,    // If omitted, server default will be used
        refreshTokenLifetime: 604800, // ^
        redirectUris: [],
        grants: ['client_credentials', 'refresh_token', 'authorization_code', 'password'],
        validScopes: ['secret', 'edit'],
    }],
    users: [{
        id: 1,
        name: 'bowen',
        username: 'wangbo@xiaoda.ai',
        password: '00AAaa',
    }],
    tokens: [],
    authCodes: []
};
