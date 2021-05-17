import React, { useState, useContext } from 'react';

import { DeviceContext } from '../../contexts/DeviceContext'

import { Container } from './styles';

export default function Register() {
  const [espAvailable, setEspAvailable] = useState(false)
  const [err, setErr] = useState('')

  const [room, setRoom] = useState('')
  const [inDevice, setInDevice] = useState('')
  const [outDevice, setOutDevice] = useState('')

  const { addDevice } = useContext(DeviceContext)

  const [mac, setId] = useState(0)


  const registerEsp = async(e) => {
    e.preventDefault()

    setEspAvailable(true)
    if (!espAvailable){
      setErr('Não há um dispositivo disponível!')
    } else if (!room) {
      setErr('O nome do cômodo deve ser preenchido!')
    } else {
      setErr('')

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
        temperature: 0,
        humidity: 0,
        mac
      }
      addDevice(payload)
    }

  }

  return (
    <Container>
      <Title hasEsp={espAvailable}></Title>

      <br></br>

      <input type="text" value={room} onChange={e => setRoom(e.target.value)} placeholder="Cômodo da casa" ></input>
      <input type="text" value={inDevice} onChange={e => setInDevice(e.target.value)} placeholder="Dispositivo de Entrada"></input>
      <input type="text" value={outDevice} onChange={e => setOutDevice(e.target.value)} placeholder="Dispositivo de Saída"></input>
      
      <button onClick={e => registerEsp(e)}>REGISTRAR</button>
      <Error error={err}/>
      
      
    </Container>
  );
}

function Error({error}) {
  if(error){
    return (
      <>
        <span>{error}</span>
      </>
    )
  }

  return <></>
}

function Title(props) {
  if(props.hasEsp){
    return (
      <>
        <span>ESP disponível para cadastro!</span>
        <span>MAC Address: </span>
      </>
    )
  }

  return (
    <span>Aguardando conexão do dispositivo...</span>
  )
}