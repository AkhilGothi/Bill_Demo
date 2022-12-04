import React from "react";

const  DataContext = React.createContext({})
const DataProvider = (props) => {
    return(
        <DataContext.Provider>
            {props.children}
        </DataContext.Provider>
    )
}
export default DataProvider;