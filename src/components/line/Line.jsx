import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  newLine, 
  getLineById
  } from "../../Services/LineService";

export default function Line({ title }) {
  let navegation = useNavigate();

  const { id } = useParams();

  const [line, setLine] = useState({
    denomination: "",
  });

  const { denomination } = line;

  useEffect(() => {
    cargarModel();
  }, []);

  const cargarModel = async () => {
    if (id > 0) {
      console.log(id);
      const resultado = await getLineById(id);
      console.log(resultado);
      setLine(resultado);
    }
  };

  const onInputChange = ({ target: { name, value } }) => {
    //spread operator ... (expandir los atributos)
    setLine({ ...line, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    newLine(line);
    // Redirigimos a la pagina de inicio
    navegation("/lineaList");
  };

  return (
    <div className="container">
      <div>
        <h1> Gestión de Linea / {title} </h1>
        <hr></hr>
      </div>

      <form onSubmit={(e) => onSubmit(e)}>
        <div className="mb-3">
          <label htmlFor="denomination" className="form-label">
            {" "}
            Denominacion
          </label>
          <input
            type="text"
            className="form-control"
            id="denominacion"
            name="denominacion"
            required={true}
            value={denomination}
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
