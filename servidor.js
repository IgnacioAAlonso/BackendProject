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
    Stock.getAll().then(v => res.send((JSON.parse(v))))
})

app.get('/', (req, res)=> {
    res.send('<h1> Inicio </h1>')
})

app.get('/productos/:productoId', (req, res)=> {
    Stock.getById(parseInt(req.params.productoId))
    .then(v => res.send((JSON.parse(v))))
    .catch(err => res.send('No se encontró el producto'))
})

app.get('/productoRandom', (req, res)=> {
    Stock.getAll().then(v => {
        const productos = (JSON.parse(v))
        const prodcuto = (Math.floor(Math.random() * ((productos.length + 1) - 1)) + 1)
        Stock.getById(parseInt(prodcuto))
        .then(v => res.send((JSON.parse(v))))
        .catch(err => res.send('No se encontró el producto'))
    })
})