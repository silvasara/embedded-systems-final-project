import React, { createContext, useReducer } from 'react';

import { DeviceReducer }  from './DeviceReducer'

export const DeviceContext = createContext()

const storage = localStorage.getItem('devices') ? JSON.parse(localStorage.getItem('devices')) : []
const initialState = { devices: storage }

export default function DeviceContextProvider({children}) {
  const [state, dispatch] = useReducer(DeviceReducer, initialState)

  const addDevice = payload => {
    // payload contains device
    dispatch({type: 'ADD_ITEM', payload})
  }

  const removeDevice = payload => {
    dispatch({type: 'REMOVE_ITEM', payload})
  }

  const toggleInDevice = payload => {
    // payload contains mac and sensor -> bool
    const content = { inDevicePressed: payload.sensor }

    dispatch({type: 'UPDATE', payload: {
      ...payload,
      content
    }})
  }

  const toggleOutDevice = payload => {
    //payload contains device
    const content = { outDevicePressed: !payload.outDevicePressed }

    dispatch({type: 'UPDATE', payload: {
      ...payload,
      content
    }})
  }

  const toggleAlarm = payload => {
    //payload contains device
    const content = { alarmPressed: !payload.alarmPressed }

    dispatch({type: 'UPDATE', payload: {
      ...payload,
      content
    }})
  }

  const updateTemperature = payload => {
    //payload contains mac and temperature->number
    const content = { temperature: payload.temperature}

    dispatch({type: 'UPDATE', payload: {
      ...payload,
      content
    }})
  }

  const updateHumidity = payload => {
    //payload contains mac and humidity->number
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
    removeDevice,
    ...state
  }

  return (
    <DeviceContext.Provider value={contextValues} >
        {children}
    </DeviceContext.Provider>
  )

}
