const initState = {
   cours:[
        //idEnseignant is idPersonnel. but given that i already used it as idEnseignant, i felt lazy to change it again. ref(TeacherNotes, TimeTableFormat.jsx)
        // {idCour:1, classe:['IRT 3','IMB 2'], nomCours:'IDE', codeCours:'PROG0001', nomEnseignant:'Wangun Parfait Pascal', idEnseignant:1, refSupports:[{nameFile:'Chap 1.pdf', ref:'PROG0001_1'}, {nameFile:'Chap 2.docx', ref:'PROG0001_2'}, {nameFile:'Chap 3.xls', ref:'PROG0001_3'},]}
        // ,{idCour:2, classe:['IRT 3','IMB 2'], nomCours:'Projet reseaux', codeCours:'PROG0002', nomEnseignant:'Takoudjou Alexis', idEnseignant:1, refSupports:[{nameFile:'Chap 1.pdf', ref:'PROG0001_1'}, {nameFile:'Chap 2.docx', ref:'PROG0001_2'}, {nameFile:'Chap 3.xls', ref:'PROG0001_3'},]}
    ]
}

const courReducer = (state = initState, action)=>{
    switch(action.type){
        case 'LOAD_COUR':
            return{...state, cours:[...action.payload]}       
        case 'UPDATE_COUR':
        	let index;
        	for (var i = 0; i < action.payload.length; i++) {
                let idx = i;
        		index = state.cours.findIndex(cr=>cr.idCour===action.payload[idx].idCour)
        		if(index){
        			state.cours[index] = action.payload[idx]
        		}
        	}
            return{...state, cours:state.cours}
        case 'UPDATE_A_COUR':
            state.cours.forEach(cour=>{
                if(cour.codeCours===action.payload.codeCour){
                    cour.nomEnseignant = action.payload.teacherId;
                    return;
                 }
             })
            return state
        default:
            return state
    }
}

export default courReducer;
