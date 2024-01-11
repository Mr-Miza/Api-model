const http = require('http') ; //importing HTTP 
const app = require('./app') ;

const port = process.env.PORT || 3000 ;  // creating port for the server ( ports from 3000 to 5000 do the trick )

const server = http.createServer(app) ; // here we build the server 

server.listen(port) ; // now the server " listens " to the specific port and see what happens 