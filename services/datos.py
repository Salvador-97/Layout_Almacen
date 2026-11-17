import pandas as pd

inventario = pd.read_excel('data/BoxInventory_20261118030828.xlsx')
catalogo = pd.read_excel('data/Ubicaciones.xlsx', sheet_name="Catalogo")
bloqueadas = pd.read_excel('data/Ubicaciones.xlsx', sheet_name="Bloqueadas")

#Ubicaciones disponibles sin bloqueo
ubicacionesSinBloqueo = catalogo[
    ~catalogo["UbicacionID"].isin(bloqueadas["UbicacionID"])
]
ubicacionesDisponibles = ubicacionesSinBloqueo[
    ~ubicacionesSinBloqueo["UbicacionID"].isin(inventario["cellNo"])
]

ubicacionesBloquedasCatalogo = catalogo[
    catalogo["UbicacionID"].isin(bloqueadas["UbicacionID"])
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

# Agregar nueva columna
catalogo["Estado"] = "Vacia"
# Agregamos los estados
catalogo.loc[catalogo["UbicacionID"].isin(inventario["cellNo"]), "Estado"] = "Ocupada"
catalogo.loc[catalogo["UbicacionID"].isin(bloqueadas["UbicacionID"]), "Estado"] = "Bloqueada"

def obtenerInformacionRack(idRack):
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