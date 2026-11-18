import pandas as pd
from flask import Flask, render_template, jsonify
from services.datos import obtenerInformacionRack, agregarEstadoCatalogo, obtenerInformacionGeneral

app = Flask(__name__)
catalogo = pd.read_excel('data/Ubicaciones.xlsx', sheet_name="Catalogo")
bloqueadas = pd.read_excel('data/Ubicaciones.xlsx', sheet_name="Bloqueadas")
inventario = pd.read_excel('data/BoxInventory_20261118030828.xlsx')
catalogoEstados = agregarEstadoCatalogo(catalogo, inventario, bloqueadas)
listaGeneral =  obtenerInformacionGeneral(inventario, catalogo, bloqueadas)

@app.route("/")
def main():
    return render_template("index.html")


@app.route("/api")
def mainLayout():
    return listaGeneral
    
@app.route("/api/<idRack>")
def informacionRack(idRack):
    informacion = obtenerInformacionRack(idRack, inventario, catalogoEstados)
    return jsonify(informacion)

if __name__ == "__main__":
    app.run(debug=True)