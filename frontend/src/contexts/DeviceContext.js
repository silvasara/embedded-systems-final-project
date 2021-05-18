import React, { createContext, useReducer } from 'react';

import { DeviceReducer }  from './DeviceReducer'

export const DeviceContext = createContext()

const storage = localStorage.getItem('devices') ? JSON.parse(localStorage.getItem('devices')) : []
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

  const toggleAlarm = payload => {
    dispatch({type: 'TOGGLE_ALARM', payload})
  }

  const contextValues = {
    addDevice,
    toggleInDevice,
    toggleOutDevice,
    toggleAlarm,
    ...state
  }

  return (
    <DeviceContext.Provider value={contextValues} >
        {children}
    </DeviceContext.Provider>
  )

}
