import axios from "axios";
import { API_URL } from "../configuration/App.config";

const urlBase = API_URL + "/servicePageQuery";

// Obtener una lista paginada de servicios
export async function getServices(query, page, pageSize) {
  try {
    const { data } = await axios({
      method: "GET",
      url: `${urlBase}?query=${query}&page=${page}&size=${pageSize}`,
    });
    return data;
  } catch (error) {
    console.error("Error buscando servicios:", error);
    throw error;
  }
}

// Obtener un servicio por su ID
export async function getServiceById(id) {
  try {
    const { data } = await axios({
      method: "GET",
      url: `${API_URL}/service/${id}`,
    });
    return data;
  } catch (error) {
    console.error("Error al buscar un servicio", error);
    throw error;
  }
}

// Crear o actualizar un servicio
export async function newService(service) {
  try {
    if (service.id > 0) {
      const { data } = await axios({
        method: "PUT",
        url: `${API_URL}/service/${service.id}`,
        data: service,
      });
      return data;
    } else {
      const { data } = await axios({
        method: "POST",
        url: `${API_URL}/service`,
        data: service,
      });
      return data;
    }
  } catch (error) {
    console.error("Error al guardar el servicio:", error);
    throw error;
  }
}

// Eliminar un servicio
export async function deleteService(id) {
  try {
    const { data } = await axios({
      method: "DELETE",
      url: `${API_URL}/service/${id}`,
    });
    return data;
  } catch (error) {
    console.error("Error al eliminar el servicio:", error);
    throw error;
  }
}
