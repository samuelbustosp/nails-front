import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  newArticuloVenta,
  obtenerArticuloVenta,
} from "../Services/ArticuloVentaService";
import { obtenerLineas2 } from "../Services/LineaService";

export default function ArticuloVenta({ title }) {
  let navegacion = useNavigate();

  const { id } = useParams();

  const [articulo, setArticulo] = useState({
    denominacion: "",
    linea: 0,
  });

  const [listaLineas, setListaLineas] = useState([]);
  const [selectedLinea, setSelectedLinea] = useState({});
  const { denominacion, linea } = articulo;

  useEffect(() => {
    cargarModel();
    cargarLineas();
  }, []);

  const cargarModel = async () => {
    if (id > 0) {
      console.log(id);
      const resultado = await obtenerArticuloVenta(id);
      setArticulo(resultado);
      setSelectedLinea(resultado.linea);
    }
  };

  const cargarLineas = async () => {
    console.log(id);

    const resultado = await obtenerLineas2();
    setListaLineas(resultado);
  };

  const onInputChange = ({ target: { name, value } }) => {
    //spread operator ... (expandir los atributos)
    setArticulo({ ...articulo, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const data = {
      ...articulo,
      linea: selectedLinea, // Asumiendo que la línea seleccionada es el id de la línea
    };
    window.alert("id lina" + selectedLinea);
    newArticuloVenta(data);
    // Redirigimos a la pagina de inicio
    navegacion("/articuloList");
  };

  return (
    <div className="container">
      <div>
        <h1> Gestión de articulo / {title} </h1>
        <hr></hr>
      </div>

      <form onSubmit={(e) => onSubmit(e)}>
        <div className="mb-3">
          <label htmlFor="denominacion" className="form-label">
            {" "}
            Denominacion
          </label>
          <input
            type="text"
            className="form-control"
            id="denominacion"
            name="denominacion"
            required={true}
            value={denominacion}
            onChange={(e) => onInputChange(e)}
          />

          <label htmlFor="listaLineas">Selecciona una linea:</label>
          <select
            id="listaLineas"
            value={selectedLinea}
            required={true}
            onChange={(e) => setSelectedLinea(e.target.value)}
          >
            <option value="">Seleccione...</option>
            {listaLineas.map((linea) => (
              <option key={linea.id} value={linea.id}>
                {linea.denominacion}
              </option>
            ))}
          </select>
        </div>

        <div className="row d-md-flex justify-content-md-end">
          <div className="col-4">
            <button type="submit" className="btn btn-success btn-sm me-3">
              Guardar
            </button>
          </div>
          <div className="col-4">
            <a href="/articuloList" className="btn btn-info btn-sm me-3">
              Regresar
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}
