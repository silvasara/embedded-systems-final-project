import DeviceList from './components/deviceList'
import Register from './components/register'
import GlobalStyles from './styles/GlobalStyles'

import DeviceContextProvider from './contexts/DeviceContext'

function App() {
  return (
    <DeviceContextProvider>
      <Register />
      <DeviceList />

      <GlobalStyles />
    </DeviceContextProvider>
  );
}

export default App;
