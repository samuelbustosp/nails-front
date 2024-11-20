// LineaContext.js
import React, { createContext, useState } from "react";

export const LineContext = createContext();

const LineProvider = ({ children }) => {
  const [lines, setLines] = useState([]);

  return (
    <LineContext.Provider value={{ lines, setLines }}>
      {children}
    </LineContext.Provider>
  );
};

export default LineProvider;
