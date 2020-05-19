const initState = {
    batiments:[
    {
        _id:'TchamiWorld',
        nomBatiment:'FST',
        idFaculty:'5e974dbf81a3fe3ae37aa426',
        salles: [{_idSalle:'TchuenkamWorld', nomSalle:'B03', capacite:30}],
        startDate:'01/04/2020',
        history: []
    },
    {
        _id:'TchamiWorl',
        nomBatiment:'FSB',
        idFaculty:'5e974dbf81a3fe3ae37aa426',
        salles: [{_idSalle:'TchuenkamWorl', nomSalle:'B04', capacite:30}],
        startDate:'01/04/2020',
        history: []
    }
    ]
}

const batimentReducer = (state = initState, action)=>{
    switch(action.type){
        case 'CREATE_BATIMENT':
            return{...state, batiments:[...state.batiments, ...action.payload]}
        default:
            return state
    }
}

export default batimentReducer;
