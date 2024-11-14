import React, { useContext, useEffect, useState } from "react";
import { IMAGEN_EDIT, IMAGEN_DELETE, ITEMS_PER_PAGE } from "../App.config";
import { Link } from "react-router-dom";

import {
  getSalesItem,
  deleteSalesItem,
} from "../Services/SalesItemService";
import { ArticuloVentaContext } from "./ArticuloVentaContext";

export default function SalesItemList() {
  const { items, setItems } = useContext(ArticuloVentaContext);

  const [query, setQuery] = useState("");

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(ITEMS_PER_PAGE);
  const [totalPages, setTotalPages] = useState(0);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  }); //se utiliza para el orden

  useEffect(() => {
    getItems();
  }, [page, pageSize, query]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const getItems = async () => {
    console.log("carga " + page);
    getSalesItem(query, page, pageSize)
      .then((response) => {
        setItems(response.content);
        setTotalPages(response.totalPages);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
  };

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const handleDeleteItem = async (id) => {
    try {
      const eliminacionExitosa = await deleteSalesItem(id);
      if (eliminacionExitosa) {
        getItems();
      } else {
        console.error("Error al eliminar el articulo");
      }
    } catch (error) {
      console.error("Error al eliminar el articulo:", error);
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
    const sorted = [...items];
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
        <h1> Gestión de Articulos Venta </h1>
        <hr></hr>
      </div>

      <div className="row d-md-flex justify-content-md-end">
        <div className="col-5">
          <input
            id="consulta"
            name="consulta"
            className="form-control me-2"
            type="search"
            aria-label="Search"
            value={query}
            onChange={handleQueryChange}
          ></input>
        </div>
        <div className="col-1">
          <button
            onClick={() => getItems()}
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
            <th scope="col" onClick={() => handleSort("denomination")}>
              Denominación
              {sortConfig.key === "denomination" && (
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
            sortedData().map((item, index) => (
              <tr key={index}>
                <th scope="row">{item.id}</th>
                <td>{item.denomination}</td>

                <td className="text-center">
                  <div>
                    <Link
                      to={`/articulo/${item.id}`}
                      className="btn btn-link btn-sm me-3"
                    >
                      <img
                        src={IMAGEN_EDIT}
                        style={{ width: "20px", height: "20px" }}
                      />
                      Editar
                    </Link>

                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="btn btn-link btn-sm me-3"
                    >
                      {" "}
                      <img
                        src={IMAGEN_DELETE}
                        style={{ width: "20px", height: "20px" }}
                      />
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
          <Link to={`/articulo`} className="btn btn-success btn-sm me-3">
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
