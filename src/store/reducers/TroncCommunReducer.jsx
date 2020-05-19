const initState = {
    troncCommuns: [
    // {
    //     _id:'YongwaWorld',
    //     idCours:'TchanaWorld',
    //     niveau:3,
    //     classes: ['NtchamiWorld'],
    //     startDate:'01/04/2020',
    //     history: []
    // }
    ]
}

const TroncCommunReducer = (state = initState, action)=>{
    switch(action.type){
        case 'CREATE_TRONC_COMMUN':
            return{...state, troncCommuns:[...state.troncCommuns, ...action.payload]}
        default:
            return state
    }
}

export default TroncCommunReducer;
