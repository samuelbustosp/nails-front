import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IMAGEN_EDIT, IMAGEN_DELETE, ITEMS_PER_PAGE } from "../../configuration/app.config";
import { ServiceContext } from "../../contexts/ServiceContext";
import {
  deleteService,
  getServices
} from "../../Services/ServiceService";


export default function ServiceList() {
  const { services, setServices } = useContext(ServiceContext);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(ITEMS_PER_PAGE);
  const [totalPages, setTotalPages] = useState(0);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getData();
    console.log("Servicios actualizados:", services); // Agrega este log para verificar los datos
  }, [page, pageSize, query]);

  const getData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getServices(query, page, pageSize);
      setServices(response.content);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError("Error fetching items");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const handleDeleteService = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este servicio?")) {
      try {
        const response = await deleteService(id);
        if (response) {
          getData();
        } else {
          console.error("Error al eliminar servicio");
        }
      } catch (error) {
        console.error("Error al eliminar la línea:", error);
      }
    }
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = () => {
    const sorted = [...services];
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

  

  return (
    <div className="container">
      <div>
        <h1>Gestión de servicios</h1>
        <hr />
      </div>

      <div className="row d-md-flex justify-content-md-end">
        <div className="col-5">
          <input
            id="query"
            name="query"
            className="form-control"
            type="search"
            placeholder="Buscar servicio"
            value={query}
            onChange={handleQueryChange}
          />
        </div>
        <div className="col-1">
          <button
            onClick={() => getData()}
            className="btn btn-outline-success"
          >
            Buscar
          </button>
        </div>
      </div>

      <hr />

      {loading ? (
        <div className="text-center">Cargando...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <>
          <table className="table table-striped table-hover align-middle">
            <thead className="table-dark text-center">
              <tr>
                <th scope="col" onClick={() => handleSort("id")}>
                  #
                  {sortConfig.key === "id" && (
                    <span>
                      {sortConfig.direction === "ascending" ? " 🔽" : " 🔼"}
                    </span>
                  )}
                </th>

                <th scope="col" onClick={() => handleSort("cliente")}>
                  Cliente
                  {sortConfig.key === "cliente" && (
                    <span>
                      {sortConfig.direction === "ascending" ? " 🔽" : " 🔼"}
                    </span>
                  )}
                </th>
                <th scope="col" onClick={() => handleSort("fecha")}>
                  Fecha
                  {sortConfig.key === "fecha" && (
                    <span>
                      {sortConfig.direction === "ascending" ? " 🔽" : " 🔼"}
                    </span>
                  )}
                </th>
                <th scope="col">Total</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sortedData().map((service, indice) => (
                <tr key={indice}>
                  <th scope="row">{service.id}</th>

                  <td>{service.customerBusinessName}</td>
                  <td>{new Date(service.registrationTimestamp).toLocaleDateString('es-AR')}</td>
                  <td>{'$'+service.total.toLocaleString('es-AR',{minimumFractionDigits: 2})}</td>
                  <td className="text-center">
                    <div>
                      <Link
                        to={`/service/${service.id}`}
                        className="btn btn-link btn-sm me-3"
                      >
                        <img
                          src={IMAGEN_EDIT}
                          style={{ width: "20px", height: "20px" }}
                        />
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDeleteService(service.id)}
                        className="btn btn-link btn-sm me-3"
                      >
                        <img
                          src={IMAGEN_DELETE}
                          style={{ width: "20px", height: "20px" }}
                        />
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Paginación */}
          <div className="d-md-flex justify-content-md-end">
            <button
              className="btn btn-outline-primary me-2"
              disabled={page === 0}
              onClick={() => handlePageChange(page - 1)}
            >
              Anterior
            </button>
            <button
              className="btn btn-outline-primary"
              disabled={page >= totalPages - 1}
              onClick={() => handlePageChange(page + 1)}
            >
              Siguiente
            </button>
          </div>

          <div className="row d-md-flex justify-content-md-end mt-3">
            <div className="col-4">
              <Link to={`/service`} className="btn btn-success btn-sm">
                Nuevo
              </Link>
            </div>
            <div className="col-4">
              <Link to={`/`} className="btn btn-info btn-sm">
                Regresar
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
