const express = require('express')
const handlebars = require('express-handlebars')
const bp = require('body-parser')
const router = express.Router()
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')


const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)
const PORT = 8080

let productos = []
let idProduct = 'a';
let productoUnico = []

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
router.use(express.static('./public'))

// TODOS LOS PRODUCTOS
router.get('/', (req, res) => {
  idProduct = req.params.id;
  res.render('formulario', { productos })
})

// PRODUCTOS POR ID
router.get('/:id', (req, res) => {
  idProduct = req.params.id;
  if (!isNaN(idProduct)) {
    if (!productos[idProduct - 1]) {
      res.statusCode = 500;
      res.json({ error: 'Producto no encontrado' })
    }
    productoUnico[0] = productos[idProduct - 1]
    res.render('producto', { productoUnico })
  }
  else {
    res.render('formulario', { productos })
  }
})

// AGREGAR PRODUCTO
app.use(bp.urlencoded({ extended: true }));
router.post('/', (req, res) => {
  console.log(req.body)
  let obj = req.body

  if (productos.length == 0) {
    obj.id = 1;
  } else {
    obj.id = productos[productos.length - 1].id + 1;
  }

  if (!obj.nombre
    || !obj.precio
    || !obj.imagen) {
    res.statusCode = 500;
    res.json({ error: 'Error en el formato, no se pudo cargar el producto' })
  } else {
    obj.precio = parseInt(obj.precio);
    //productos.push(obj)
    newProduct(obj)
    console.log({ mensaje: 'Se agregó correctamente el producto id: ' + obj.id })
    console.log('Funcion Loca sale')
    var route = '/api/productos'
    res.redirect(route)
  }
})

// EDITAR PRODUCTO
router.put('/:id', (req, res, next) => {
  /* let _id = req.params.id;
  let obj = req.body
  if (!productos[_id - 1]) {
    const error = new Error('Producto no encontrado')
    error.httpStatuscode = 500
    return next(error)
  } else {
    if (!obj.nombre
      || !obj.precio
      || !obj.imagen
      || obj.id) {
      const error = new Error('Error en el formato, no se pudo cargar el producto')
      error.httpStatuscode = 500
      return next(error)
    } else {
      for (let i = 0; i < productos.length; i++) {
        if (productos[i].id == _id) {
          productos[i] = obj;
          productos[i].id = parseInt(_id);
        }
      }
      const fs = require('fs')
      fs.writeFileSync('./mensajes.txt', JSON.stringify(productos, null, 2))
      res.json({ mensaje: 'Se editó correctamente el producto id: ' + _id })
    }
  } */
})

// ELIMINAR PRODUCTO
router.delete('/:id', (req, res) => {
  console.req(req.header.name)
  /* let _id = req.params.id;
  if (!productos[_id - 1]) {
    const error = new Error('Producto no encontrado')
    error.httpStatuscode = 500
    return next(error)
  } else {
    var eliminado = false;
    var i = 0;
    while (i < productos.length || eliminado == false) {
      if (productos[i].id == _id) {
        productos.pop(productos[i])
 
        const fs = require('fs')
        fs.writeFileSync('./mensajes.txt', JSON.stringify(productos, null, 2))
        eliminado = true;
      }
 
      i++;
    }
    res.json({ mensaje: 'Se eliminó correctamente' })
  } */
})

app.use('/api/productos', router)

/* ------------------------------------------------------ */
/* Server Listen */
httpServer.listen(PORT, () => {
  console.log(`Servidor levantado`)
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

function newProduct(data) {
  save(data)
  io.sockets.emit('productos', productos)
}

io.on('connection', (socket) => {
  console.log('se conecto un usuario')
  /* socket.emit('productos', productos) */
  console.log(idProduct)
  if (!isNaN(idProduct)) {
    console.log('Estoy viendo un Producto')
    console.log(productoUnico)
    socket.emit('productoId', productoUnico)
  } else {
    socket.emit('productos', historial())
    socket.on('notificacion', (data) => {
      console.log(data)
    })
  }

  /* socket.on('new-message', (data) => {
    save(data)
    io.sockets.emit('messages', messages.reverse())
  }) */

})