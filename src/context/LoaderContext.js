import React from 'react'

export const LoaderContext = React.createContext();

export const LoaderProvider = (props) => {

    const [loading, setLoading] = React.useState(false);


    return <LoaderContext.Provider value={{ loading, setLoading }}>{props.children}</LoaderContext.Provider>
}
