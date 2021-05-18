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
    const content = { inDevicePressed: !payload.inDevicePressed }

    dispatch({type: 'UPDATE', payload: {
      ...payload,
      content
    }})
  }

  const toggleOutDevice = payload => {
    const content = { outDevicePressed: !payload.outDevicePressed }

    dispatch({type: 'UPDATE', payload: {
      ...payload,
      content
    }})
  }

  const toggleAlarm = payload => {
    const content = { alarmPressed: !payload.alarmPressed }

    dispatch({type: 'UPDATE', payload: {
      ...payload,
      content
    }})
  }

  const updateTemperature = payload => {
    const content = { temperature: payload.temperature}

    dispatch({type: 'UPDATE', payload: {
      ...payload,
      content
    }})
  }

  const updateHumidity = payload => {
    const content = { humidity: payload.humidity}

    dispatch({type: 'UPDATE', payload: {
      ...payload,
      content
    }})
  }

  const contextValues = {
    addDevice,
    toggleInDevice,
    toggleOutDevice,
    toggleAlarm,
    updateTemperature,
    updateHumidity,
    ...state
  }

  return (
    <DeviceContext.Provider value={contextValues} >
        {children}
    </DeviceContext.Provider>
  )

}
