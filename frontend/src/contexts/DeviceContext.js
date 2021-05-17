import React, { createContext, useReducer, useContext } from 'react';

import { DeviceReducer }  from './DeviceReducer'

export const DeviceContext = createContext()

const storage = localStorage.getItem('devices') ? JSON.parse(localStorage.getItem('device')) : []
const initialState = { devices: storage }

export default function DeviceContextProvider({children}) {
  const [state, dispatch] = useReducer(DeviceReducer, initialState)

  const addDevice = payload => {
    dispatch({type: 'ADD_ITEM', payload})
  }

  const toggleInDevice = payload => {
    dispatch({type: 'TOGGLE_IN_DEVICE', payload})
  }

  const toggleOutDevice = payload => {
    dispatch({type: 'TOGGLE_OUT_DEVICE', payload})
  }

  const contextValues = {
    addDevice,
    toggleInDevice,
    toggleOutDevice,
    ...state
  }

  return (
    <DeviceContext.Provider value={contextValues} >
        {children}
    </DeviceContext.Provider>
  )

}

// export function useDevice(){
//   const context = useContext(DeviceContext)

//   const { addDevice, state } = context;

//   return { addDevice, ...state }
// }
