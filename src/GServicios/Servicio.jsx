import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { newServicio, obtenerServicio } from "../Services/ServicioService";
import { obtenerClientesForCombo } from "../Services/ClienteService";
import { obtenerTiposServiciosForCombo } from "../Services/TipoServicioService";

export default function Servicio({ title }) {
  let navegacion = useNavigate();
  const { id } = useParams();

  const [servicio, setServicio] = useState({
    denominacion: "",
  });

  const [listaClientes, setListaClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [tiposServicio, setTiposServicio] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [total, setTotal] = useState(0); // Estado para el total
  const [errors, setErrors] = useState({
    fecha: "",
    cliente: "",
    servicios: Array(servicios.length).fill({ tipoServicio: "", precio: "" }),
  });

  useEffect(() => {
    cargarModel();
    cargarClientes();
    cargarTipoServicios();
  }, []);

  // Calcular el total cada vez que cambie la lista de servicios
  useEffect(() => {
    const nuevoTotal = servicios.reduce(
      (acc, servicio) => acc + (parseFloat(servicio.precio) || 0),
      0,
    );
    setTotal(nuevoTotal);
  }, [servicios]);

  const cargarModel2 = async () => {
    if (id > 0) {
      const resultado = await obtenerServicio(id);
      setServicio(resultado);
      setSelectedCliente(resultado.cliente.id); // Establecer el cliente seleccionado
      setFecha(new Date(resultado.fechaDocumento).toISOString().split("T")[0]); // Establecer la fecha
      setServicios(resultado.listaItems); // Establecer los item servicios cargados
    }
  };
  const cargarModel = async () => {
    if (id > 0) {
      const resultado = await obtenerServicio(id);
      setServicio(resultado);
      setSelectedCliente(String(resultado.cliente.id)); // Convertir a string
      setFecha(new Date(resultado.fechaDocumento).toISOString().split("T")[0]);
      setServicios(resultado.listaItems);
    }
  };

  const cargarClientes = async () => {
    const resultado = await obtenerClientesForCombo();
    setListaClientes(resultado);
  };

  const cargarTipoServicios = async () => {
    const resultado = await obtenerTiposServiciosForCombo();
    setTiposServicio(resultado);
  };

  const handleAddServicio = () => {
    setServicios([
      ...servicios,
      { tipoServicio: "", precio: "", observaciones: "" },
    ]);
  };

  const handleRemoveServicio = (index) => {
    const newServicios = [...servicios];
    newServicios.splice(index, 1);
    setServicios(newServicios);
  };

  const handleServicioChangeBoorar = (index, event) => {
    const { name, value } = event.target;
    const newServicios = [...servicios];
    newServicios[index] = { ...newServicios[index], [name]: value };
    setServicios(newServicios);
  };

  const handleServicioChange = (index, event) => {
    const { name, value } = event.target;
    const newServicios = [...servicios];

    if (name === "tipoServicio") {
      const tipoServicioSeleccionado = tiposServicio.find(
        (tipo) => tipo.id === parseInt(value),
      );
      newServicios[index] = {
        ...newServicios[index],
        tipoServicioId: tipoServicioSeleccionado.id,
        tipoServicio: tipoServicioSeleccionado.denominacion,
      };
    } else {
      newServicios[index] = { ...newServicios[index], [name]: value };
    }
    setServicios(newServicios);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const fechaActual = new Date().toISOString().split("T")[0];

    if (fecha > fechaActual) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        fecha: "La fecha no puede ser mayor a la actual",
      }));
      return;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, fecha: "" }));
    }

    if (!selectedCliente) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        cliente: "Debe seleccionar un cliente",
      }));
      return;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, cliente: "" }));
    }

    const newServiciosErrors = servicios.map((item) => {
      const itemErrors = {};
      if (!item.tipoServicio)
        itemErrors.tipoServicio = "Debe seleccionar un tipo de servicio";
      if (!item.precio) itemErrors.precio = "Debe ingresar un precio";
      return itemErrors;
    });

    if (newServiciosErrors.some((item) => Object.keys(item).length !== 0)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        servicios: newServiciosErrors,
      }));
      return;
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        servicios: Array(servicios.length).fill({
          tipoServicio: "",
          precio: "",
        }),
      }));
    }

    const data = {
      ...servicio,
      fechaDocumento: fecha,
      cliente: selectedCliente,
      listaItems: servicios.map((item) => ({
        ...item,
        tipoServicioId: item.tipoServicioId,
      })),
    };

    await newServicio(data);
    navegacion("/servicioList");
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
              value={selectedCliente} // Usamos la variable correctamente como string
              onChange={(e) => setSelectedCliente(e.target.value)}
            >
              <option value="">Seleccione...</option>
              {listaClientes.map((cliente) => (
                <option key={cliente.id} value={String(cliente.id)}>
                  {" "}
                  {/* Convertimos el id a string */}
                  {cliente.razonSocial}
                </option>
              ))}
            </select>

            {errors.cliente && <div className="error">{errors.cliente}</div>}
          </div>

          <div>
            <label htmlFor="fecha">Fecha: </label>
            <br />
            <input
              type="date"
              id="fecha"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
            {errors.fecha && <div className="error">{errors.fecha}</div>}
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

        {servicios.map((servicio, index) => (
          <div key={index}>
            <select
              name="tipoServicio"
              value={servicio.tipoServicioId || ""} // Aquí usas tipoServicioId
              onChange={(e) => handleServicioChange(index, e)}
            >
              <option value="">Seleccione un tipo de servicio</option>
              {tiposServicio.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.denominacion}
                </option> // El value es el ID
              ))}
            </select>
            {errors.servicios[index]?.tipoServicio && (
              <div className="error">
                {errors.servicios[index].tipoServicio}
              </div>
            )}

            <label>Precio:</label>
            <input
              type="number"
              name="precio"
              value={servicio.precio}
              onChange={(e) => handleServicioChange(index, e)}
            />
            {errors.servicios[index]?.precio && (
              <div className="error">{errors.servicios[index].precio}</div>
            )}

            <label>Observaciones:</label>
            <input
              type="text"
              name="observaciones"
              value={servicio.observaciones}
              onChange={(e) => handleServicioChange(index, e)}
            />
            <button type="button" onClick={() => handleRemoveServicio(index)}>
              Eliminar
            </button>
          </div>
        ))}

        <button type="button" onClick={handleAddServicio}>
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
