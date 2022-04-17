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

    cargarProducto(_nombre, _objeto){
        const knex = require('knex')(this.options)

        knex(_nombre)
        .insert(_objeto)
        .then(() => console.log('Se insertó'))
        .catch((err) => console.log(err))
        .finally(() => knex.destroy)
    }

    verTabla(_nombre){
        const knex = require('knex')(this.options)

        knex(_nombre)
        .select('*')
        .then((rows) => {
            /* rows.forEach(r => {
                console.log(`${r['id']} ${r['texto']}`)
            }); */
            return rows;
        })
        .catch((err) => {
            console.log(err) 
            return null
        }) 
        .finally(() => knex.destroy)
    }
}

module.exports = Contenedor