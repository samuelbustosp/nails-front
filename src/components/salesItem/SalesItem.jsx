import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  newSalesItem,
  getSalesItemById,
} from "../../Services/SalesItemService";

import { getLine } from "../../Services/LineService";

export default function SalesItem({ title }) {
  let navegation = useNavigate();

  const { id } = useParams();

  const [item, setItem] = useState({
    denomination: "",
    line: {},
  });

  const [lineList, setLineList] = useState([]);
  const [selectedLine, setSelectedLine] = useState({});
  const { denomination, line } = item;

  useEffect(() => {
    console.log("entra")
    cargarLineas();
  }, []);

  const cargarLineas = async () => {
    const response = await getLine();
    console.log(response);
    setLineList(response);
  };

  const onInputChange = ({ target: { name, value } }) => {
    //spread operator ... (expandir los atributos)
    setItem({ ...item, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
  
    // Encuentra el objeto completo de la línea seleccionada
    const selectedLineObject = lineList.find((line) => line.id === Number(selectedLine));
  
    if (!selectedLineObject) {
      console.error("No se encontró la línea seleccionada.");
      return;
    }
  
    // Construye el objeto `data` con el objeto completo de línea
    const data = {
      ...item,
      line: selectedLineObject, // Pasa el objeto completo aquí
    };
  
    console.log("data", data);
    await newSalesItem(data); // Asegúrate de esperar a que la operación termine
  
    // Redirige a la lista de artículos
    navegation("/item-list");
  };
  

  return (
    <div className="container">
      <div>
        <h1> Gestión de articulo / {title} </h1>
        <hr></hr>
      </div>

      <form onSubmit={(e) => onSubmit(e)}>
        <div className="mb-3">
          <label htmlFor="denomination" className="form-label">
            {" "}
            Denominacion
          </label>
          <input
            type="text"
            className="form-control"
            id="denomination"
            name="denomination"
            required={true}
            value={denomination}
            onChange={(e) => onInputChange(e)}
          />

          <label htmlFor="line-list">Selecciona una linea:</label>
          <select
            id="line-list"
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
            <a href="/sales-item-list" className="btn btn-info btn-sm me-3">
              Regresar
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}
