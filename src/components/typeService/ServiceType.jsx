import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  newServiceType,
  getServiceType,
} from "../../Services/ServiceTypeService";

export default function ServiceType({ title }) {
  let navegation = useNavigate();

  const { id } = useParams();

  const [serviceType, setServiceType] = useState({
    denomination: "",
  });

  const { denomination } = serviceType;

  useEffect(() => {
    loadModel();
  }, []);

  const loadModel = async () => {
    if (id > 0) {
      console.log(id);
      const response = await getServiceType(id);
      setServiceType(response);
    }
  };

  const onInputChange = ({ target: { name, value } }) => {
    //spread operator ... (expandir los atributos)
    setServiceType({ ...serviceType, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    newServiceType(serviceType);
    // Redirigimos a la pagina de inicio
    navegation("/tipoServicioList");
  };

  return (
    <div className="container">
      <div>
        <h1> Gestión de tipo servicio / {title} </h1>
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
            id="denomination"
            name="denomination"
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
            <a href="/tipoServicioList" className="btn btn-info btn-sm me-3">
              Regresar
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}
