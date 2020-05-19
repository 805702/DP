const initState = {
    typeEvaluations:[
        {idTypeEvaluation:1, nomTypeEvaluation:'CC'},
        {idTypeEvaluation:2, nomTypeEvaluation:'Examen'},
        {idTypeEvaluation:3, nomTypeEvaluation:'Devoir'},
        {idTypeEvaluation:4, nomTypeEvaluation:'Rattrapage'},
    ]
}

const typeEvaluationReducer = (state = initState, action)=>{
    switch(action.type){
        case 'CREATE_TYPE_EVALUATION':
            return{...state, typeEvaluations:[...action.payload]}
        default:
            return state
    }
}

export default typeEvaluationReducer;
