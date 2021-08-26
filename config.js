module.exports = {
    port: process.env.NEAR_LINK_PORT || 80,
    maxAttempts: process.env.MAX_ATTEMPTS || 5,
    nearlinknameserver: process.env.NEAR_LINK_NAME_SERVER || ''
};