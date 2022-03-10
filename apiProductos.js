const router = require('./servidor.js');

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
