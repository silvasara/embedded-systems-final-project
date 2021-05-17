import React, { useContext } from 'react';

import { Container } from './styles';
import { DeviceContext } from '../../contexts/DeviceContext'
// import { useDevice } from '../../contexts/DeviceContext'

import Device from '../device' 

export default function DeviceList() {
  // const { addDevice, devices } = useDevice()
  const { devices } = useContext(DeviceContext)

  return (
    <Container>
      {
        devices.map(device => <Device key={device.mac} device={device}></Device>)
      }
    </Container>
  );
}