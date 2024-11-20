import React, { createContext, useState } from "react";

export const ServiceContext = createContext();

const ServiceProvider = ({ children }) => {
  const [services, setServices] = useState([]);

  return (
    <ServiceContext.Provider value={{ services, setServices }}>
      {children}
    </ServiceContext.Provider>
  );
};

export default ServiceProvider;
