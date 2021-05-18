const Storage = (devices) => {
  localStorage.setItem('devices', JSON.stringify(devices));
}

export const DeviceReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      state.devices.push(action.payload) 
      Storage(state.devices)
      return {...state}

    case 'UPDATE':
      const idx = state.devices.findIndex(item => item.mac === action.payload.mac)
      if(idx === -1){
        console.log("Error: outDevice not found")
        return {...state}
      }

      const newArr = [...state.devices]
      newArr[idx] = {...newArr[idx], ...action.payload.content}

      Storage(newArr)
      return {devices: newArr}

    case 'CLEAR':
      return state

    default:
      return state
  }
}