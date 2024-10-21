import axios from "axios";
import { API_URL } from "../App.config";

export async function obtenerLineas(consulta, page, pageSize) {
  const urlBase = API_URL + "/lineasPageQuery";
  try {
    const { data } = await axios({
      method: "GET",
      url: `${urlBase}?consulta=${consulta}&page=${page}&size=${pageSize}`,
    });
    return data;
  } catch (error) {
    console.error("Error buscando lineas:", error);
    throw error;
  }
}

export async function obtenerLineas2() {
  try {
    const { data } = await axios({
      method: "GET",
      url: `${API_URL}/lineas`,
    });
    return data;
  } catch (error) {
    console.error("Error buscando lineas:", error);
    throw error;
  }
}

export async function obtenerLinea(id) {
  try {
    // `${urlBase}/${id}`
    const { data } = await axios({
      method: "GET",
      url: `${API_URL}/linea/${id}`,
    });
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error en buscar una linea:", error);
    throw error;
  }
}

export async function newLinea(linea) {
  try {
    if (linea.id > 0) {
      const { data } = await axios({
        method: "PUT",
        url: `${API_URL}/linea/${linea.id}`,
        data: linea,
      });
    } else {
      const { data } = await axios({
        method: "POST",
        url: `${API_URL}/linea`,
        data: linea,
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

export async function eliminarLineas(id) {
  const urlBase = API_URL + "/lineaEliminar";
  const { data } = await axios({
    method: "PUT",
    url: `${urlBase}/${id}`,
  });
  return true;
}
