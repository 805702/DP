const initState = {
    roles: [
        {id:1, nomRole:'enseignant'},
        {id:2, nomRole:'coordonateur'},
        {id:3, nomRole:'secretaire'},
    ]
}

const roleReducer = (state = initState, action)=>{
    switch(action.type){
        case 'CREATE_ROLE':
            return{...state, roles:[...state.roles, ...action.payload]}
        default:
            return state
    }
}

export default roleReducer;