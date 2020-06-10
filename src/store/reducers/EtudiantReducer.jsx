const initState = {
    etudiants:[
        // {idEtudiant:1, matricule:'17C005', nom:'Kouatchoua Tchakoumi', prenom:'Lorrain', idClasse:18, mail:'lorraintchakoumi@gmail.com', telephone:657140183}
    ]
}

const etudiantReducer = (state = initState, action)=>{
    switch(action.type){
        case 'CREATE_ETUDIANT':
            let stateData = [...state.etudiants]
            if(stateData.length!==0){
                if(action.payload.length===1) stateData=[...stateData, ...action.payload]
                else stateData=[...action.payload]
            } else stateData=[...action.payload]

            return{...state, etudiants:[...stateData]}
        default:
            return state
    }
}

export default etudiantReducer;
