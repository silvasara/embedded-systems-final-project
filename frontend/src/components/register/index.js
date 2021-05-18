import React, { useState, useContext } from 'react';

import { DeviceContext } from '../../contexts/DeviceContext'

import { Container, Header, ErrorMessage } from './styles';

export default function Register({ mac, setMac }) {
  const [espAvailable, setEspAvailable] = useState(false)
  const [err, setErr] = useState('')

  const [room, setRoom] = useState('')
  const [inDevice, setInDevice] = useState('')
  const [outDevice, setOutDevice] = useState('')

  const { addDevice } = useContext(DeviceContext)

  // const [mac, setId] = useState(0)


  const registerEsp = async(e) => {
    e.preventDefault()

    setEspAvailable(true)
    if (!mac){
      setErr('Não há um dispositivo disponível!')
    } else if (!room) {
      setErr('O nome do cômodo deve ser preenchido!')
    } else {
      setErr('')
      setMac('')
      setRoom('')
      setInDevice('')
      setOutDevice('')

      console.log('Room = ', room)
      console.log('In device  = ', inDevice)
      console.log('Out device = ', outDevice)
      console.log('mac = ', mac)

      const payload = {
        room,
        inDevice,
        inDevicePressed: false,
        outDevice,
        outDevicePressed: false,
        alarmPressed: false,
        temperature: 0,
        humidity: 0,
        mac
      }
      addDevice(payload)
    }

  }

  return (
    <Container>
      <Title mac={mac}></Title>

      <span>Cômodo da casa</span>
      <input type="text" value={room} onChange={e => setRoom(e.target.value)} placeholder="Cômodo da casa" ></input>

      <span>Dispositivo de Saída</span>
      <input type="text" value={outDevice} onChange={e => setOutDevice(e.target.value)} placeholder="Dispositivo de Saída"></input>

      <span>Dispositivo de entrada</span>
      <input type="text" value={inDevice} onChange={e => setInDevice(e.target.value)} placeholder="Dispositivo de Entrada"></input>
      
      <button onClick={e => registerEsp(e)}>REGISTRAR</button>
      <Error error={err}/>
      
      
    </Container>
  );
}

function Error({error}) {
  if(error){
    return (
      <>
        <ErrorMessage>{error}</ErrorMessage>
      </>
    )
  }

  return <></>
}

function Title({mac}) {
  if(mac){
    return (
      <>
        <Header>ESP disponível para cadastro!</Header>
        <Header>MAC Address: {mac}</Header>
      </>
    )
  }

  return (
    <Header>Aguardando conexão do dispositivo...</Header>
  )
}