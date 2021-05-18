import React, { useContext } from 'react';

import { Container } from './styles';
import { DeviceContext } from '../../contexts/DeviceContext'
// import { useDevice } from '../../contexts/DeviceContext'

import Device from '../device' 

export default function DeviceList({publish}) {
  const { devices } = useContext(DeviceContext)

  return (
    <Container>
      {
        devices.map(device => <Device key={device.mac} device={device} publish={publish}></Device>)
      }
    </Container>
  );
}