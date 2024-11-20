import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ITEMS_PER_PAGE, API_URL } from "../App.config";
import { ClienteContext } from "./ClienteContext";
import { obtenerClientes, eliminarCliente } from "../Services/ClienteService";
import { CustomerContext } from "../../contexts/CustomerContext";
import { deleteCustomer, getCustomers } from "../../Services/CustomerService";

export default function ListadoCliente() {
  const { customers, setCustomers } = useContext(CustomerContext);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(ITEMS_PER_PAGE);
  const [totalPages, setTotalPages] = useState(0);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  }); //se utiliza para el orden

  useEffect(() => {
    getData();
  }, [page, pageSize, query]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const getData = async () => {
    console.log("carga " + page);
    getCustomers(query, page, pageSize)
      .then((response) => {
        setCustomers(response.content);
        setTotalPages(response.totalPages);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
  };

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const handleDeleteCustomer = async (id) => {
    try {
      const response = await deleteCustomer(id);
      if (response) {
        getData();
      } else {
        console.error("Error al eliminar el cliente");
      }
    } catch (error) {
      console.error("Error al eliminar el cliente:", error);
    }
  };

  ///////////////////////////////////////Para el orden de las tablas///////////////////////////////////////////////////

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = () => {
    const sorted = [...customers];
    if (sortConfig.key !== null) {
      sorted.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sorted;
  };
  ///////////////////////////////////////Hasta aca para el orden de las tablas///////////////////////////////////////////////////

  return (
    <div className="container">
      <div>
        <h1> Gestión de Clientes </h1>
        <hr></hr>
      </div>

      <div className="row d-md-flex justify-content-md-end">
        <div className="col-5">
          <input
            id="query"
            name="query"
            className="form-control me-2"
            type="search"
            aria-label="Search"
            value={query}
            onChange={handleQueryChange}
          ></input>
        </div>
        <div className="col-1">
          <button
            onClick={() => getDatos()}
            className="btn btn-outline-success"
            type="submit"
          >
            Buscar
          </button>
        </div>
      </div>
      <hr></hr>
      <table className="table table-striped table-hover align-middle">
        <thead className="table-dark">
          <tr>
            <th scope="col" onClick={() => handleSort("id")}>
              #
              {sortConfig.key === "id" && (
                <span>
                  {sortConfig.direction === "ascending" ? " 🔽" : " 🔼"}
                </span>
              )}
            </th>
            <th scope="col" onClick={() => handleSort("razonSocial")}>
              Apellido y Nombre
              {sortConfig.key === "razonSocial" && (
                <span>
                  {sortConfig.direction === "ascending" ? " 🔽" : " 🔼"}
                </span>
              )}
            </th>
            <th scope="col" onClick={() => handleSort("celular")}>
              Cel
              {sortConfig.key === "celular" && (
                <span>
                  {sortConfig.direction === "ascending" ? " 🔽" : " 🔼"}
                </span>
              )}
            </th>
            <th scope="col" onClick={() => handleSort("mail")}>
              Mail
              {sortConfig.key === "mail" && (
                <span>
                  {sortConfig.direction === "ascending" ? " 🔽" : " 🔼"}
                </span>
              )}
            </th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {
            //iteramos empleados
            sortedData().map((customer, index) => (
              <tr key={index}>
                <th scope="row">{customer.id}</th>
                <td>{customer.razonSocial}</td>
                <td>{customer.celular}</td>
                <td>{customer.mail}</td>

                <td className="text-center">
                  <div>
                    <Link
                      to={`/cliente/${cliente.id}`}
                      className="btn btn-link btn-sm me-3"
                    >
                      Editar
                    </Link>

                    <button
                      onClick={() => handleDeleteCustomer(customer.id)}
                      className="btn btn-link btn-sm me-3"
                    >
                      {" "}
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>

      <div className="row d-md-flex justify-content-md-end">
        <div className="col-4">
          <Link to={`/cliente`} className="btn btn-success btn-sm me-3">
            Nuevo
          </Link>
        </div>
        <div className="col-4">
          <Link to={`/`} className="btn btn-info btn-sm me-3">
            Regresar
          </Link>
        </div>
      </div>

      {/* /////////////////////// Esto se utiliza para hacer la paginacion  ///////////////////////////////// */}

      <div className="pagination d-md-flex justify-content-md-end">
        {Array.from({ length: totalPages }, (_, i) => i).map((pageNumber) => (
          <a
            key={pageNumber}
            href="#"
            onClick={(e) => {
              e.preventDefault(); // Previene el comportamiento predeterminado del enlace
              handlePageChange(pageNumber);
            }}
          >
            | {pageNumber} |
          </a>
        ))}
      </div>

      {/* /////////////////////// fin de la paginacion  ///////////////////////////////// */}
    </div>
  );
}
