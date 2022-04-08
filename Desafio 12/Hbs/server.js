const express = require('express')
const handlebars = require('express-handlebars')
const bp = require('body-parser')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')


const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)
const PORT = 8080

var productos = []

//establecemos la configuración de handlebars
app.engine(
  'hbs',
  handlebars({
    extname: '.hbs',
    defaultLayout: 'index.hbs',
  })
)

app.set('view engine', 'hbs')
app.set('views', './views')

app.use(express.static('./public'))

app.get('/', (req, res) => {
  res.render('formulario', { productos })
})

function save(data) {
  try {
    const fs = require('fs')
    const dataFile = fs.readFileSync('./mensajes.txt', 'utf-8')
    productos = JSON.parse(dataFile)
    productos.push(data)
  } catch (e) {
    productos.push(data)
  }

  try {
    const fs = require('fs')
    fs.writeFileSync('./mensajes.txt', JSON.stringify(productos, null, 2))
  } catch (e) {
    console.log('El archivo o la ruta no existen.')
  }
}

function historial() {
  try {
    const fs = require('fs')
    const dataFile = fs.readFileSync('./mensajes.txt', 'utf-8')
    productos = JSON.parse(dataFile)
    return productos
  } catch (e) {
    console.log('No se pudieron obtener los productos.')
    return productos;
  }
}

/* ------------------------------------------------------ */
/* Server Listen */
httpServer.listen(PORT, () => {
  console.log(`Servidor levantado`)
})

io.on('connection', (socket) => {
  console.log('se conecto un usuario')
  /* socket.emit('productos', productos) */
  socket.emit('productos', historial())
  socket.on('notificacion', (data) => {
    console.log(data)
  })

  socket.on('new-product', (data) => {
    save(data)
    io.sockets.emit('productos', productos)
  })

  /* socket.on('new-message', (data) => {
    save(data)
    io.sockets.emit('messages', messages.reverse())
  }) */

})