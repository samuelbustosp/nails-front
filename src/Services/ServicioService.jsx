import axios from "axios";
import { API_URL } from "../App.config";

const urlBase = API_URL + "/serviciosPageQuery";

// Obtener una lista paginada de servicios
export async function obtenerServicios(consulta, page, pageSize) {
  try {
    const { data } = await axios({
      method: "GET",
      url: `${urlBase}?consulta=${consulta}&page=${page}&size=${pageSize}`,
    });
    return data;
  } catch (error) {
    console.error("Error buscando servicios:", error);
    throw error;
  }
}

// Obtener un servicio por su ID
export async function obtenerServicio(id) {
  try {
    const { data } = await axios({
      method: "GET",
      url: `${API_URL}/servicio/${id}`,
    });
    return data;
  } catch (error) {
    console.error("Error al buscar un servicio", error);
    throw error;
  }
}

// Crear o actualizar un servicio
export async function newServicio(servicio) {
  try {
    if (servicio.id > 0) {
      const { data } = await axios({
        method: "PUT",
        url: `${API_URL}/servicios/${servicio.id}`,
        data: servicio,
      });
      return data;
    } else {
      const { data } = await axios({
        method: "POST",
        url: `${API_URL}/servicios`,
        data: servicio,
      });
      return data;
    }
  } catch (error) {
    console.error("Error al guardar el servicio:", error);
    throw error;
  }
}

// Eliminar un servicio
export async function eliminarServicio(id) {
  try {
    const { data } = await axios({
      method: "PUT",
      url: `${API_URL}/servicioEliminar/${id}`,
    });
    return data;
  } catch (error) {
    console.error("Error al eliminar el servicio:", error);
    throw error;
  }
}
