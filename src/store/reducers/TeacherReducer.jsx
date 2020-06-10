const initState = {
    teachers:[]
}

const teacherReducer = (state = initState, action)=>{
    switch(action.type){
        case 'CREATE_TEACHER':
            let stateData = [...state.teachers]
            if(stateData.length!==0){
                if(action.payload.length===1) stateData=[...stateData, ...action.payload]
                else stateData=[...action.payload]
            } else stateData=[...action.payload]


            return{...state, teachers:[...stateData]}
        default:
            return state
    }
}

export default teacherReducer;
