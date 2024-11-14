import React, { createContext, useState } from "react";

export const ArticuloVentaContext = createContext();

const ArticuloVentaProvider = ({ children }) => {
  const [articulos, setArticulos] = useState([]);

  return (
    <ArticuloVentaContext.Provider value={{ articulos, setArticulos }}>
      {children}
    </ArticuloVentaContext.Provider>
  );
};

export default ArticuloVentaProvider;
