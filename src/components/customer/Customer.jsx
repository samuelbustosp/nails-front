import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCustomerById } from "../../Services/CustomerService";

export default function Customer({ title }) {
  
  let navegation = useNavigate();

  const { id } = useParams();

  const [customer, setCustomer] = useState({
    razonSocial: "",
    celular: "",
    mail: "",
  });

  const { razonSocial, celular, mail } = customer;

  useEffect(() => {
    loadCustomer();
  }, []);

  const loadCustomer = async () => {
    console.log(id);
    if (id > 0) {
      console.log(id);
      const resultado = await getCustomerById(id);
      console.log(resultado);
      setCustomer(resultado);
    }
  };

  const onInputChange = ({ target: { name, value } }) => {
    //spread operator ... (expandir los atributos)
    setCustomer({ ...customer, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const urlBase = "http://localhost:8080/nails/clientes";
    if (id > 0) {
      await axios.put(`${urlBase}/${id}`, customer);
    } else {
      await axios.post(urlBase, customer);
    }
    // Redirigimos a la pagina de inicio
    navegation("/clienteList");
  };

  return (
    <div className="container">
      <div>
        <h1> Gestión de Clientes / {title} </h1>
        <hr></hr>
      </div>

      <form onSubmit={(e) => onSubmit(e)}>
        <div className="mb-3">
          <label htmlFor="razonSocial" className="form-label">
            {" "}
            Apellido Nombre
          </label>
          <input
            type="text"
            className="form-control"
            id="razonSocial"
            name="razonSocial"
            required={true}
            value={razonSocial}
            onChange={(e) => onInputChange(e)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="celular" className="form-label">
            {" "}
            celular
          </label>
          <input
            type="number"
            className="form-control"
            id="celular"
            name="celular"
            required={true}
            value={celular}
            onChange={(e) => onInputChange(e)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="mail" className="form-label">
            {" "}
            mail
          </label>
          <input
            type="email"
            className="form-control"
            id="mail"
            name="mail"
            value={mail}
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
            <a href="/clienteList" className="btn btn-info btn-sm me-3">
              Regresar
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}
