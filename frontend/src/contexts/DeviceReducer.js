const Storage = (devices) => {
  localStorage.setItem('devices', JSON.stringify(devices));
}

export const DeviceReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      state.devices.push(action.payload) 
      Storage(state.devices)
      return {...state}

    case 'TOGGLE_IN_DEVICE':
      const idx = state.devices.findIndex(item => item.mac === action.payload.mac)
      if(idx === -1){
        console.log("Error: inDevice not found")
        return {...state}
      }

      const newDevices = [...state.devices]
      newDevices[idx] = {...newDevices[idx], inDevicePressed: !newDevices[idx].inDevicePressed}

      Storage(newDevices)
      return {devices: newDevices}

    case 'TOGGLE_OUT_DEVICE':
      const outIdx = state.devices.findIndex(item => item.mac === action.payload.mac)
      if(outIdx === -1){
        console.log("Error: outDevice not found")
        return {...state}
      }

      const newArr = [...state.devices]
      newArr[outIdx] = {...newArr[outIdx], outDevicePressed: !newArr[outIdx].outDevicePressed}

      Storage(newArr)
      return {devices: newArr}

    case 'TOGGLE_ALARM':
      const alarmIdx = state.devices.findIndex(item => item.mac === action.payload.mac)
      if(alarmIdx === -1){
        console.log("Error: outDevice not found")
        return {...state}
      }

      const alarmArr = [...state.devices]
      alarmArr[alarmIdx] = {...alarmArr[alarmIdx], alarmPressed: !alarmArr[alarmIdx].alarmPressed}

      Storage(alarmArr)
      return {devices: alarmArr}

    case 'CLEAR':
      return state

    default:
      return state
  }
}