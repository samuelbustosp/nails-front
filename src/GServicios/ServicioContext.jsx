// LineaContext.js
import React, { createContext, useState } from "react";

export const ServicioContext = createContext();

const ServicioProvider = ({ children }) => {
  const [servicios, setServicios] = useState([]);

  return (
    <ServicioContext.Provider value={{ servicios, setServicios }}>
      {children}
    </ServicioContext.Provider>
  );
};

export default ServicioProvider;
