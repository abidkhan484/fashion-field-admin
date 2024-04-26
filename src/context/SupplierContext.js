import React from "react";

export const SupplierContext = React.createContext();

export const SupplierProvider = ({children}) => {

    const [suppliers, setSuppliers] = React.useState({});

    return <SupplierContext.Provider value={{suppliers, setSuppliers}}>{ children }</SupplierContext.Provider>
}