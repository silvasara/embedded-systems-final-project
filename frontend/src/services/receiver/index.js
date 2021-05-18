/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from 'react';

import { DeviceContext } from '../../contexts/DeviceContext'

export default function Receiver({ payload, setPayload }) {
  const { updateTemperature, updateHumidity, toggleInDevice } = useContext(DeviceContext)

  useEffect(() => {
    if (payload) {
      console.log('Nova mensagem recebida: ', payload)

      if (payload.temperature){
        console.log('New temperature received')
        updateTemperature(payload)
      }

      if (payload.humidity){
        console.log('New humidity received')
        updateHumidity(payload)
      }

      if (payload.sensor !== undefined){
        console.log('In device state change!')
        toggleInDevice(payload)
      }

    }
  }, [payload])

  return (
    <>
    </>
  );
}
