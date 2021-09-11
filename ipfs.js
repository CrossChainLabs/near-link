const ipfs = require('ipfs')

class IPFS {
    constructor() {
        this.node = null;
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new IPFS();
        }
        return this.instance;
    }

    async Save(data) {
        if (!this.node) {
            this.node = await ipfs.create();
        }

        let cid = null;
        const result = await this.node.add(Buffer.from(data));
    
        if (result && result.path) {
            cid = result.path;
        }
    
        return cid;
    }

    async Load(cid) {
        if (!this.node) {
            this.node = await ipfs.create();
        }

        let data = '';
    
        const stream = this.node.cat(cid);
        for await (const chunk of stream) {
            // chunks of data are returned as a Buffer, convert it back to a string
            data += chunk.toString()
        }
    
        return data;
    }
  }

  module.exports = {
    IPFS
};