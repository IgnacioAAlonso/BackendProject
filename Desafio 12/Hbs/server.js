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
let productosCarrito = []
let carrito;
let idProduct = 'a';
let idCart;
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
router.get('/products', (req, res) => {
  idProduct = req.params.id;
  res.render('formulario', { productos })
})

// PRODUCTOS POR ID
router.get('/products/:id', (req, res) => {
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
router.post('/products', (req, res) => {
  console.log(req.body)
  let obj = req.body

  if (productos.length == 0) {
    obj.id = 1;
    obj.timestamp = Date.now()
  } else {
    obj.id = productos[productos.length - 1].id + 1;
    obj.timestamp = Date.now()
  }

  if (!obj.nombre
    || !obj.descripcion
    || !obj.codigo
    || !obj.precio
    || !obj.stock
    || !obj.imagen) {
    res.statusCode = 500;
    res.json({ error: 'Error en el formato, no se pudo cargar el producto' })
  } else {
    obj.precio = parseInt(obj.precio);
    obj.codigo = parseInt(obj.codigo);
    obj.stock = parseInt(obj.stock);
    //productos.push(obj)
    newProduct(obj)
    console.log({ mensaje: 'Se agregó correctamente el producto id: ' + obj.id })
    console.log('Funcion Loca sale')
    var route = '/api/products'
    res.redirect(route)
  }
})

// EDITAR PRODUCTO
router.put('/products/:id', (req, res, next) => {
  let _id = req.params.id;
  let obj = req.body
  if (!productos[_id - 1]) {
    const error = new Error('Producto no encontrado')
    error.httpStatuscode = 500
    return next(error)
  } else {
    if (!obj.nombre
      || !obj.descripcion
      || !obj.codigo
      || !obj.precio
      || !obj.stock
      || !obj.imagen
      || obj.id
      || obj.timestamp) {
      const error = new Error('Error en el formato, no se pudo cargar el producto')
      error.httpStatuscode = 500
      return next(error)
    } else {
      if (req.headers.auth == 'adm') {
        for (let i = 0; i < productos.length; i++) {
          if (productos[i].id == _id) {
            productos[i] = obj;
            productos[i].id = parseInt(_id);
            productos[i].timestamp = Date.now();
          }
        }
        const fs = require('fs')
        fs.writeFileSync('./mensajes.txt', JSON.stringify(productos, null, 2))
        res.json({ mensaje: 'Se editó correctamente el producto id: ' + _id })
      } else {
        const error = new Error('No posee los permisos necesarios para realizar esta accion')
        error.httpStatuscode = 500
        return next(error)
      }
    }
  }
})

// ELIMINAR PRODUCTO - Se le tendrá que enviar un auth = adm para que sepa que sos administrador
router.delete('/products/:id', (req, res, next) => {
  console.log(req.headers.auth)
  let _id = req.params.id;
   
  if (!productos[_id - 1]) {
    const error = new Error('Producto no encontrado')
    error.httpStatuscode = 500
    return next(error)
  } else {
      if (req.headers.auth == 'adm') {
        var eliminado = false;
        var i = 0;
        while (i < productos.length || eliminado == false) {
          if (productos[i].id == _id) {
            //productos.pop(productos[i])
            
            var newProductos = productos.filter((item) => parseInt(item.id) !== parseInt(_id));
            console.log(newProductos);
            
            productos = newProductos;

            const fs = require('fs')
            fs.writeFileSync('./mensajes.txt', JSON.stringify(productos, null, 2))
            eliminado = true;
          }
          
          i++;
        }
        res.json({ mensaje: 'Se eliminó correctamente el producto: ' + _id})
      } else {
        const error = new Error('No posee los permisos necesarios para realizar esta accion')
        error.httpStatuscode = 500
        return next(error)
      }
  }
})

/* ------------------- CARRITO ----------------------------------- */
// CARRITO
router.get('/carrito/products', (req, res) => {
  res.render('carrito', { productosCarrito })
})

// AGREGAR AL CARRITO
router.post('/carrito/products', (req, res) => {
  
  let idP
  let obj
  for (var key in req.body) {
    idP = key;
  }

  for (let i = 0; i < productos.length; i++) {
    if (productos[i].id == idP) {
      obj = productos[i];
    }
  }

    newProductCarrito(obj)
    console.log({ mensaje: 'Se agregó correctamente el producto id: ' + obj.id })
    var route = 'carrito/products'
    res.redirect(route)
  
})

// CREAR CARRITO
router.post('/carrito', (req, res) => {
  console.log(req.body.idCarrito)
  idCart = req.body.idCarrito;
  fecha = Date.now()
  carrito = {idCart,
            fecha,
            productosCarrito}
  var route = 'carrito/products'
  res.redirect(route)
})

// ELIMINAR PRODUCTO DEL CARRITO
router.delete('/carrito/products/:id', (req, res, next) => {
  
  let _id = req.params.id;
   
  if (!productosCarrito[_id - 1]) {
    const error = new Error('Producto no encontrado')
    error.httpStatuscode = 500
    return next(error)
  } else {
        var eliminado = false;
        var i = 0;
        while (i < productosCarrito.length || eliminado == false) {
          if (productosCarrito[i].id == _id) {
            //productos.pop(productos[i])
            
            var newProductos = productosCarrito.filter((item) => parseInt(item.id) !== parseInt(_id));
            console.log(newProductos);
            
            productosCarrito = newProductos;

            const fs = require('fs')
            fs.writeFileSync('./carrito.txt', JSON.stringify(productosCarrito, null, 2))
            eliminado = true;
          }
          
          i++;
        }
        res.json({ mensaje: 'Se eliminó correctamente el producto: ' + _id})
  }
})

// ELIMINAR CARRITO
router.delete('/carrito/products', (req, res, next) => {
        productosCarrito = [];

        const fs = require('fs')
        fs.writeFileSync('./carrito.txt', JSON.stringify(productosCarrito, null, 2))
        eliminado = true;

        res.json({ mensaje: 'Se eliminó correctamente el carrito.'})
})


app.use('/api', router)

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

function historialCarrito() {
  try {
    const fs = require('fs')
    const dataFile = fs.readFileSync('./carrito.txt', 'utf-8')
    productosCarrito = JSON.parse(dataFile)
  } catch (e) {
    console.log('No se pudieron obtener los productos.')
  }
}

function newProduct(data) {
  save(data)
  io.sockets.emit('productos', productos)
}

function newProductCarrito(data) {
  try {
    const fs = require('fs')
    const dataFile = fs.readFileSync('./carrito.txt', 'utf-8')
    productosCarrito = JSON.parse(dataFile)
    productosCarrito.push(data)
  } catch (e) {
    productosCarrito.push(data)
  }

  try {
    const fs = require('fs')
    fs.writeFileSync('./carrito.txt', JSON.stringify(productosCarrito, null, 2))
  } catch (e) {
    console.log('El archivo o la ruta no existen.')
  }
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
    historialCarrito()
    socket.on('notificacion', (data) => {
      console.log(data)
    })
  }

  /* socket.on('new-message', (data) => {
    save(data)
    io.sockets.emit('messages', messages.reverse())
  }) */

})