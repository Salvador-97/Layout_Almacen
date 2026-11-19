const layout = document.querySelector("svg")
let ubicacionSeleccionada = ""
ordenarNumeroRacks()

fetch(`/api`, {
    method: 'GET'
})
.then(response => {
    if(!response.ok){
        throw new Error("Error al leer WMS")
    }
    return response.json()
})
.then(informacion => {
    const totalUbicaciones = informacion[0]
    const ubicacionesDisponibles = informacion[1]
    const ubicacionesOcupadas = informacion[2]
    const ubicacionesBloqueadas = informacion[3]

    const total = document.getElementById('total')
    const disponibles = document.getElementById('disponibles')
    const ocupadas = document.getElementById('ocupadas')
    const bloqueadas = document.getElementById('bloqueadas')
    
    total.textContent = totalUbicaciones
    disponibles.textContent = ubicacionesDisponibles
    ocupadas.textContent = ubicacionesOcupadas
    bloqueadas.textContent = ubicacionesBloqueadas
})
.catch(error => {
    console.error("Error al obtener datos: ", error)
})

layout.addEventListener("click", event => {
    if (event.target.tagName === "rect") {
        if (ubicacionSeleccionada == "") {
            console.log(ubicacionSeleccionada)
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
        const rackSeleccionado = document.getElementById('rack-seleccionado')
        rackSeleccionado.textContent = idRack
        const rackCompleto = document.querySelectorAll('.bahia')

        rackCompleto.forEach(bahia => {
            const idBahia = bahia.id
            const estado = bahia.querySelector('.estadoUbicacion')
            const cajas = bahia.querySelector('.cajasUbicacion')
            const idUbicacion = bahia.querySelector('.idUbicacion')
            const bahiaEncontrada = datos.find(rack => rack.Posicion == idBahia)

            if(!bahiaEncontrada){
                console.log("No se encontro: ", bahia.id)
                estado.textContent = "No disponible"
                idUbicacion.textContent = ""
                return
            }
            
            estado.textContent = bahiaEncontrada.Estado
            //cajas.textContent = bahiaEncontrada.Cajas
            idUbicacion.textContent = bahiaEncontrada.UbicacionID
        })
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