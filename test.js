const net = require('net')
const server = net.createServer()

server.listen(777, () => {
  console.log('listening')
})

server.on('error', (err) => {
  console.log(err)
  throw err
})

server.on('connection', (socket) => {
  console.log('connected!')
  setInterval(() => {
    socket.write('$GPGGA,224900.000,4832.3762,N,00903.5393,E,1,04,7.8,498.6,M,48.0,M,,0000*5E\r\n$GPRMC,082006.000,A,3852.9276,N,11527.4283,E,0.00,0.0,261009,,*38')
  }, 5000)
  setImmediate(() => {
    socket.write('$GPGGA,,,,,,,,,,M,,M,,*56')
  })
})

server.on('close', () => {
  console.log('close')
})
