import React, { createContext, useState } from "react";

export const ClienteContext = createContext();

const ClienteProvider = ({ children }) => {
  const [clientes, setClientes] = useState([]);

  return (
    <ClienteContext.Provider value={{ clientes, setClientes }}>
      {children}
    </ClienteContext.Provider>
  );
};

export default ClienteProvider;
