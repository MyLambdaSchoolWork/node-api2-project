// require your server and launch it here
const server = require('./api/server')

server.listen(5000, () => {
  console.log('Server is listening on port 5000')
})