const initState = {
    etudiants:[
        // {idEtudiant:1, matricule:'17C005', nom:'Kouatchoua Tchakoumi', prenom:'Lorrain', idClasse:18, mail:'lorraintchakoumi@gmail.com', telephone:657140183}
    ]
}

const etudiantReducer = (state = initState, action)=>{
    switch(action.type){
        case 'CREATE_ETUDIANT':
            return{...state, etudiants:[...state.etudiants, ...action.payload]}
        default:
            return state
    }
}

export default etudiantReducer;
