const express = require('express');

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
})