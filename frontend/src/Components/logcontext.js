import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';

export const LogContext = createContext();

export const LogProvider = ({ children }) => {
  const [logged,setLogged] = useState(false);

  useEffect(()=>{
    const check=async()=>{
        await axios.get("http://localhost:4100/logcheck",{
            withCredentials:true
        }).then(response=>{
            setLogged(response.data)
        })
    }
    check();
  },[logged])

  return (
    <LogContext.Provider value={{logged,setLogged }}>
      {children}
    </LogContext.Provider>
  );
};
