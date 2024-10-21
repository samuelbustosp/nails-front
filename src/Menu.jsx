import React from "react";
import { Link } from "react-router-dom";

export default function Menu() {
  return (
    <div className="conteiner">
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand estiloTitulo" href="/">
            Nails System
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">
                  Home
                </a>
              </li>
              {}
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Configuración
                </a>
                <ul className="dropdown-menu">
                  <li className="nav-item">
                    {" "}
                    <Link className="nav-link" to="/clienteList">
                      {" "}
                      Cliente{" "}
                    </Link>
                  </li>
                  <li className="nav-item">
                    {" "}
                    <Link className="nav-link" to="/lineaList">
                      {" "}
                      Linea{" "}
                    </Link>
                  </li>
                  <li className="nav-item">
                    {" "}
                    <Link className="nav-link" to="/articuloList">
                      {" "}
                      Articulo{" "}
                    </Link>
                  </li>
                  <li className="nav-item">
                    {" "}
                    <Link className="nav-link" to="/tipoServicioList">
                      {" "}
                      Tipo Servicio{" "}
                    </Link>
                  </li>
                  <li className="nav-item">
                    {" "}
                    <Link className="nav-link" to="/servicioList">
                      {" "}
                      Servicio{" "}
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
