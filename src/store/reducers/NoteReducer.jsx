const initState = {
    notes:[
    ]
}

const noteReducer = (state = initState, action)=>{
    switch(action.type){
        case 'CREATE_NOTE':
            return{...state, notes:[...state.notes, ...action.payload]}
         case 'UPDATE_NOTE':
            return{...state, notes:state.notes.map(note=>note.idNote===action.payload.idNote?action.payload:note)}
        default:
            return state
    }
}

export default noteReducer;
