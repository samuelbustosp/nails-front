import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  newSalesItem,
  getSalesItemById,
} from "../../Services/SalesItemService";

import { obtenerLineas2 } from "../../Services/LineService";

export default function SalesItem({ title }) {
  let navegacion = useNavigate();

  const { id } = useParams();

  const [item, setItem] = useState({
    denomination: "",
    line: 0,
  });

  const [lineList, setLineList] = useState([]);
  const [selectedLine, setSelectedLine] = useState({});
  const { denomination, line } = item;

  useEffect(() => {
    cargarModel();
    cargarLineas();
  }, []);

  const cargarModel = async () => {
    if (id > 0) {
      console.log(id);
      const resultado = await getSalesItemById(id);
      setItem(resultado);
      setSelectedLine(resultado.line);
    }
  };

  const cargarLineas = async () => {
    console.log(id);
    const resultado = await obtenerLineas2();
    setLineList(resultado);
  };

  const onInputChange = ({ target: { name, value } }) => {
    //spread operator ... (expandir los atributos)
    setItem({ ...item, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const data = {
      ...item,
      line: selectedLine, // Asumiendo que la línea seleccionada es el id de la línea
    };
    window.alert("id linea" + selectedLine);
    newSalesItem(data);
    // Redirigimos a la pagina de inicio
    navegacion("/articuloList");
  };

  return (
    <div className="container">
      <div>
        <h1> Gestión de articulo / {title} </h1>
        <hr></hr>
      </div>

      <form onSubmit={(e) => onSubmit(e)}>
        <div className="mb-3">
          <label htmlFor="denominacion" className="form-label">
            {" "}
            Denominacion
          </label>
          <input
            type="text"
            className="form-control"
            id="denominacion"
            name="denominacion"
            required={true}
            value={denomination}
            onChange={(e) => onInputChange(e)}
          />

          <label htmlFor="listaLineas">Selecciona una linea:</label>
          <select
            id="listaLineas"
            value={selectedLine}
            required={true}
            onChange={(e) => setSelectedLine(e.target.value)}
          >
            <option value="">Seleccione...</option>
            {lineList.map((line) => (
              <option key={line.id} value={line.id}>
                {line.denomination}
              </option>
            ))}
          </select>
        </div>

        <div className="row d-md-flex justify-content-md-end">
          <div className="col-4">
            <button type="submit" className="btn btn-success btn-sm me-3">
              Guardar
            </button>
          </div>
          <div className="col-4">
            <a href="/articuloList" className="btn btn-info btn-sm me-3">
              Regresar
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}
