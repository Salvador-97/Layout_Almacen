import pandas as pd
from flask import Flask, render_template, jsonify, request
from services.datos import obtenerInformacionRack, agregarEstadoCatalogo, obtenerInformacionGeneral

app = Flask(__name__)
inventario = None
catalogoEstados = None
listaGeneral = None

@app.route("/")
def main():
    global catalogo, bloqueadas
    catalogo = pd.read_excel('data/Ubicaciones.xlsx', sheet_name="Catalogo")
    bloqueadas = pd.read_excel('data/Ubicaciones.xlsx', sheet_name="Bloqueadas")
    
    return render_template("index.html")

@app.route("/api")
def mainLayout():
    if listaGeneral is None:
        return jsonify({
            "error": "No hay base de datos"
        })
    return jsonify(listaGeneral)

@app.route("/api/inventario", methods=["POST"])
def cargarInventario():
    global inventario, catalogoEstados, listaGeneral
    
    archivoWMS = request.files.get("archivoInventario")
    
    if archivoWMS == None or archivoWMS == "":
        return jsonify({
            "error": "No se selecciono una base de datos...",
        }), 400

    try :
        inventario = pd.read_excel(archivoWMS)
        catalogoEstados = agregarEstadoCatalogo(catalogo, inventario, bloqueadas)
        listaGeneral =  obtenerInformacionGeneral(inventario, catalogo, bloqueadas)
    
    except Exception as error: 
        return jsonify({
            "error": str(error)
        }), 400
    return jsonify({
            "mensaje": "Inventario actualizado correctamente",
            "listaDatos": listaGeneral
        })
    
@app.route("/api/<idRack>")
def informacionRack(idRack):
    if inventario is None or catalogoEstados is None:
        return jsonify({
            "error": "Seleccione una base de datos..."
        }), 400
        
    informacion = obtenerInformacionRack(idRack, inventario, catalogoEstados)
    return jsonify(informacion)

if __name__ == "__main__":
    app.run(debug=True)