const initState = {
    faculties:[
    ]
}

const adjustIndex = (listArray) => {
        let index = 0;
        let tempQuestions = []
        listArray.map(filiere => {
            index = index + 1
            filiere.index = index
            tempQuestions.push(filiere)
            return null;
        })

        return tempQuestions;
    }
const facultyReducer = (state = initState, action)=>{
    switch(action.type){
        case 'CREATE_FACULTY':
            let stateData = [...state.faculties]

            action.payload.map(faculty=>{
                if(stateData.find(facultx=>facultx._id===faculty._id)===undefined)stateData=[...stateData,faculty]
                return null
            })
            // if(stateData.length!==0){
            //     if(action.payload.length===1) stateData=[...stateData, ...action.payload]
            //     else stateData=[...action.payload]
            // } else stateData=[...action.payload]

            return{faculties:[...stateData]}
        case 'DELETE_FACULTY':
            let newList = state.faculties.filter(faculte=>Number(action.payload) !== faculte.index)
            newList = adjustIndex(newList)
            return{faculties:newList}
        default:
            return state
    }
}

export default facultyReducer;
