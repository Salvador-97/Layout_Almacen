import pandas as pd

def obtenerInformacionGeneral(inventario, catalogo, bloqueadas) :
    ubicacionesSinBloqueo = catalogo[
        ~catalogo["UbicacionID"].isin(bloqueadas["UbicacionID"])
    ]
    ubicacionesBloquedasCatalogo = catalogo[
        catalogo["UbicacionID"].isin(bloqueadas["UbicacionID"])
    ]
    ubicacionesDisponibles = ubicacionesSinBloqueo[
        ~ubicacionesSinBloqueo["UbicacionID"].isin(inventario["cellNo"])
    ]
    #Ubicaciones ocupadas
    ubicacionesOcupadas = catalogo[
        catalogo["UbicacionID"].isin(inventario["cellNo"])
    ]
    #Ubicaciones bloquedas con inventario
    ubicacionesOcupadasBloquedas = catalogo[
        catalogo["UbicacionID"].isin(bloqueadas["UbicacionID"]) &
        catalogo["UbicacionID"].isin(inventario["cellNo"])
    ]
    
    totalUbicaciones = len(ubicacionesDisponibles) + len(ubicacionesOcupadas) + len(ubicacionesBloquedasCatalogo)
    listaGeneral = [totalUbicaciones, len(ubicacionesDisponibles), len(ubicacionesOcupadas), len(ubicacionesBloquedasCatalogo)]
    
    return listaGeneral

def agregarEstadoCatalogo(catalogo, inventario, bloqueadas) :
    # Agregar nueva columna
    catalogo["Estado"] = "Vacia"
    # Agregamos los estados
    catalogo.loc[catalogo["UbicacionID"].isin(inventario["cellNo"]), "Estado"] = "Ocupada"
    catalogo.loc[catalogo["UbicacionID"].isin(bloqueadas["UbicacionID"]), "Estado"] = "Bloqueada"
    
    return catalogo

def obtenerInformacionRack(idRack, inventario, catalogo):
    detalleRack = catalogo[
    catalogo["RackID"] == idRack
    ]
    
    inventarioRack = inventario[
    inventario["cellNo"].str.startswith(idRack + "-")
    ]
    
    rackAgrupadoUbicaciones = inventarioRack.groupby('cellNo')[
        [
            'Total Stock/总库存', 
            'Available stock/可用库存', 
            'Locked Inventory/锁定库存'
        ]
    ].sum()

    rackCompleto = detalleRack.merge(
        rackAgrupadoUbicaciones,
        left_on="UbicacionID",
        right_on="cellNo",
        how="left"
    )

    rackSinNulos = rackCompleto.fillna({
    'Total Stock/总库存': 0,
    'Available stock/可用库存': 0,
    'Locked Inventory/锁定库存': 0
        }
    )
    
    informacionRacks = rackSinNulos.to_dict('records')
    
    return informacionRacks