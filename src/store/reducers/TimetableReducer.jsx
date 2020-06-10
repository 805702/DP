const initState = {
     timetables: [
    ]
}

const TimetableReducer = (state = initState, action)=>{
    switch(action.type){
        case 'CREATE_TIMETABLE':
            let stateData = [...state.timetables]
            if(stateData.length!==0){
                if(action.payload.length===1) stateData=[...stateData, ...action.payload]
                else stateData=[...action.payload]
            } else stateData=[...action.payload]


            return{...state, timetables:[...stateData]}
        default:
            return state
    }
}

export default TimetableReducer;
