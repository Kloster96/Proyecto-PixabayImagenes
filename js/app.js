const resultado = document.querySelector('#resultado');
const formululario = document.querySelector('#formulario');
const paginacionDiv = document.querySelector('#paginacion');

const registrosPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;


window.onload = () => {
    formululario.addEventListener('submit', validarFormulario)
}

function validarFormulario(e) {
    e.preventDefault();

    const terminoBusqueda = document.querySelector('#termino').value;

    if(terminoBusqueda === '') {
        mostrarAlerta('Agrega un termino de busqueda')
        return;
    }
    buscarImagenes();

}

function mostrarAlerta(mensaje) {

    const existeAlerta = document.querySelector('.bg-red-100');

    if(!existeAlerta){
        const alerta = document.createElement('p');
        alerta.classList.add('bg-red-100', "border-red-400", "text-red-700", "px-4", "py-3", "rounded",  "max-w-lg", "mx-auto", "mt-6", "text-center" );

        alerta.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block sm:inline">${mensaje}</span>
        `;
        formululario.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

async function buscarImagenes() {
    const termino = document.querySelector('#termino').value;

    const key = '30268185-2107f2489f1e7532511d5a664';
    url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`;
    // console.log(url);
    
    // fetch(url)
    //     .then(respuesta => respuesta.json())
    //     .then(resultado => {
    //         console.log(resultado);
    //         totalPaginas = calcularPaginas(resultado.totalHits);
    //         // console.log(totalPaginas);
    //         mostrarImagenes(resultado.hits);
    //     })
    try {
        const respuesta = await fetch(url)
        const resultado = await respuesta.json();
        totalPaginas = calcularPaginas(resultado.totalHits);
        mostrarImagenes(resultado.hits);
    } catch (error) {
        console.log(error);
    }
}

// Generador que va a registrar la cantidad de eleminetos de acuerdo a las paginas
function *crearPaginador(total){
    for (let i = 1; i <= total; i++){
        yield i;
    }
}
function calcularPaginas(total) {
    return parseInt( Math.ceil(total / registrosPorPagina));
}


function mostrarImagenes(imagenes){
    // console.log(imagenes);
    
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }

    //Interear sobre el arreglo de imagenes y contruir el HTML
    imagenes.forEach((imagen) => {
        const { previewURL, likes, views, largeImageURL  } = imagen;

        resultado.innerHTML += `
            <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                <div class="bg-white">
                    <img class="w-full" src="${previewURL}">
                    <div class="p-4">
                        <p class="font-bold">${likes}<span class="font-light"> Me gusta</span></p>
                        <p class="font-bold">${views}<span class="font-light"> Veces Vista</span></p>

                        <a 
                            class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1"
                            href="${largeImageURL}" target="_blank" rel="noopener noreferrer"
                        >
                            Ver Imagen
                        </a>
                    </div>
                </div>
            </div>
        `;
    });

    // Limpiar el paginador previo
    while(paginacionDiv.firstChild) {
        paginacionDiv.removeChild(paginacionDiv.firstChild);
    }
    // Generamos el nuevo html
    imprimirPaginador();
}

function imprimirPaginador(){
    iterador = crearPaginador(totalPaginas);

    while(true){
        const { value, done} = iterador.next();
        if(done) return;

        // En caso contrario, genera un boton cpor cada elemento en el generador
        const boton = document.createElement("a");
        boton.href = '#'
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('siguiente', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'font-bold', 'rounded');
        boton.onclick = () => {
            paginaActual = value;
            buscarImagenes();
        }
        paginacionDiv.appendChild(boton);
    }
}

