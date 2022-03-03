/* const { resolve } = require('path/posix') */

class Contenedor {
    constructor(_archivo) {
        this.archivo = _archivo
        this.productos = []
        this.fs = require('fs')
    }
    
    async save(_producto) {
        
        try {
            const data = await this.fs.promises.readFile(this.archivo, 'utf-8')
            this.productos = JSON.parse(data)
            _producto.id = this.productos[this.productos.length - 1].id + 1;
            this.productos.push(_producto)
        } catch (e) {
            try {
                _producto.id = this.productos.length + 1;
                this.productos.push(_producto)
            } catch (error) {
                console.log('El archivo o la ruta no existen.')
            }
        }

        try {
            await this.fs.promises.writeFile(this.archivo, JSON.stringify(this.productos, null, 2))
            return _producto.id;
        } catch (e) {
            console.log('El archivo o la ruta no existen.')
        }
    }

    async getById(_id) {
        try {
            const data = await this.fs.promises.readFile(this.archivo, 'utf-8')
            this.productos = JSON.parse(data)
            let productoFiltrado = this.productos.filter((prod) => prod.id === _id)
            
            return JSON.stringify(productoFiltrado[0], null, 2);
        } catch (e) {
            console.log('No se pudo obtener el producto.')
            return null
        }
    }

    async getAll() {
        
        try {
            const data = await this.fs.promises.readFile(this.archivo, 'utf-8')
            this.productos = JSON.parse(data)

            return JSON.stringify(this.productos, null, 2);
        } catch (e) {
            console.log('No se pudieron obtener los productos.')
            return null
        }
    }

    async deleteById(_id) {
        

        try {
            const data = await this.fs.promises.readFile(this.archivo, 'utf-8')
            this.productos = JSON.parse(data)
            let productosFiltrados = this.productos.filter((prod) => prod.id !== _id)
            try {
                await this.fs.promises.writeFile(this.archivo, JSON.stringify(productosFiltrados, null, 2))
            } catch (e) {
                console.log('El archivo o la ruta no existen.')
            }
        } catch (e) {
            console.log('No se pudo eliminar el producto.')
            return null
        }
    }

    async deleteAll() {
        
        try {
            await this.fs.promises.writeFile(this.archivo, '[]')
        } catch (e) {
            console.log('El archivo o la ruta no existen.')
        }
    }
}

module.exports = Contenedor
/*export default Contenedor; */