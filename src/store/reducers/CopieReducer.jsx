const initState = {
    copies:[
        // //example of a devoir object
        // {idCopie:1,
        //  idEvaluation:1,
        //   idEtudiant:1,
        //    idTypeEvaluation:3,
        //     dateRemis:'04/26/2020',
        //      propositions:[
        //      {
        //         index:1, 
        //         proposition:'mark'
        //     }
        //     ], 
        //     submitted:false},
        // //example of a cc, examen or rattrapage object
        // {
        //     idCopie: 2,
        //      idEvaluation: 1,
        //       idEtudiant: 2,
        //        idTypeEvaluation: 1,
        //         proposition:[
        //         {
        //             index: 1,
        //              proposition: "",
        //               score: 0
        //           },{
        //             index: 2,
        //              proposition: "",
        //               score: 0
        //           }
        //           ]
        //       }
    ]
}

const copieReducer = (state = initState, action)=>{
    switch(action.type){
        case 'CREATE_COPIE':
            return{...state, copies:[...state.copies, ...action.payload]}
        case 'UPDATE_COPIE':
            return{...state, copies:state.copies.map(copie=>copie.idCopie===action.payload.idCopie?action.payload:copie)}
        default:
            return state
    }
}

export default copieReducer;
