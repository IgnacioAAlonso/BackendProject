class Contenedor {
    constructor(_options){
        this.options = _options
    }

    createTabla(_nombre){
        const knex = require('knex')(this.options)

        knex.schema
            .createTable(_nombre, (table) => {
                table.increments('id')
                table.string('texto').notNullable()
            })
            .then(() => console.log('tabla creada'))
            .catch((err) => console.log(err))
            .finally(() => knex.destroy)

    }

    createTablaProducts(_nombre){
        const knex = require('knex')(this.options)

        knex.schema
            .createTable(_nombre, (table) => {
                table.increments('id')
                table.string('nombre').notNullable()
                table.string('descripcion').notNullable()
                table.integer('precio').notNullable()
                table.integer('codigo').notNullable()
                table.integer('stock').notNullable()
                table.string('imagen').notNullable()
                table.string('timestamp').notNullable()
            })
            .then(() => console.log('tabla creada'))
            .catch((err) => console.log(err))
            .finally(() => knex.destroy)

    }

    cargarProducto(_nombre, _objeto){
        const knex = require('knex')(this.options)

        knex(_nombre)
        .insert(_objeto)
        .then(() => console.log('Se insertó'))
        .catch((err) => console.log(err))
        .finally(() => knex.destroy)
    }

    editarProducto(_nombre, _objeto){
        const knex = require('knex')(this.options)

        knex(_nombre)
        .where('id', '=', _objeto.id)
        .update({
           status: 'archived',
           nombre: _objeto.nombre,
           descripcion: _objeto.descripcion,
           precio: _objeto.precio,
           codigo: _objeto.codigo,
           stock: _objeto.stock,
           imagen: _objeto.imagen,
           timestamp: _objeto.timestamp
        })
        .then(() => console.log('Se editó'))
        .catch((err) => console.log(err))
        .finally(() => knex.destroy)
    }

    eliminarProducto(_nombre, _id){
        const knex = require('knex')(this.options)

        knex(_nombre)
        .where('id', '=', _id)
        .del()
        .then(() => console.log('Se eliminó'))
        .catch((err) => console.log(err))
        .finally(() => knex.destroy)
    }

    verTabla(_nombre){
        const knex = require('knex')(this.options)

        return knex(_nombre)
        .select('*')
        .then((rows) => {
            /* rows.forEach(r => {
                console.log(`${r['id']} ${r['texto']}`)
            }); */
            var result = JSON.parse(JSON.stringify(rows));
            return result;
        })
        .catch((err) => {
            console.log(err) 
            return null
        }) 
        .finally(() => knex.destroy)
    }
}

module.exports = Contenedor