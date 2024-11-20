// LineaContext.js
import React, { createContext, useState } from "react";

export const ServiceTypeContext = createContext();

const ServiceTypeProvider = ({ children }) => {
  const [servicesTypes, setServicesTypes] = useState([]);

  return (
    <ServiceTypeContext.Provider value={{ servicesTypes, setServicesTypes }}>
      {children}
    </ServiceTypeContext.Provider>
  );
};

export default ServiceTypeProvider;
