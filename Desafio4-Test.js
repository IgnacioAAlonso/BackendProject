var Contenedor = require('./Desafio4-Clase.js');
const Stock = new Contenedor('./productos.txt')

let prod = {
    title: 'ProductoPrueba',
    price: 200,
    thumbnail: 'url/imagen'
}
/*
Stock.save(prod).then(v => console.log('El id del producto agregado es: ' + v))

Stock.getById(2)
    .then(v => console.log('Datos del producto:\n' + v))
    .catch(err => console.log('Error: ' + err))


Stock.getAll().then(v => console.log('Datos de los productos:\n' + v))

 Stock.deleteById(8)
Stock.deleteById(8).then(Stock.save(prod).then(v => console.log('El id del producto agregado es: ' + v)))

Stock.deleteAll() */