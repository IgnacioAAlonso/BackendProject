const express = require('express')
const pug = require('pug')
const app = express()
const bp = require('body-parser')
const PORT = 8080

const router = express.Router()
router.use(express.urlencoded({ extended: true }))
router.use(express.json())
const server = app.listen(PORT,    () => {
  console.log('servidor levantado en el puerto ' + server.address().port)
})

server.on('error', (error) => console.log(`hubo un error ${error}`))

const productos = []
app.set('views', './views')
app.set('view engine', 'pug')

app.get('/', (req, res) => {
  res.render('formulario.pug', {productos})
})

app.get('/productos', (req, res) => {
  res.render('datos.pug', {productos})
})

app.use(bp.urlencoded({ extended: true }));
app.post('/productos', (req, res) => {
  let obj = req.body
  console.log(req.body)
    if (productos.length == 0) {
        obj.id = 1;
    } else {
        obj.id = productos[productos.length - 1].id + 1;
    }

    if (!obj.nombre
        || !obj.precio
        || !obj.imagen) {

    }else{
        obj.price = parseInt(obj.price);
        productos.push(obj)
        var route = '/'
        res.redirect(route)
    }
})