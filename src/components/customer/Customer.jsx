import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCustomerById } from "../../Services/CustomerService";

export default function Customer({ title }) {
  
  let navegation = useNavigate();

  const { id } = useParams();

  const [customer, setCustomer] = useState({
    businessName: "",
    phoneNumber: "",
    email: "",
  });

  const { businessName, phoneNumber, email } = customer;

  useEffect(() => {
    loadCustomer();
  }, []);

  const loadCustomer = async () => {
    console.log(id);
    if (id > 0) {
      console.log(id);
      const response = await getCustomerById(id);
      console.log(response);
      setCustomer(response);
    }
  };

  const onInputChange = ({ target: { name, value } }) => {
    //spread operator ... (expandir los atributos)
    setCustomer({ ...customer, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const urlBase = "http://localhost:8080/nails/customer";
    console.log("Enviando los datos: ", customer); // Verifica el objeto customer
  
    if (id > 0) {
      try {
        await axios.put(`${urlBase}/${id}`, customer);
      } catch (error) {
        console.error("Error al actualizar el cliente:", error);
      }
    } else {
      try {
        await axios.post(urlBase, customer);
      } catch (error) {
        console.error("Error al crear el cliente:", error);
      }
    }
  
    // Redirigimos a la página de inicio
    navegation("/customer-list");
  };
  

  return (
    <div className="container">
      <div>
        <h1> Gestión de Clientes / {title} </h1>
        <hr></hr>
      </div>

      <form onSubmit={(e) => onSubmit(e)}>
        <div className="mb-3">
          <label htmlFor="businessName" className="form-label">
            {" "}
            Apellido Nombre
          </label>
          <input
            type="text"
            className="form-control"
            id="businessName"
            name="businessName"
            required={true}
            value={businessName}
            onChange={(e) => onInputChange(e)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="phoneNumber" className="form-label">
            {" "}
            celular
          </label>
          <input
            type="text"
            className="form-control"
            id="phoneNumber"
            name="phoneNumber"
            required={true}
            value={phoneNumber}
            onChange={(e) => onInputChange(e)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            {" "}
            mail
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={email}
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
            <a href="/customer-list" className="btn btn-info btn-sm me-3">
              Regresar
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}
