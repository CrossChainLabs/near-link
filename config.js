module.exports = {
    port: process.env.NEAR_LINK_PORT || 80,
    maxAttempts: process.env.MAX_ATTEMPTS || 5,
    nearlinknameserver: process.env.NEAR_LINK_NAME_SERVER || '',
    ipfsGateway: process.env.IPFS_GATEWAY || 'https://ipfs.io/ipfs/',
    pinataGateway: process.env.PINATA_GATEWAY || 'https://gateway.pinata.cloud/ipfs/',
    gatewayTimeout: process.env.GATEWAY_TIMEOUT || 5000
};