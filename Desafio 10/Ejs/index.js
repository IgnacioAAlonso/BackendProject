const express = require('express')
const app = express()
const PORT = 8080

const router = express.Router()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const productos = []
const server = app.listen(PORT, () => {
  console.log('servidor levantado en el puerto ' + server.address().port)
})

server.on('error', (error) => console.log(`hubo un error ${error}`))

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.render('formulario', { productos })
})

app.get('/productos', (req, res) => {
  res.render('./partials/tabla', {productos})
})

app.post('/productos', (req, res) => {
  let obj = req.body
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
