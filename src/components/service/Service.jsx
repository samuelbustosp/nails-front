import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { newService, getServiceById } from "../../Services/ServiceService";
import { obtenerClientesForCombo } from "../Services/ClienteService";
import { obtenerTiposServiciosForCombo } from "../Services/TypeServiceService";

export default function Servicio({ title }) {
  let navegation = useNavigate();
  const { id } = useParams();

  const [service, setService] = useState({
    denomination: "",
  });

  const [customersList, setCustomersList] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [typeService, setTypeService] = useState([]);
  const [services, setServices] = useState([]);
  const [total, setTotal] = useState(0); // Estado para el total
  const [errors, setErrors] = useState({
    date: "",
    customer: "",
    services: Array(services.length).fill({ typeService: "", price: "" }),
  });

  useEffect(() => {
    loadModel();
    loadCustomers();
    loadTypeServices();
  }, []);

  // Calcular el total cada vez que cambie la lista de servicios
  useEffect(() => {
    const newTotal = services.reduce(
      (acc, service) => acc + (parseFloat(service.price) || 0),
      0,
    );
    setTotal(newTotal);
  }, [services]);

  // const cargarModel2 = async () => {
  //   if (id > 0) {
  //     const resultado = await obtenerServicio(id);
  //     setServicio(resultado);
  //     setSelectedCliente(resultado.cliente.id); // Establecer el cliente seleccionado
  //     setFecha(new Date(resultado.fechaDocumento).toISOString().split("T")[0]); // Establecer la fecha
  //     setServicios(resultado.listaItems); // Establecer los item servicios cargados
  //   }
  // };

  const loadModel = async () => {
    if (id > 0) {
      const resultado = await getServiceById(id);
      setService(resultado);
      setSelectedCustomer(String(resultado.customer.id)); // Convertir a string
      setDate(new Date(resultado.fechaDocumento).toISOString().split("T")[0]);
      setServices(resultado.listaItems);
    }
  };

  const loadCustomers = async () => {
    const resultado = await obtenerClientesForCombo();
    setCustomersList(resultado);
  };

  const loadTypeServices = async () => {
    const resultado = await obtenerTiposServiciosForCombo();
    setTypeService(resultado);
  };

  const handleAddService = () => {
    setServices([
      ...services,
      { typeService: "", price: "", observations: "" },
    ]);
  };

  const handleRemoveService = (index) => {
    const newServices = [...services];
    newServices.splice(index, 1);
    setServices(newServices);
  };

  const handleServiceChange = (index, event) => {
    const { name, value } = event.target;
    const newServices = [...services];
    if (name === "typeService") {
      const selectedTypeService = typeService.find(
        (type) => type.id === parseInt(value),
      );
      newServices[index] = {
        ...newServices[index],
        typeServiceId: selectedTypeService.id,
        typeService: selectedTypeService.denomination,
      };
    } else {
      newServices[index] = { ...newServices[index], [name]: value };
    }
    setServices(newServices);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const currentDate = new Date().toISOString().split("T")[0];

    if (date > currentDate) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        date: "La fecha no puede ser mayor a la actual",
      }));
      return;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, date: "" }));
    }

    if (!selectedCustomer) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        customer: "Debe seleccionar un cliente",
      }));
      return;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, customer: "" }));
    }

    const newServicesErrors = services.map((item) => {
      const itemErrors = {};
      if (!item.typeService)
        itemErrors.typeService = "Debe seleccionar un tipo de servicio";
      if (!item.price) itemErrors.price = "Debe ingresar un precio";
      return itemErrors;
    });

    if (newServicesErrors.some((item) => Object.keys(item).length !== 0)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        services: newServicesErrors,
      }));
      return;
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        services: Array(services.length).fill({
          typoService: "",
          price: "",
        }),
      }));
    }

    const data = {
      ...service,
      documentDate: date,
      customer: selectedCustomer,
      itemList: services.map((item) => ({
        ...item,
        typeServiceId: item.typeServiceId,
      })),
    };

    await newService(data);
    navegation("/servicioList");
  };

  return (
    <div className="container">
      <div>
        <h1>Gestión de servicio / {title}</h1>
        <hr />
      </div>

      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <div>
            <label htmlFor="listaClientes">Selecciona un cliente: </label>
            <br />
            <select
              id="listaClientes"
              value={selectedCustomer} // Usamos la variable correctamente como string
              onChange={(e) => setSelectedCustomer(e.target.value)}
            >
              <option value="">Seleccione...</option>
              {customersList.map((customer) => (
                <option key={customer.id} value={String(customer.id)}>
                  {" "}
                  {/* Convertimos el id a string */}
                  {customer.businessName}
                </option>
              ))}
            </select>

            {errors.customer && <div className="error">{errors.customer}</div>}
          </div>

          <div>
            <label htmlFor="fecha">Fecha: </label>
            <br />
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            {errors.fecha && <div className="error">{errors.date}</div>}
          </div>
        </div>

        <label>Detalle del Servicio:</label>
        <hr />

        <div className="container text-center">
          <div className="row">
            <div className="col">Tipo de Servicio</div>
            <div className="col">Precio</div>
            <div className="col">Observaciones</div>
          </div>
        </div>

        {services.map((service, index) => (
          <div key={index}>
            <select
              name="typeService"
              value={service.typeServiceId || ""} // Aquí usas tipoServicioId
              onChange={(e) => handleServiceChange(index, e)}
            >
              <option value="">Seleccione un tipo de servicio</option>
              {typeService.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.denominacion}
                </option> // El value es el ID
              ))}
            </select>
            {errors.services[index]?.typeService && (
              <div className="error">
                {errors.services[index].typeService}
              </div>
            )}

            <label>Precio:</label>
            <input
              type="number"
              name="price"
              value={service.precio}
              onChange={(e) => handleServiceChange(index, e)}
            />
            {errors.services[index]?.price && (
              <div className="error">{errors.services[index].price}</div>
            )}

            <label>Observaciones:</label>
            <input
              type="text"
              name="observations"
              value={service.observations}
              onChange={(e) => handleServiceChange(index, e)}
            />
            <button type="button" onClick={() => handleRemoveService(index)}>
              Eliminar
            </button>
          </div>
        ))}

        <button type="button" onClick={handleAddService}>
          Agregar Servicio
        </button>

        <div>
          <h4>Total: {total}</h4>
        </div>

        <button type="submit">Guardar</button>
      </form>
    </div>
  );
}
