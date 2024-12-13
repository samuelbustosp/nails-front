import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IMAGEN_EDIT, IMAGEN_DELETE, ITEMS_PER_PAGE } from "../../configuration/app.config";
import { LineContext } from "../../contexts/LineContext";
import { getLine, deleteLine } from "../../Services/LineService";

export default function LineList() {
  const { lines, setLines } = useContext(LineContext);

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
  }, []);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const getData = async () => {
    console.log("carga " + page);
    getLine()
      .then((response) => {
        setLines(response);
        setTotalPages(response.totalPages);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });
  };

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const handleDeleteLine = async (id) => {
    try {
      const eliminacionExitosa = await deleteLine(id);
      if (eliminacionExitosa) {
        getData();
      } else {
        console.error("Error al eliminar la línea");
      }
    } catch (error) {
      console.error("Error al eliminar la línea:", error);
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
    const sorted = Array.isArray(lines) ? [...lines] : [];
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
        <h1> Gestión de Lineas </h1>
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
            onClick={() => getData()}
            className="btn btn-outline-success"
            type="submit"
          >
            Buscar
          </button>
        </div>
      </div>
      <hr></hr>
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
            sortedData().map((line, index) => (
              <tr key={index}>
                <th scope="row">{line.id}</th>
                <td>{line.denomination}</td>

                <td className="text-center">
                  <div>
                    <Link
                      to={`/line/${line.id}`}
                      className="btn btn-link btn-sm me-3"
                    >
                      <img
                        src={IMAGEN_EDIT}
                        style={{ width: "20px", height: "20px" }}
                      />
                      Editar
                    </Link>

                    <button
                      onClick={() => handleDeleteLine(line.id)}
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
          <Link to={`/line`} className="btn btn-success btn-sm me-3">
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
