import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { newService, getServiceById } from "../../Services/ServiceService";
import { getServicesTypesForCombo } from "../../services/ServiceTypeService";
import { getCustomersForCombo } from "../../Services/CustomerService";

export default function Service({ title }) {
  let navegation = useNavigate();
  const { id } = useParams();

  const [service, setService] = useState({});

  const [customersList, setCustomersList] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [date, setDate] = useState(new Date().getTime());  // Esto ahora incluye la fecha y la hora
  const [serviceType, setServiceType] = useState([]);
  const [services, setServices] = useState([]);
  const [total, setTotal] = useState(0); // Estado para el total
  const [errors, setErrors] = useState({
    date: "",
    customer: "",
    services: Array(services.length).fill({ serviceType: "", price: "" }),
  });

  useEffect(() => {
    if (id) {  // Verifica que el id está presente antes de cargar los datos
      loadModel();
    }
    loadCustomers();
    loadServicesType();
  }, [id]);  // Agrega [id] como dependencia
  

  // Calcular el total cada vez que cambie la lista de servicios
  useEffect(() => {
    const newTotal = services.reduce(
      (acc, service) => acc + (parseFloat(service.price) || 0),
      0,
    );
    setTotal(newTotal);
  }, [service, services]);

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
    if (id) {  // Si el id tiene algún valor
      try {
        const response = await getServiceById(id);
        console.log(response);
  
        // Cargar el servicio
        setService(response);
  
        // Cargar cliente
        setSelectedCustomer(String(response.customerId));
  
        // Cargar fecha
        setDate(new Date(response.registrationTimestamp).toISOString().split("T")[0]);
  
        // Verificar si itemList es un arreglo antes de procesarlo
        if (Array.isArray(response.serviceItems)) { 
          setServices(
            response.serviceItems.map((item) => ({
              serviceTypeId: item.serviceType?.id || "", // Si serviceType no existe, asignamos un string vacío
              serviceType: item.serviceType?.denomination || "", // Si denomination no existe, asignamos un string vacío
              price: item.price || 0, // Si price no existe, asignamos 0
              observations: item.observations || "", // Si observations no existe, asignamos un string vacío
            }))
          );
        } else {
          console.error('itemList no es un arreglo válido');
          setServices([]); // Si itemList no es válido, asignamos un arreglo vacío
        }
      } catch (error) {
        console.error("Error cargando el modelo:", error);
      }
    }
  };
  
  
  

  const loadCustomers = async () => {
    const resultado = await getCustomersForCombo();
    setCustomersList(resultado);
  };

  const loadServicesType = async () => {
    const response = await getServicesTypesForCombo();
    setServiceType(response);
  };

  const handleAddService = () => {
    setServices([
      ...services,
      { serviceType: "", price: 0, observations: "" },
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
    
    // Si el campo es "serviceType", se actualiza el serviceTypeId
    if (name === "serviceType") {
      const selectedServiceType = serviceType.find(
        (type) => type.id === parseInt(value)
      );
      newServices[index] = {
        ...newServices[index],
        serviceTypeId: selectedServiceType?.id, // Validación segura
        serviceType: selectedServiceType?.denomination, // Denominación segura
      };
    }
    
    
    // Actualiza el estado de los servicios
    setServices(newServices);
  };
  

  const onSubmit = async (e) => {
    e.preventDefault(); // Prevenir el envío del formulario
    console.log("Iniciando validación del formulario...");
  
    const currentTimestamp = Date.now(); // Fecha y hora actual en timestamp
    const selectedTimestamp = date; // Ya tienes el timestamp almacenado
  
    console.log("Fecha seleccionada (timestamp):", selectedTimestamp);
    console.log("Fecha actual (currentTimestamp):", currentTimestamp);
  
    if (selectedTimestamp < currentTimestamp) {
      console.error("Error: La fecha no puede ser mayor a la actual");
      setErrors((prevErrors) => ({
        ...prevErrors,
        date: "La fecha no puede ser mayor a la actual",
      }));
      return; // Finaliza si la validación falla
    }
  
    if (!selectedCustomer) {
      console.error("Error: No se seleccionó un cliente");
      setErrors((prevErrors) => ({
        ...prevErrors,
        customer: "Debe seleccionar un cliente",
      }));
      return; // Finaliza si no hay cliente seleccionado
    }
  
    const newServicesErrors = services.map((item, index) => {
      const itemErrors = {};
      if (!item.serviceType) {
        itemErrors.serviceType = "Debe seleccionar un tipo de servicio";
        console.error(`Error en el servicio ${index}: Falta el tipo de servicio`);
      }
      if (!item.price) {
        itemErrors.price = "Debe ingresar un precio";
        console.error(`Error en el servicio ${index}: Falta el precio`);
      }
      return itemErrors;
    });
  
    if (newServicesErrors.some((item) => Object.keys(item).length !== 0)) {
      console.error("Errores en los servicios:", newServicesErrors);
      setErrors((prevErrors) => ({
        ...prevErrors,
        services: newServicesErrors,
      }));
      return; // Finaliza si hay errores en los servicios
    }
  
    // Si todas las validaciones son correctas, llega aquí
    console.log("Validaciones completas, preparando data...");
    const selectedCustomerObject = customersList.find((cust) => cust.id === Number(selectedCustomer));
    
    const data = {
      ...service,
      registrationTimestamp: selectedTimestamp, 
      customer: selectedCustomerObject,
      total: parseFloat(total), //Agregamos el total para almacenarlo
      serviceItems: services.map((item) => ({
        observation: item.observations,
        serviceType: { id: item.serviceTypeId },
        price: parseFloat(item.price), 
      })),
    };
    
    console.log("Datos enviados al backend:", data);
    console.log(data.serviceItems)
    await newService(data); // Envía la data a la API
    navegation("/service-list"); // Redirige después del envío
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
            <label htmlFor="customer-list">Selecciona un cliente: </label>
            <br />
            <select
              id="customer-list"
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
            <label htmlFor="date">Fecha: </label>
            <br />
            <input
              type="date"
              id="date"
              value={new Date(date).toISOString().split("T")[0]} // Convertir timestamp a string ISO y tomar solo la fecha
              onChange={(e) => {
                const selectedDate = e.target.value; // Fecha en formato "YYYY-MM-DD"
                const timestamp = new Date(selectedDate + "T00:00:00Z").getTime(); // Convertir a timestamp
                setDate(timestamp); // Guardar como timestamp
              }}
            />
            {errors.fecha && <div className="error">{errors.date}</div>}
          </div>
        </div>

        <label>Detalle del Servicio:</label>
        <hr />

        <div className="container text-center">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Tipo de Servicio</th>
                <th>Precio</th>
                <th>Observaciones</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service, index) => (
                <tr key={index}>
                  <td>
                    <select
                      name="serviceType"
                      value={service.serviceTypeId || ""}
                      onChange={(e) => handleServiceChange(index, e)}
                    >
                      <option value="">Seleccione un tipo de servicio</option>
                      {serviceType.length > 0 ? (
                        serviceType.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.denomination}
                          </option>
                        ))
                      ) : (
                        <option>Cargando tipos de servicio...</option>
                      )}
                    </select>
                    {errors.services[index]?.serviceType && (
                      <div className="error">
                        {errors.services[index].serviceType}
                      </div>
                    )}
                  </td>
                  <td>
                    <input
                      type="number"
                      name="price"
                      value={service.price}
                      onChange={(e) => handleServiceChange(index, e)}
                    />
                    {errors.services[index]?.price && (
                      <div className="error">{errors.services[index].price}</div>
                    )}
                  </td>
                  <td>
                    <input
                      type="text"
                      name="observations"
                      value={service.observations}
                      onChange={(e) => handleServiceChange(index, e)}
                    />
                  </td>
                  <td>
                    
                    <button type="button" onClick={() => handleRemoveService(index)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button type="button" onClick={handleAddService}>
          Agregar Servicio
        </button>

        

        <div>
          <h4>Total: {total.toLocaleString('es-AR')}</h4>
        </div>

        <button type="submit" color="red">Guardar</button>
      </form>
    </div>
  );
}
