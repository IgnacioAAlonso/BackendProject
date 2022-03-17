const express = require('express');

const app = express();
const PORT = 8080;
const router = express.Router()

app.use(express.static('public'))

router.use(express.urlencoded({ extended: true}))
router.use(express.json())
const server = app.listen(PORT, () => {
    console.log('Servidor HTTP escuchando en el puerto ' + server.address().port)
})

server.on("error", (error) => console.log('Error en servidor' + error))

const productos = [];

router.get('/', (req, res) => {
    res.json(productos)
})

router.get('/:id', (req, res) => {
    let _id = req.params.id;
    console.log(_id)
    if (!productos[_id - 1]) {
        res.statusCode = 500;
        res.json({error: 'Producto no encontrado'})
    }
    res.json(productos[_id - 1])
})

router.post('/', (req, res) => {
    console.log(req.body)
    let obj = req.body
    if (productos.length == 0) {
        obj.id = 1;
    } else {
        obj.id = productos[productos.length - 1].id + 1;
    }

    if (!obj.title
        || !obj.price
        || !obj.thumbnail) {
        res.statusCode = 500;
        res.json({error: 'Error en el formato, no se pudo cargar el producto'})
    }else{
        obj.price = parseInt(obj.price);
        productos.push(obj)
        res.json({mensaje: 'Se agregó correctamente el producto id: ' + obj.id })
    }
})

router.put('/:id', (req, res, next) => {
    let _id = req.params.id;
    let obj = req.body
    if (!productos[_id - 1]) {
        const error = new Error('Producto no encontrado')
        error.httpStatuscode = 500
        return next(error)
    }else{
        if (!obj.title
            || !obj.price
            || !obj.thumbnail
            || obj.id) {
                const error = new Error('Error en el formato, no se pudo cargar el producto')
                error.httpStatuscode = 500
                return next(error)
        }else{
            for (let i = 0; i < productos.length; i++) {
                if (productos[i].id == _id) {
                    productos[i] = obj;
                    productos[i].id = parseInt(_id);
                }
            }
            res.json({mensaje: 'Se editó correctamente el producto id: ' + _id })
        }
    }
})

router.delete('/:id', (req, res, next) => {
    let _id = req.params.id;
    if (!productos[_id - 1]) {
        const error = new Error('Producto no encontrado')
        error.httpStatuscode = 500
        return next(error)
    }else{
        var eliminado = false;
        var i = 0;
        while (i < productos.length || eliminado == false) {
            if (productos[i].id == _id) {
                productos.pop(productos[i])
                eliminado = true;
            }

            i++;
        }
        res.json({mensaje: 'Se eliminó correctamente'})
    }
})

app.use('/api/productos', router)


/* const express = require('express');

const app = express();
const PORT = 8080;

const server = app.listen(PORT, ()=>{
    console.log('Servidor HTTP escuchando en el puerto ' + server.address().port)
});

server.on("error", error => console.log('Error en servidor' + error))

var Contenedor = require('./Desafio4-Clase.js');
const Stock = new Contenedor('./productos.txt')

app.get('/productos', (req, res)=> {
    Stock.getAll().then(v => {
        const p = JSON.parse(v)
        var resData = [];
        p.map((producto) => {
            
            var data = 
                `<h1> Producto ${producto.id} </h1> 
             <div> Nombre: ${producto.title} </div>
             <div> Precio: ${producto.price} </div>
             <div> Imagen: ${producto.thumbnail} </div>`

             resData = resData + data;
        })

        res.send(resData)
        }
    )
})

app.get('/', (req, res)=> {
    res.send(`<h1> Inicio </h1> 
             <div> /productos -> Todos los productos </div>
             <div> /productos/id -> Busca el producto </div>
             <div> /productoRandom -> Trae un producto random </div>`)
})

app.get('/productos/:productoId', (req, res)=> {
    Stock.getById(parseInt(req.params.productoId))
    .then(v => {
        const p = JSON.parse(v)
        res.send(`<h1> Producto ${p.id} </h1> 
             <div> Nombre: ${p.title} </div>
             <div> Precio: ${p.price} </div>
             <div> Imagen: ${p.thumbnail} </div>`)}
             )
    .catch(err => res.send('No se encontró el producto'))
})

app.get('/productoRandom', (req, res)=> {
    Stock.getAll().then(v => {
        const productos = (JSON.parse(v))
        const prodcuto = (Math.floor(Math.random() * ((productos.length + 1) - 1)) + 1)
        Stock.getById(parseInt(prodcuto))
        .then(v => {
            const p = JSON.parse(v)
            res.send(`<h1> Producto ${p.id} </h1> 
                 <div> Nombre: ${p.title} </div>
                 <div> Precio: ${p.price} </div>
                 <div> Imagen: ${p.thumbnail} </div>`)})
        .catch(err => res.send('No se encontró el producto'))
    })
}) */