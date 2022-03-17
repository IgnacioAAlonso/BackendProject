import express from 'express'
import handlebars from 'express-handlebars'
import bp from 'body-parser'

const app = express()
const productos = []

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

app.get('/', (req, res) => {
  //Sirve el cuerpo de la página "main.hbs" en el contenedor "index.hbs"
  res.render('formulario', {productos})
})

app.get('/productos', (req, res) => {
  //Sirve el cuerpo de la página "main.hbs" en el contenedor "index.hbs"
  res.render('datos', {productos})
})

app.use(bp.urlencoded({ extended: true }));
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


/* ------------------------------------------------------ */
/* Server Listen */
const PORT = 8080
const server = app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${server.address().port}`)
})
server.on('error', (error) => console.log(`Error en servidor ${error}`))
