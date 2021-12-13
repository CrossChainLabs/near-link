const config = require('./config');
const express = require('express')
const util = require('util');
const Resolver = require('dns');
const jsdom = require("jsdom");
const axios = require("axios");
const { JSDOM } = jsdom;
const app = express();
const port = config.port;
const maxAttempts = config.maxAttempts;

var cors = require('cors');

Resolver.setServers([config.nearlinknameserver]);
const resolveTxtAsync = util.promisify(Resolver.resolveTxt);

app.use(cors())

const retrieve = async (url) => {

  let data = undefined;

  try {
    const response = await axios.get(url, { timeout: config.gatewayTimeout });
    if (response.status == 200 && response.data) {
      data = response.data;
    } else {
      console.log(`[INFO] Payload not found via gateway status : ${response.status} for ${url}`)
    }
  } catch (e) {
    console.log(`[INFO] Payload not found via gateway for ${url}`)
  }

  return data;
}

app.get('/', async (req, res) => {
  const execute = async (attempt) => {
    try {
      return await resolveTxtAsync(req.hostname);
    } catch (err) {
      if (attempt <= maxAttempts) {
        const nextAttempt = attempt + 1;
        return execute(nextAttempt);
      } else {
        console.log(`[ERROR] `, err.me)
      }
    }
  }

  try {
    const addresses = await execute(1);

    if (addresses?.length > 0) {
      if (addresses[0]?.length > 0) {
        let content_hash = addresses[0][0].substring(14);
        console.log(`[INFO] ContentHash : ${content_hash} for ${req.hostname}`);

        let data = undefined;

        data = await retrieve (config.pinataGateway + content_hash);
         
        if (!data) {
          data = await retrieve (config.ipfsGateway + content_hash);
        }  

        if (data) {
          console.log(`[INFO] Payload retrieved for ContentHash : ${content_hash}`);

          const dom = new JSDOM(data);
          res.status(200).send(dom.serialize());
        } else {
          console.log(`[INFO] Payload not found for ContentHash : ${content_hash}`);
          
          res.status(404).send();
        }
      }
    }

  } catch (err) {
    console.log(`[ERROR] `, err)
  }

})

app.listen(port, () => {
  console.log(`[INFO] NEAR.link listening at http://near.link:${port}`)
})