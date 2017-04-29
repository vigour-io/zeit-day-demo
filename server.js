const http = require('http')
const fs = require('fs')
const { parse, join } = require('path')

http.createServer((req, res) => {
  const parsed = parse(req.url)
  try {
    if (~req.url.indexOf('favicon')) {
      res.end('')
    } else if (!parsed.base) {
      res.setHeader('content-type', 'text/html')
      fs.readFile('index.html', (err, data) => {
        if (!err) {
          res.end(data)
        } else {
          res.end('err')
        }
      })
    } else {
      res.setHeader('content-type', parsed.ext === '.css'
        ? 'text/css'
        : 'text/javascript'
      )
      fs.readFile('.' + join(parsed.dir, parsed.base), (err, data) => {
        if (!err) {
          res.end(data)
        } else {
          res.end('err')
        }
      })
    }
  } catch (e) {
    res.end('err')
  }
}).listen(process.env.NOW ? 80 : 8080)
