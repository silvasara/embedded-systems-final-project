import React, { useContext } from 'react';

import { Container, Title, SmallTitle, ColoredText, Row } from './styles';
import { DeviceContext } from '../../contexts/DeviceContext'

export default function Device({device}) {
  const { toggleOutDevice, toggleAlarm } = useContext(DeviceContext)

  return (
    <Container>
      <Title>{device.room ? device.room : "Cômodo sem nome"}</Title>
      <Row>
        <SmallTitle>Endereço MAC:</SmallTitle>
        <SmallTitle color="yellow">{device.mac}</SmallTitle>
      </Row>

      <Row>
        <span>Temperatura:</span>
        <ColoredText>{device.temperature}</ColoredText>
      </Row>

      <Row>
        <span>Humidade:</span>
        <ColoredText>{device.humidity}</ColoredText>
      </Row>

      <Row on={device.outDevicePressed.toString()}>
        <Row>
          <span>Dispositivo saida:</span>
          <ColoredText>{device.outDevice}</ColoredText>
        </Row>
      <button onClick={() => toggleOutDevice(device)}>{device.outDevicePressed? "ON" : "OFF"}</button>
      </Row>

      <Row on={device.inDevicePressed.toString()}>
        <Row>
          <span>Dispositivo entrada:</span>
          <ColoredText>{device.inDevice}</ColoredText>
        </Row>
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
