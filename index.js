const config = require('./config');
const express = require('express')
const util = require('util');
const Resolver = require('dns');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const app = express();
const port = config.port;
const maxAttempts = config.maxAttempts;

var cors = require('cors');

Resolver.setServers([config.nearlinknameserver]);
const resolveTxtAsync = util.promisify(Resolver.resolveTxt);

app.use(cors())

app.get('/', async (req, res) => {
  console.log(req.subdomains);  //test
  console.log(req.hostname);    //test.example.com

  const execute = async (attempt) => {
    try {
      return await resolveTxtAsync(req.hostname);
    } catch (err) {
      if (attempt <= maxAttempts) {
        const nextAttempt = attempt + 1;
        console.error(`Retrying due to:`, err)
        return execute(nextAttempt);
      } else {
        console.error(`Error:`, err)
      }
    }
  }

  try {
    const addresses = await execute(1);
    console.log("addresses", addresses);

    if (addresses?.length > 0) {
      if (addresses[0]?.length > 0) {
        console.log(addresses[0][0]);
        JSDOM.fromURL("https://github.com/jsdom/jsdom", {
          //url: "https://example.org/",
          //referrer: "https://example.com/",
          //contentType: "text/html",
          includeNodeLocations: true,
          storageQuota: 10000000
        }).then(dom => {
          //console.log(dom.serialize());
          res.status(200).send(dom.serialize());
        });
      }
    }

  } catch (error) {
    console.log(error);
  }

})

app.listen(port, () => {
  console.log(`Example app listening at http://test.near.link:${port}`)
})



