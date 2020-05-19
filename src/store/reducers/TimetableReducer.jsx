const initState = {
     timetables: [
    ]
}

const timeTableReducer = (state = initState, action)=>{
    switch(action.type){
        case 'CREATE_TIMETABLE':
            return{...state, timetables:[...state.timetables, ...action.payload]}
        default:
            return state
    }
}

export default timeTableReducer;
