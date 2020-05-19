const initState = {
    personnels: [
    ]
}

const personnelReducer = (state = initState, action)=>{
    switch(action.type){
        case 'LOAD_PERSONNEL':
            return{...state, personnels:[...state.personnels, ...action.payload]}
        case 'DELETE_PERSONNEL':
            return{...state, personnels:state.personnels.filter(personnel=>personnel.matricule!==action.payload)}
        case 'UPDATE_PERSONNEL':
            return{...state, personnels:state.personnels.map(personnel=>personnel.idPersonnel===action.payload.idPersonnel?action.payload:personnel)}
        default:
            return state
    }
}

export default personnelReducer;
