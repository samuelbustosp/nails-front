// LineaContext.js
import React, { createContext, useState } from "react";

export const LineaContext = createContext();

const LineaProvider = ({ children }) => {
  const [lineas, setLineas] = useState([]);

  return (
    <LineaContext.Provider value={{ lineas, setLineas }}>
      {children}
    </LineaContext.Provider>
  );
};

export default LineaProvider;
