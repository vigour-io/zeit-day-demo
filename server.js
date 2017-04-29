const http = require('http')
const fs = require('fs')
const { parse, join } = require('path')

http.createServer((req, res) => {
  const parsed = parse(req.url)
  try {
    if (~req.url.indexOf('favicon')) {
      res.end('')
    } else if (!parsed.base) {
      fs.createReadStream('index.html').pipe(res)
    } else {
      fs.createReadStream('.' + join(parsed.dir, parsed.base)).pipe(res)
    }
  } catch (e) {
    res.end('err')
  }
}).listen(process.env.NOW ? 80 : 8080)