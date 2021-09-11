const config = require('./config');
const express = require('express')
const util = require('util');
const Resolver = require('dns');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const app = express();
const port = config.port;
const maxAttempts = config.maxAttempts;

const { IPFS }  = require("./ipfs");

var cors = require('cors');

Resolver.setServers([config.nearlinknameserver]);
const resolveTxtAsync = util.promisify(Resolver.resolveTxt);

app.use(cors())

app.get('/', async (req, res) => {
  const execute = async (attempt) => {
    try {
      return await resolveTxtAsync(req.hostname);
    } catch (err) {
      if (attempt <= maxAttempts) {
        const nextAttempt = attempt + 1;
        return execute(nextAttempt);
      } else {
        console.error(`Error:`, err)
      }
    }
  }

  try {
    const addresses = await execute(1);

    if (addresses?.length > 0) {
      if (addresses[0]?.length > 0) {
        let content_hash = addresses[0][0].substring(14);
        console.log(`ContentHash : ${content_hash} for ${req.hostname}`);

        let ipfsData = await IPFS.getInstance().Load(content_hash);
  
        const dom = new JSDOM(ipfsData);
        res.status(200).send(dom.serialize());
      }
    }

  } catch (error) {
    console.log(error);
  }

})

app.listen(port, () => {
  console.log(`NEAR.link listening at http://near.link:${port}`)
  console.log(`Test accountId http://nns.testnet.near.link:${port}`)
})