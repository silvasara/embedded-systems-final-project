import React from 'react';

import { Container } from './styles';
import { useDevice } from '../../contexts/DeviceContext'

export default function Device() {
  const { addDevice, devices } = useDevice()

  return (
    <Container>
      <h1>Devices aqui</h1>
    </Container>
  );
}