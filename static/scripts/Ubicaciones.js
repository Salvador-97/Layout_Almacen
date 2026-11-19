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
    informacionGeneral(informacion)
})
.catch(error => {
    console.error("Error al obtener datos: ", error)
})


const inputArchivo = document.getElementById("archivoInventario")

inputArchivo.addEventListener("change", e => {
    archivoWMS = inputArchivo.files[0]
    if (!archivoWMS) return

    const formulario = new FormData()
    formulario.append("archivoInventario", archivoWMS)

    fetch(`/api/inventario`, {
        method: 'POST',
        body: formulario
    })
    .then(response => {
        if(!response.ok){
            throw new Error("Error al leer WMS")
        }
        return response.json()
    })
    .then(informacion => {
        informacionGeneral(informacion.listaDatos)
        inputArchivo.value = ""
    })
    .catch(error => {
        console.error("Error al obtener datos: ", error)
    })
})

function informacionGeneral(informacion) {
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
}

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
                agregarClaseEstado(bahia, "noDisponible")
                idUbicacion.textContent = ""
                return
            }
            
            agregarClaseEstado(bahia, bahiaEncontrada.Estado)
            estado.textContent = bahiaEncontrada.Estado
            cajas.textContent = "Cajas"
            idUbicacion.textContent = bahiaEncontrada.UbicacionID
        })
    })
    .catch(error => {
        console.error("Hubo un error:", error);
    })
}

function agregarClaseEstado(bahia, estado) {
    switch(estado){
        case "Disponible":
            bahia.classList.remove("bahia-vacia")
            bahia.classList.remove("bahia-bloqueada")
            bahia.classList.remove("bahia-noDisponible")
            bahia.classList.remove("bahia-ocupada")
            bahia.classList.add("bahia-disponible")
            break
        case "Vacia":
            bahia.classList.remove("bahia-disponible")
            bahia.classList.remove("bahia-bloqueada")
            bahia.classList.remove("bahia-noDisponible")
            bahia.classList.remove("bahia-ocupada")
            bahia.classList.add("bahia-vacia")
            break
        case "Bloqueada":
            bahia.classList.remove("bahia-vacia")
            bahia.classList.remove("bahia-disponible")
            bahia.classList.remove("bahia-noDisponible")
            bahia.classList.remove("bahia-ocupada")
            bahia.classList.add("bahia-bloqueada")
            break
        case "Ocupada":
            bahia.classList.remove("bahia-vacia")
            bahia.classList.remove("bahia-bloqueada")
            bahia.classList.remove("bahia-disponible")
            bahia.classList.remove("bahia-noDisponible")
            bahia.classList.add("bahia-ocupada")
            break
        case "noDisponible":
            bahia.classList.remove("bahia-vacia")
            bahia.classList.remove("bahia-bloqueada")
            bahia.classList.remove("bahia-disponible")
            bahia.classList.remove("bahia-ocupada")
            bahia.classList.add("bahia-noDisponible")
            break
    }
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