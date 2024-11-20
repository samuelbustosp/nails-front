import React, { createContext, useState } from "react";

export const CustomerContext = createContext();

const CustomerProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);

  return (
    <CustomerContext.Provider value={{ customers, setCustomers }}>
      {children}
    </CustomerContext.Provider>
  );
};

export default CustomerProvider;
