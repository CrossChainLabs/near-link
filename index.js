const config = require('./config');
const express = require('express')
const jsdom = require("jsdom");
const { JSDOM } = jsdom;


const { Resolver } = require('dns');
const resolver = new Resolver();
var cors = require('cors');

resolver.setServers([config.nearlinknameserver]);

const app = express();
const port = config.port;

app.use(cors())

app.get('*', (req, res) => {
    console.log(req.subdomains);  //test
    console.log(req.hostname);    //test.example.com

    // This request will use the server at 4.4.4.4, independent of global settings.
resolver.resolveTxt(req.hostname, (err, addresses) => {
    console.log(addresses, err);

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


    //res.status(200).send('<script>window.location.href="https://ipfs.io/ipfs/f01701220c3c4733ec8affd06cf9e9ff50ffc6bcd2ec85a6170004bb709669c31de94391a"</script>');
    
    // ...
  });
  
  //res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})



