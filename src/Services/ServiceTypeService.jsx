import axios from "axios";
import { API_URL } from "../configuration/App.config";

export async function getServicesType(consulta, page, pageSize) {
  try {
    const urlBase = API_URL + "/serviceTypePageQuery";
    const { data } = await axios({
      method: "GET",
      url: `${urlBase}?consulta=${consulta}&page=${page}&size=${pageSize}`,
    });
    return data;
  } catch (error) {
    console.error("Error buscando tipos de servicios:", error);
    throw error;
  }
}

export async function getServiceType() {
  try {
    const urlBase = API_URL + "/serviceType";
    const { data } = await axios({
      method: "GET",
      url: `${urlBase}`,
    });
    return data;
  } catch (error) {
    console.error("Error buscando tipos de servicios:", error);
    throw error;
  }
}

export async function getServicesTypesForCombo() {
  try {
    const urlBase = API_URL + "/serviceType";
    const { data } = await axios({
      method: "GET",
      url: `${urlBase}`,
    });
    return data;
  } catch (error) {
    console.error("Error buscando tipos de servicios:", error);
    throw error;
  }
}

export async function getServiceTypeById(id) {
  try {
    const { data } = await axios({
      method: "GET",
      url: `${API_URL}/serviceType/${id}`,
    });
    return data;
  } catch (error) {
    console.error("Error en buscar un tipo servicio", error);
    throw error;
  }
}

export async function newServiceType(serviceType) {
  try {
    if (serviceType.id > 0) {
      const { data } = await axios({
        method: "PUT",
        url: `${API_URL}/serviceType/${serviceType.id}`,
        data: serviceType,
      });
    } else {
      const { data } = await axios({
        method: "POST",
        url: `${API_URL}/serviceType`,
        data: serviceType,
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

export async function deleteServiceType(id) {
  const urlBase = API_URL + "/serviceType";
  const { data } = await axios({
    method: "DELETE",
    url: `${urlBase}/${id}`,
  });
  return true;
}
