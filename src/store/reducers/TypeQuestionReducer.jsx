const initState = {
    typeQuestions:[
        {idTypeQuestion:1, nomTypeQuestion:'QCM'},
        {idTypeQuestion:2, nomTypeQuestion:'QRO'},
    ]
}

const typeQuestionReducer = (state = initState, action)=>{
    switch(action.type){
        case 'CREATE_TYPE_QUESTION':
            return{...state, typeQuestions:[...action.payload]}
        default:
            return state
    }
}

export default typeQuestionReducer;
