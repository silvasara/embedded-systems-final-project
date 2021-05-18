import React, { useContext } from 'react';

import { Container, Title, SmallTitle, ColoredText, Row } from './styles';
import { DeviceContext } from '../../contexts/DeviceContext'

export default function Device({device}) {
  const { toggleOutDevice, toggleInDevice, toggleAlarm } = useContext(DeviceContext)

  return (
    <Container>
      <Title>{device.room ? device.room : "Cômodo sem nome"}</Title>
      <SmallTitle>
        Endereço MAC: <ColoredText color="yellow">{device.mac}</ColoredText>
      </SmallTitle>

      <span>Temperatura: {device.temperature}</span>
      <span>Humidade: {device.humidity}</span>


      <Row on={device.outDevicePressed.toString()}>
      <span>
        Dispositivo saida: <ColoredText>{device.outDevice}</ColoredText>
      </span>
      <button onClick={() => toggleOutDevice(device)}>{device.outDevicePressed? "ON" : "OFF"}</button>
      </Row>

      <Row on={device.inDevicePressed.toString()}>
      <span>
        Dispositivo entrada: <ColoredText>{device.inDevice}</ColoredText>
      </span>
      {/* onClick={() => toggleInDevice(device)} */}
      <button>{device.inDevicePressed? "PRESENTE" : "AUSENTE"}</button>
      </Row>

      <Row on={device.alarmPressed.toString()}>
      <span>Alarme</span>
      <button onClick={() => toggleAlarm(device)}>{device.alarmPressed? "ON" : "OFF"}</button>
      </Row>


    </Container>
  );
}
