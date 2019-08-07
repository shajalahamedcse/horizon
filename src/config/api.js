const apiPath = {
    // Identity
    fetchToken: {
        path: '/v3/auth/tokens',
        type: 'identity',
    },

    getTokenData: {
        path: '/v3/auth/tokens',
        type: 'identity',
    },

    getOwnProjects: {
        path: '/v3/users/${user_id}/projects',
        type: 'identity',
    },
};

const proxyPrefix = {
    identity: '/os-identity',
};

export {
    apiPath,
    proxyPrefix
}
