import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { newLinea, obtenerLinea } from "../Services/LineaService";

export default function Linea({ title }) {
  let navegacion = useNavigate();

  const { id } = useParams();

  const [linea, setLinea] = useState({
    denominacion: "",
  });

  const { denominacion } = linea;

  useEffect(() => {
    cargarModel();
  }, []);

  const cargarModel = async () => {
    if (id > 0) {
      console.log(id);
      const resultado = await obtenerLinea(id);
      console.log(resultado);
      setLinea(resultado);
    }
  };

  const onInputChange = ({ target: { name, value } }) => {
    //spread operator ... (expandir los atributos)
    setLinea({ ...linea, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    newLinea(linea);
    // Redirigimos a la pagina de inicio
    navegacion("/lineaList");
  };

  return (
    <div className="container">
      <div>
        <h1> Gestión de Linea / {title} </h1>
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
        </div>

        <div className="row d-md-flex justify-content-md-end">
          <div className="col-4">
            <button type="submit" className="btn btn-success btn-sm me-3">
              Guardar
            </button>
          </div>
          <div className="col-4">
            <a href="/lineaList" className="btn btn-info btn-sm me-3">
              Regresar
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}
