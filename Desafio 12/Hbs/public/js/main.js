const socket = io.connect();

function render(data) {
    const html = data.map((elem, index) => {
        return (`
        <ul class="ulBody">
        <li> ${elem.nombre} </li>
        <li> ${elem.precio} </td>
        <li> <img src="${elem.imagen}" alt="No se encontró una imagen valida" width="50px"/> </td>
        </ul>
            `)
    }).join(" ");
    document.getElementById('productos').innerHTML = html;
}

/* function render2(data) {
    const html = data.map((elem, index) => {
        return (`<div>
        <p>${elem.texto}</p>
        </div>`)
    }).join(" ");
    document.getElementById('mensajes').innerHTML = html;
} */
socket.on('productos', function (data) { render(data) })
/* socket.on('messages', function (data) { render2(data) }) */

function addProduct(e) {
    const mensaje = {
        nombre: document.getElementById('nombre').value,
        precio: document.getElementById('precio').value,
        imagen: document.getElementById('imagen').value
    }
    console.log('entrando')
    socket.emit('new-product', mensaje)
    return false
}

/* function addMessage(e) {
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
} */