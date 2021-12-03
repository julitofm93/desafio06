const socket = io();
//EVENTOS DE SOCKET PARA EL LISTADO DE PRODUCTOS
socket.on('updateProductos', data=>{
    let arregloDeProductos = data.payload;
    console.log(arregloDeProductos)
    //LLAMO A UN FETCH PARA JALAR UN ARCHIVO. LUEGO DE TERMINAR DE PROCESARLO COMO TEXTO PLANO PROCESAMOS LA PLANTILLA
    fetch('templates/productostable.handlebars').then(string=>string.text()).then(template=>{
        //Con la libreria Handlebars (que instale como cdn en el html) quiero compilar el template
        const processedTemplate = Handlebars.compile(template)
        const templateObject = {
            arregloDeProductos:arregloDeProductos
        }
        const html = processedTemplate(templateObject)
        let productosTable = document.getElementById('productosTable')
        productosTable.innerHTML = html;
    })
})

//EVENTOS DEL SOCKET PARA EL CHAT
let enter = document.getElementById('enter')
let input = document.getElementById('mensaje')
let user = document.getElementById('user')

enter.addEventListener('click',(e)=>{
    
        socket.emit('message',{user:user.value,message:input.value})
    
})

socket.on('messageLog',data=>{
    let p = document.getElementById('log');
    let dateHoy = new Date()
    let date = dateHoy.toLocaleString()
    let mensajes = data.map(message=>{
        return `<div><span class="user">${message.user}</span><span class="date"> ${date}: </span><span class="message">${message.message}</span></div>`
    }).join('')
    p.innerHTML=mensajes;
})

document.addEventListener('submit',enviarFormulario);

function enviarFormulario(event){
    event.preventDefault();
    let form= document.getElementById('formulario');
    let data = new FormData(form);
    fetch('/api/productos',{
        method:'POST',
        body:data
    }).then(result=>{
        return result.json();
    }).then(json=>{
        Swal.fire({
            title:'Éxito',
            text:json.message,
            icon:'success',
            timer:2000,
        }).then(result=>{
            location.href='/'
        })
    })
}

