import React, { useContext } from 'react';

import { Container, Title, SmallTitle, ColoredText, Row, Trash, Button } from './styles';
import { FaTrashAlt } from 'react-icons/fa'

import { DeviceContext } from '../../contexts/DeviceContext'

export default function Device({device, publish}) {
  const { toggleOutDevice, toggleAlarm, removeDevice } = useContext(DeviceContext)

  const DELETE_TOPIC = 'fse/central/160144752/delete'
  const UPDATE_TOPIC = 'fse/central/160144752/update'

  const handleTrashButton = async(e) => {
    e.preventDefault()

    console.log(device.mac, 'deleted')
    publish(DELETE_TOPIC, JSON.stringify(device))
    removeDevice(device)
  }

  const handleToggleOutDevice = async(e) => {
    e.preventDefault()

    console.log(device.mac, 'led toggled')
    const payload = {
      action: 'led',
      command: `${device.outDevicePressed? 'Desligado': 'Ligado'} ${device.outDevice}`,
      mac: device.mac
    }
    publish(UPDATE_TOPIC, JSON.stringify(payload))
    toggleOutDevice(device)
  }

  const handleToggleAlarm = async(e) => {
    e.preventDefault()

    console.log(device.mac, 'alarm toggled')
    const payload = {
      action: 'alarm',
      command: `${device.alarmPressed? 'Desligado': 'Ligado'} alarme`,
      mac: device.mac
    }
    publish(UPDATE_TOPIC, JSON.stringify(payload))
    toggleAlarm(device)
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
        <span>Umidade:</span>
        <ColoredText>{device.humidity}</ColoredText>
      </Row>

      <Row>
        <Row>
          <span>Dispositivo saida:</span>
          <ColoredText>{device.outDevice}</ColoredText>
        </Row>
      <Button on={device.outDevicePressed.toString()} onClick={e => handleToggleOutDevice(e)}>{device.outDevicePressed? "ON" : "OFF"}</Button>
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
      <Button on={device.alarmPressed.toString()} onClick={e => handleToggleAlarm(e)}>{device.alarmPressed? "ON" : "OFF"}</Button>
      </Row>


    </Container>
  );
}
