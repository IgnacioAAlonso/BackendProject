const socket = io.connect();

window.onload = function () {
    const formulario = document.getElementById('formularioPrueba').addEventListener("click", function (event) {
        event.preventDefault()
        const usuario = document.getElementById('contraseña').value
        if (usuario === 'adm') {
            var fm = document.getElementById('formularioAdm');
            var fmDel = document.getElementById('formularioAdmDel');
            fm.classList.remove('desactivado');
            fmDel.classList.remove('desactivado');
            fm.classList.add('activado');
            fmDel.classList.add('activado');
        }
    });

    for (var i = 0; i < elBotones.length; i++) {
        elBotones[i].addEventListener("click", manejarBotones, false)
    }

    function manejarBotones(e) {
        e.preventDefault();
        alert("Has pulsado el botón: " + this.id);
    }
}


function render(data) {
    console.log(data)
    console.log("Aca estoy")
    const html = data.map((elem, index) => {
        return (`
        <ul class="ulBody">
        <li> ${elem.nombre} </li>
        <li> ${elem.precio} </li>
        <li> <img src="${elem.imagen}" alt="No se encontró una imagen valida" width="50px"/> </li>
        <li>    <form action="/api/carrito/products" method="POST">

        <div class="form-group">
          <input id="idP-${elem.id}" style="display:none" class="form-control" type="text" name="${elem.id}" />
        </div>
        
            <div class="row justify-content-between">
            <button type="submit" class="col-3 btn btn-success mt-3 mb-5">Agregar</button>
            </div>
            </form></li>
        </ul>
            `)
    }).join(" ");
    document.getElementById('productos').innerHTML = html;

}

function render2(data) {
    const html = data.map((elem, index) => {
        return (`<div>
        <p>${elem.texto}</p>
        </div>`)
    }).join(" ");
    document.getElementById('mensajes').innerHTML = html;
}

socket.on('productos', function (data) { render(data) })
socket.on('productoId', function (data) { render(data) })
socket.on('productoCarrito', function (data) { render(data) })
socket.on('messages', function (data) { render2(data) })

/* function addProduct(e) {
    const mensaje = {
        nombre: document.getElementById('nombre').value,
        precio: document.getElementById('precio').value,
        imagen: document.getElementById('imagen').value
    }
    console.log('entrando')
    socket.emit('new-product', mensaje)
    return false
} */

function permisosAdm(e) {
    const usuario = document.getElementById('contraseña').value
    console.log(usuario)
    if (usuario === 'adm') {
        var fm = document.getElementById('formularioAdm');
        fm.classList.remove('desactivado');
        fm.classList.add('activado');
    }
    // return false
}

function addMessage(e) {
    var e = document.getElementById('email').value;
    if (e) {
        var currentdate = new Date();
        const mensaje = {
            texto: ` <strong style="color: blue">${document.getElementById('email').value}</strong> <TT style="color: brown">( ${currentdate.toLocaleString()} ):</TT>
            <I style="color: green"> ${document.getElementById('texto').value} </I>`
        }
        socket.emit('new-message', mensaje)
    }
    return false
}