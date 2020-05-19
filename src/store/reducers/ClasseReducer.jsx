const initState = {
    classes:[
    ]
}

const classeReducer = (state = initState, action)=>{
    switch(action.type){
        case 'LOAD_CLASSE':
            return{...state, classes:[...action.payload]}
        default:
            return state
    }
}

export default classeReducer;
