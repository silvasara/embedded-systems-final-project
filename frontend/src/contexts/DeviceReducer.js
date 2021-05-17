const Storage = (cartItems) => {
    localStorage.setItem('devices', JSON.stringify(cartItems.length > 0 ? cartItems: []));
}

export const DeviceReducer = (state, action) => {
    switch (action.type) {
        case "ADD_ITEM":
            state.devices.push(action.payload) 
            return state

        default:
            return state

    }
}