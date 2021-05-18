import React, { useState, useEffect } from 'react'

import DeviceList from './components/deviceList'
import Register from './components/register'
import Receiver from './services/receiver'

import GlobalStyles from './styles/GlobalStyles'

import DeviceContextProvider from './contexts/DeviceContext'

import mqtt from 'mqtt'


function App() {
  const TOPIC_MAC = 'fse/front/160144752/mac'
  const TOPIC_UPDATE = 'fse/front/160144752/update'

  const [mac, setMac] = useState('')
  const [payload, setPayload] = useState(null)

  const host = 'ws://mqtt.eclipseprojects.io/mqtt'
  var client = mqtt.connect(host)

  useEffect(() => {
    if (client) {
      client.on('connect', () => {
        console.log('Connected to broker')

        client.subscribe(TOPIC_MAC)
        client.subscribe(TOPIC_UPDATE)
      });
      client.on('error', (err) => {
        console.error('Connection error: ', err);
        client.end();
      });
      client.on('reconnect', () => {
        console.log('Reconnected to broker')
      });
      client.on('message', (topic, message) => {
        const decoded = message.toString()
        const obj = JSON.parse(decoded)

        switch(topic) {
          case TOPIC_MAC:
            setMac(obj.mac)
            break

          case TOPIC_UPDATE:
            setPayload({topic, ...obj})
            break

          default:
            console.log('Error comparing topics')
        }
      });
    }
  }, [client, mac]);


  return (
    <DeviceContextProvider>
      <Register mac={mac} setMac={setMac} />
      <DeviceList />

      <Receiver payload={payload} setPayload={setPayload}/>

      <GlobalStyles />
    </DeviceContextProvider>
  );
}

export default App;
