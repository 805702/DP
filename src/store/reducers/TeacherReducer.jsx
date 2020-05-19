const initState = {
    teachers:[]
}

const teacherReducer = (state = initState, action)=>{
    switch(action.type){
        case 'CREATE_TEACHER':
            return{...state, teachers:[...action.payload]}
        default:
            return state
    }
}

export default teacherReducer;
