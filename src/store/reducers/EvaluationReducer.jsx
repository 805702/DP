const initState = {
    evaluations:[
        // {
        //     idEvaluation:1, 
        //     idPersonnel:1, 
        //     idCour:1, 
        //     duree:'', 
        //     idTypeEvaluation:1, 
        //     questions:[
        //     {
        //         idTypeQuestion:1, 
        //         indications:'say hello world before you start', 
        //         question:'what is your fathers name?',
        //         options:['kouatchoua', 'mark', 'yonga'], 
        //         answer:'Kouatchoua', 
        //         refFiles:[], 
        //         mark:2
        //     }
        //     ],
        //     published:false
        // },
    ]
}

const evaluationReducer = (state = initState, action)=>{
    switch(action.type){
        case 'CREATE_EVALUATION':
            return{...state, evaluations:[...action.payload]}
        case 'DELETE_EVALUATION':
            let newList = state.evaluations.filter(evaluation=>action.payload !== evaluation.idEvaluation)
            return{...state, evaluations:newList}
        case 'UPDATE_EVALUATION':
            return{...state, evaluations:state.evaluations.map(evaluation=>evaluation.idEvaluation===action.payload.idEvaluation?action.payload:evaluation)}
        default:
            return state
    }
}

export default evaluationReducer;

// {
//     index:1, idTypeQuestion:1, indications:'', question:'', options:[], answer:'', refFiles:[], mark:''
// }