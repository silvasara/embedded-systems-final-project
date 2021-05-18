import React, { useContext } from 'react';

import { Container, Title, SmallTitle, ColoredText, Row, Trash, Button } from './styles';
import { FaTrashAlt } from 'react-icons/fa'

import { DeviceContext } from '../../contexts/DeviceContext'

export default function Device({device}) {
  const { toggleOutDevice, toggleAlarm, removeDevice } = useContext(DeviceContext)

  const handleTrashButton = async(e) => {
    e.preventDefault()

    removeDevice(device)
    console.log('enviando msg pro central...')
  }

  return (
    <Container>
      <Row>
        <Title>{device.room ? device.room : "Cômodo sem nome"}</Title>
        <Trash onClick={e => handleTrashButton(e)}><FaTrashAlt/></Trash>
      </Row>
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

      <Row>
        <Row>
          <span>Dispositivo saida:</span>
          <ColoredText>{device.outDevice}</ColoredText>
        </Row>
      <Button on={device.outDevicePressed.toString()} onClick={() => toggleOutDevice(device)}>{device.outDevicePressed? "ON" : "OFF"}</Button>
      </Row>

      <Row>
        <Row>
          <span>Dispositivo entrada:</span>
          <ColoredText>{device.inDevice}</ColoredText>
        </Row>
      {/* onClick={() => toggleInDevice(device)} */}
      <Button on={device.inDevicePressed.toString()}>{device.inDevicePressed? "PRESENTE" : "AUSENTE"}</Button>
      </Row>

      <Row>
      <span>Alarme</span>
      <Button on={device.alarmPressed.toString()} onClick={() => toggleAlarm(device)}>{device.alarmPressed? "ON" : "OFF"}</Button>
      </Row>


    </Container>
  );
}
