const initState = {
    notes:[
    ]
}

const noteReducer = (state = initState, action)=>{
    switch(action.type){
        case 'CREATE_NOTE':
            let stateData = [...state.notes]
            action.payload.map(aNote=>{
                if(stateData.find(note=>note.idNote===aNote.idNote)===undefined)stateData=[...stateData, aNote]
            })
            // if(stateData.length!==0){
            //     if(action.payload.length===1) stateData=[...stateData, ...action.payload]
            //     else stateData=[...action.payload]
            // } else stateData=[...action.payload]


            return{...state, notes:[...stateData]}
         case 'UPDATE_NOTE':
            return{...state, notes:state.notes.map(note=>note.idNote===action.payload.idNote?action.payload:note)}
        default:
            return state
    }
}

export default noteReducer;
