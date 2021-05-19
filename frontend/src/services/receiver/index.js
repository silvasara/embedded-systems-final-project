/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from 'react';

import { DeviceContext } from '../../contexts/DeviceContext'

export default function Receiver({ payload, publish, setPayload }) {
  const { updateTemperature, updateHumidity, toggleInDevice, removeDevice } = useContext(DeviceContext)
  const STORAGE_TOPIC = 'fse/central/160144752/storage'

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

      if (payload.delete) {
        console.log('Action delete received')
        removeDevice(payload)
      }

      if (payload.storage) {
        setPayload(null)
        console.log('Getting storage')
        const response = localStorage.getItem('devices')
        publish(STORAGE_TOPIC, response)
      }

    }
  }, [payload])

  return (
    <>
    </>
  );
}
