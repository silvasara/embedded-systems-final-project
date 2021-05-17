

import Device from './components/device'
import Register from './components/register'
import GlobalStyles from './styles/GlobalStyles'

import DeviceContextProvider from './contexts/DeviceContext'

function App() {
  return (
    <DeviceContextProvider>
      <Register></Register>
      <Device></Device>

      <GlobalStyles />
    </DeviceContextProvider>
  );
}

export default App;
