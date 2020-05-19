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
            return{...state, coordonateurs:[...state.coordonateurs, ...action.payload]}
        default:
            return state
    }
}

export default coordonateurReducer;