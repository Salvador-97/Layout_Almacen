const layout = document.querySelector("svg")
let ubicacionSeleccionada = ""
ordenarNumeroRacks()

layout.addEventListener("click", event => {
    if (event.target.tagName === "rect") {
        if (ubicacionSeleccionada == "") {
            ubicacionSeleccionada = event.target.id;
            const cuadro = document.getElementById(ubicacionSeleccionada)
            if (cuadro.classList.contains("seleccionado")) {
                cuadro.classList.remove("seleccionado")
            } else {
                cuadro.classList.add("seleccionado")
            }
        } else {
            const cuadroAnterior = document.getElementById(ubicacionSeleccionada)
            if (cuadroAnterior.classList.contains("seleccionado")) {
                cuadroAnterior.classList.remove("seleccionado")
            }
            ubicacionSeleccionada = event.target.id;
            const cuadro = document.getElementById(ubicacionSeleccionada)
            if (cuadro.classList.contains("seleccionado")) {
                cuadro.classList.remove("seleccionado")
            } else {
                cuadro.classList.add("seleccionado")
            }
        }
        consultarDatos(ubicacionSeleccionada)
    } else {
        console.log("Elemento no valido")
    }

})

function consultarDatos(idRack) {
    fetch(`/api/${idRack}`, {
        method: 'GET'
    })
    .then(response => {
        if(!response.ok){
            throw new Error("Ocurrio un error")   
        }
        return response.json()
    })
    .then(datos => {
        console.log(datos)
    })
    .catch(error => {
        console.error("Hubo un error:", error);
    })
}

function ordenarNumeroRacks() {
    const racks = document.querySelectorAll('.elementoRack')
    
    racks.forEach(rack => {
        const rectangulo = rack.querySelector('.rectangulo')
        const texto = rack.querySelector('.texto')

        const x = parseFloat(rectangulo.getAttribute('x'))
        const width = parseFloat(rectangulo.getAttribute('width'))
        const y = parseFloat(rectangulo.getAttribute('y'))
        const height = parseFloat(rectangulo.getAttribute('height'))

        const centroX = x + (width / 2)
        const centroY = y + (height - 18)

        texto.setAttribute('x', centroX)
        texto.setAttribute('y', centroY)
    })
}