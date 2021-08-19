const config = require('./config');
const express = require('express')
const { Resolver } = require('dns');
const resolver = new Resolver();

resolver.setServers([config.nearlinknameserver]);

var cors = require('cors')

const app = express()
const port = 3000

app.use(cors())

app.get('/', (req, res) => {
    console.log(req.subdomains);  //test
    console.log(req.hostname);    //test.example.com

    // This request will use the server at 4.4.4.4, independent of global settings.
resolver.resolveTxt(req.hostname, (err, addresses) => {
    console.log(addresses, err);
    // ...
  });
  
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})



