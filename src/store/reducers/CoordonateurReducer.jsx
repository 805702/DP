const initState = {
    coordonateurs:[
    // {
    //     idCoordonateur:'KamdaWorld',
    //     matriculePersonnel:'babatas',
    //     idPersonnel:6,
    //     classes: ['IRT 3', 'IRT 2', 'IRT 1'],
    //     timetables:[
    //         {classe:'IRT 1', timetable:{}},
    //         {classe:'IRT 2', timetable:{}},
    //         {classe:'IRT 3', timetable:{}},
    //     ],
    // }
    ]
}

const coordonateurReducer = (state = initState, action)=>{
    switch(action.type){
        case 'CREATE_COORDONATEUR':
            let stateData = [...state.coordonateurs]
            if(stateData.length!==0){
                if(action.payload.length===1) stateData=[...stateData, ...action.payload]
                else stateData=[...action.payload]
            } else stateData=[...action.payload]

            return{...state, coordonateurs:[...stateData]}
        default:
            return state
    }
}

export default coordonateurReducer;