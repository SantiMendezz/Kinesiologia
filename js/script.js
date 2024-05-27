//Inputs
const nombres = document.getElementById("nombres");
const apellidos = document.getElementById("apellidos");
const email = document.getElementById("email");
const telefono = document.getElementById("telefono");
const mensaje = document.getElementById("mensaje");
const provincia = document.getElementById("provincia");
const radios = document.getElementsByName("sexo");

const form = document.getElementById("form");
const parrafo = document.getElementById("warnings");

form.addEventListener("submit", event => {
    //Hace que el evento no ocurra al momento de cargar la vista de la página
    event.preventDefault();

    let warnings = ""
    let entrar = false;
    parrafo.innerHTML = "";

    //Regex
    //https://www.w3resource.com/javascript/form/email-validation.php
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    //https://es.stackoverflow.com/questions/136325/validar-tel%C3%A9fonos-de-argentina-con-una-expresi%C3%B3n-regular
    let regexTelefono = /^(?:(?:00)?549?)?0?(?:11|[2368]\d)(?:(?=\d{0,2}15)\d{2})??\d{8}$/;
    
    if(nombres.value.length < 6) {
        warnings += `*Nombre/s debe tener al menos 6 caracteres <br>`;
        entrar = true;
    }
    if(apellidos.value.length < 6) {
        warnings += `*Apellido/s debe tener al menos 6 caracteres <br>`;
        entrar = true;
    }
    if(!regexEmail.test(email.value)) {
        warnings += `*El email no es válido <br>`;
        entrar = true;
    }
    if(!regexTelefono.test(telefono.value)) {
        warnings += `*El teléfono no es válido <br>`;
        entrar = true;
    }
    if(mensaje.value.length < 20) {
        warnings += `*El mensaje debe tener al menos 20 caracteres <br>`;
        entrar = true;
    }

    // Validación del select de provincias
    let valorProvincia = parseInt(provincia.value);
    if (valorProvincia < 1 || valorProvincia > 24) {
        warnings += `*Por favor, seleccione una provincia <br>`;
        entrar = true;
    }

    // Validación de botones de radio
    let radioSeleccionado = false;
    for (let radio of radios) {
        if (radio.checked) {
            radioSeleccionado = true;
            break;
        }
    }
    if (!radioSeleccionado) {
        warnings += `*Por favor, seleccione una opción de sexo <br>`;
        entrar = true;
    }

    //Si alguno no es valido entonces se mostrará el siguiente texto
    if(entrar) {
        parrafo.innerHTML = warnings;
    } else {
        parrafo.innerHTML = "Enviado";
    }
})