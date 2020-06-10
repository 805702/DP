const initState = {
    modules:[
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

const moduleReducer = (state = initState, action)=>{
    switch(action.type){
        case 'LOAD_MODULE':
            let newList = adjustIndex(action.payload)

            let stateData = [...state.modules]
            if(stateData.length!==0){
                if(newList.length===1) stateData=[...stateData, ...newList]
                else stateData=[...newList]
            } else stateData=[...newList]

            return{...state, modules:[...stateData]}
        case 'CREATE_MODULE':
            return{...state, modules:[...state.modules, {index: state.modules.length+1, ...action.payload}]}
        default:
            return state
    }
}

export default moduleReducer;
