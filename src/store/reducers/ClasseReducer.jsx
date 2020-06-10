const initState = {
    classes:[
    ]
}

const classeReducer = (state = initState, action)=>{
    switch(action.type){
        case 'LOAD_CLASSE':
            let stateData = [...state.classes]
            if(stateData.length!==0){
                if(action.payload.length===1) stateData=[...stateData, ...action.payload]
                else stateData=[...action.payload]
            } else stateData=[...action.payload]

            return{...state, classes:[...stateData]}
        default:
            return state
    }
}

export default classeReducer;
