import React, { createContext, useState } from "react";

export const SalesItemContext = createContext();

const SalesItemProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  return (
    <SalesItemContext.Provider value={{ items, setItems }}>
      {children}
    </SalesItemContext.Provider>
  );
};

export default SalesItemProvider;
