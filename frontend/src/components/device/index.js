import React, { useContext } from 'react';

import { Container, Title, Row } from './styles';
import { DeviceContext } from '../../contexts/DeviceContext'

export default function Device({device}) {
  const { addDevice, devices, toggleInDevice, toggleOutDevice } = useContext(DeviceContext)

  const handleToggleIn = async(e) => {
    e.preventDefault()

    // device.inDevicePressed = ! device.inDevicePressed;
    console.log('clicado no in device... device antes: ', device)
    toggleInDevice(device)
  }

  return (
    <Container>
      <Title>{device.room ? device.room : "Cômodo sem nome"}</Title>

      <Row on={device.inDevicePressed.toString()}>
      <span>Dispositivo entrada: {device.inDevice}</span>
      <button onClick={() => toggleInDevice(device)}>{device.inDevicePressed? "ON" : "OFF"}</button>
      </Row>

      <Row on={device.outDevicePressed.toString()}>
      <span>Dispositivo saida: {device.outDevice}</span>
      <button onClick={() => toggleOutDevice(device)}>{device.outDevicePressed? "ON" : "OFF"}</button>
      </Row>

    </Container>
  );
}
