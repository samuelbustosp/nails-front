import axios from "axios";
import { API_URL } from "../App.config";

const urlBase = API_URL + "/articulosPageQuery";
export async function getSalesItem(consulta, page, pageSize) {
  try {
    const { data } = await axios({
      method: "GET",
      url: `${urlBase}?consulta=${consulta}&page=${page}&size=${pageSize}`,
    });
    return data;
  } catch (error) {
    console.error("Error buscando articulos:", error);
    throw error;
  }
}

export async function getSalesItemById(id) {
  try {
    const { data } = await axios({
      method: "GET",
      url: `${API_URL}/articulos/${id}`,
    });
    return data;
  } catch (error) {
    console.error("Error en buscar una articulo:", error);
    throw error;
  }
}

export async function newSalesItem(model) {
  try {
    if (model.id > 0) {
      const { data } = await axios({
        method: "PUT",
        url: `${API_URL}/articulos/${model.id}`,
        data: model,
      });
    } else {
      const { data } = await axios({
        method: "POST",
        url: `${API_URL}/articulos`,
        data: model,
      });
    }

    return data;
  } catch (e) {
    //  console.error(e);
    // if (e.response && e.response.status === 400) {
    //     //setMensaje('Error: Los datos proporcionados son inválidos');
    //     alert('Error: Los datos proporcionados son inválidos');
    // }
    // else {
    //     alert(e.response);
    //     alert(e.response.status);
    //     // setMensaje('Error al conectarse con el servidor');
    // }
    return null;
  }
}

export async function deleteSalesItem(id) {
  const urlBase = API_URL + "/articulosEliminar";
  const { data } = await axios({
    method: "PUT",
    url: `${urlBase}/${id}`,
  });
  return true;
}