import axios from "axios";
import { API_URL } from "../App.config";

export async function getCustomers(query, page, pageSize) {
  const urlBase = API_URL + "/clientesPageQuery";
  try {
    const { data } = await axios({
      method: "GET",
      url: `${urlBase}?consulta=${query}&page=${page}&size=${pageSize}`,
    });
    return data;
  } catch (error) {
    console.error("Error buscando clientes:", error);
    throw error;
  }
}

export async function getCustomersForCombo() {
  const urlBase = API_URL + "/clientes";
  try {
    const { data } = await axios({
      method: "GET",
      url: `${urlBase}`,
    });
    return data;
  } catch (error) {
    console.error("Error buscando clientes:", error);
    throw error;
  }
}

export async function getCustomerById(id) {
  try {
    const { data } = await axios({
      method: "GET",
      url: `${API_URL}/cliente/${id}`,
    });
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error en buscar un cliente:", error);
    throw error;
  }
}

export async function newCustomer(customer) {
  try {
    if (customer.id > 0) {
      const { data } = await axios({
        method: "PUT",
        url: `${API_URL}/cliente/${customer.id}`,
        data: customer,
      });
    } else {
      const { data } = await axios({
        method: "POST",
        url: `${API_URL}/cliente`,
        data: customer,
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

export async function deleteCustomer(id) {
  const urlBase = API_URL + "/clienteEliminar";
  const { data } = await axios({
    method: "PUT",
    url: `${urlBase}/${id}`,
  });
  return true;
}
