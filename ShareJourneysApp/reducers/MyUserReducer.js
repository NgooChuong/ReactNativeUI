const MyUserReducer = (currentState, action) => {
    switch (action.type) {
        
        case "login":
            console.log('vo r ne',currentState)
            console.log(action.payload)
            return action.payload;
        case "logout":
            
            return action.payload;

    }
    console.log(currentState)
    return currentState;
}
    
export default MyUserReducer;

