const initState = {
    personnels: [
    ]
}

const personnelReducer = (state = initState, action)=>{
    switch(action.type){
        case 'LOAD_PERSONNEL':
            let stateData = [...state.personnels]
            action.payload.map(perso=>{
                if(stateData.find(persso=>persso.idPersonnel===perso.idPersonnel)===undefined)stateData.push(perso)
            })
            // if(stateData.length!==0){
            //     if(action.payload.length===1) stateData=[...stateData, ...action.payload]
            //     else stateData=[...action.payload]
            // } else stateData=[...action.payload]

            return{...state, personnels:[...stateData]}
        case 'DELETE_PERSONNEL':
            return{...state, personnels:state.personnels.filter(personnel=>personnel.matricule!==action.payload)}
        case 'UPDATE_PERSONNEL':
            return{...state, personnels:state.personnels.map(personnel=>personnel.idPersonnel===action.payload.idPersonnel?action.payload:personnel)}
        default:
            return state
    }
}

export default personnelReducer;
