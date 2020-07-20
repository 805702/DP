import React, { Component } from 'react'

import Hoc from '../shared/utils/hoc.js'
import parseJwt from '../shared/utils/parseJwt.js'

import './TeacherNotes.css'
import { connect } from 'react-redux'
import TeacherNav from '../shared/UIElements/TeacherNav.jsx'
import CoordoNav from '../shared/UIElements/CoordoNav.jsx'

class TeacherNotes extends Component {
    state={
        idPersonnel:null,
        personnelCours:[],
        idCour:'',
        idClasse:'',
        typeEvaluation:'',
        noteAction:'',
        createNote:true,
        editableNote:{idNote:'', idEtudiant:'', idCour:'', notes:{
            CC:{note:'', published:false},
            Examen:{note:'', published:false},
            Projet:{note:'', published:false},
            TD:{td:'', note:false},
            Rattrapage:{note:'', published:false}
        }},
    }
    componentDidMount(){
        fetch('https://dp-dbv2.herokuapp.com/teacher/notes/teacher-notes', {
            method: 'get',
            headers: {'Content-Type': 'application/json','x-access-token':window.localStorage.getItem("token")}
          })
          .then(response=>response.json())
          .then(data=>{
            if(data.message){
              console.log(data.message)
                const student = data.message.students.map(student=>{return{
                    idEtudiant:student._id,
                    matriculePersonnel: student.matricule,
                    nom: student.nom,
                    prenom: student.prenom,
                    mail: student.email,
                    tel: student.tel,
                    role: student.role,
                    idClasse: student.idClasse
                }})
                const cours = data.message.courses.map(cour=>{return{
                    idCour:cour._id,
                    classe: cour.classes,
                    nomCours: cour.nomCour,
                    codeCours: cour.codeCour,
                    nomEnseignant: cour.idEnseignant,
                }})
                const users = data.message.users.map(user=>{return{
                    idPersonnel:user._id,
                    matricule: user.matricule,
                    nom: user.nom,
                    prenom: user.prenom,
                    mail: user.email,
                    tel: user.tel,
                    role: user.role
                }})
                const notes = data.message.notes.map(note=> {
                    return {
                        idNote:note._id, 
                        idCour:note.idCour, 
                        idEtudiant:note.idEtudiant,  
                        notes:note.notes, 
                    }
                  })
                 const classes = data.message.classes.map(classe=> {
                    return {
                        idClasse:classe._id, 
                        filiere:{
                            nomFiliere:classe.nomClasse, 
                            idFiliere: classe.idFiliere
                        }, 
                        niveau:classe.niveau
                    }
                  })
                this.props.dispatch({type: "LOAD_CLASSE", payload: classes})
                this.props.dispatch({type: "CREATE_ETUDIANT", payload: student})
                this.props.dispatch({type: "LOAD_PERSONNEL", payload: users})
                this.props.dispatch({type: "LOAD_COUR", payload: cours})
                this.props.dispatch({type: "CREATE_NOTE", payload: notes})
                this.setState({idPersonnel:parseJwt(window.localStorage.getItem('token')).user._id},()=>this.setState({personnelCours:this.getPersonnelSubjects()}))
        console.log("passing here 1")
            }
            else{
              console.log(data)
            }
          })
          .catch(error=>console.log(error))      
    }

    getPersonnelSubjects=()=>this.props.cours.filter(cour=>cour.nomEnseignant===this.state.idPersonnel)

    handleSelectChange=(e)=>{
        this.setState({[e.target.id]:e.target.value})
    }

    personnelSubjectSelect=()=>{
        return <select id='idCour' onChange={this.handleSelectChange}>
            <option hidden value=''>choisissez une matiere</option>
            {this.getPersonnelSubjects().map(subject=><option key={subject.idCour} value={subject.idCour}>{subject.nomCours}</option>)}
        </select>
    }

    subjectClassesSelect=()=>{
        if(this.state.idCour!==''){
            let classes = this.props.cours.find(cour=>cour.idCour===this.state.idCour).classe
            classes = classes.map(classe=>this.props.classes.find(aclass=>aclass.idClasse===classe))
            return <select id='idClasse' onChange={this.handleSelectChange}>
                <option hidden value=''>Choissisez une classe</option>
                {classes.map(classe=><option key={classe.idClasse} value={classe.idClasse}>{classe.filiere.nomFiliere+' '+classe.niveau}</option>)}
            </select>
        }else return null
    }

    typeEvaluationSelect=()=>{
        let types = this.props.typeEvaluations.map(typeEvaluation=>{
            if(typeEvaluation.nomTypeEvaluation !=='Devoir'){
                return <option key={typeEvaluation.idTypeEvaluation} value={typeEvaluation.nomTypeEvaluation}>{typeEvaluation.nomTypeEvaluation}</option>
            }else return null
        })

        return this.state.idClasse!==''?(
            <select id='typeEvaluation' onChange={this.handleSelectChange}>
                <option hidden value=''>Choissisez un evaluation</option>
                {types}
            </select>
        ):null
    }

    handleNoteBtnClick=(e)=>{
        this.setState({noteAction:e.target.id})
    }

    showActionBtns=()=>{
        return this.state.typeEvaluation!==''?(
            <div className='noteBtns'>
                <button id='enter' onClick={this.handleNoteBtnClick}>Entrer notes</button>
                <button id='view' onClick={this.handleNoteBtnClick}>Voir notes</button>
            </div>
        ):null
    }

    getStudentSubjectNotes=()=>{
        if(this.state.idClasse!==''){
            let students = this.props.etudiants.filter(etudiant=>etudiant.idClasse===this.state.idClasse)
            let noNotes = []
            let workingId=0
            students.map(student=>{
                if(this.props.notes.find(note=>note.idEtudiant===student.idEtudiant && note.idCour===this.state.idCour)===undefined){
                    let newNote = {
                        idNote: this.props.notes.length+(workingId++),
                        idCour: this.state.idCour,
                        idEtudiant:student.idEtudiant,
                        notes:{CC:{note:"N/A", published:false}, Examen:{note:"N/A", published:false}, Rattrapage:{note:"N/A", published:false}}
                    }
                    noNotes=[...noNotes, newNote]
                }
            })

            console.log(noNotes)
            /*
                Create the notes of noNotes in the bd then load the data back on the frontend
                this way, all students have notes for the subject if the student did not write the test (online) his mark will be zero.
                but then, the teacher can also change the student's mark if the test wasn't written online.
                so beg Angelo to adjust that
            */
        //    noNotes.map(note=>{
        //        fetch('https://dp-dbv2.herokuapp.com/teacher/notes/teacher-notes', {
        //            method: 'get',
        //            headers: {'Content-Type': 'application/json','x-access-token':window.localStorage.getItem("token")}
        //         })
        //         .then(response=>response.json())
        //         .then(data=>{console.log(data)})
        //     })
            // if(this.state.createNote){
            //     this.props.dispatch({type:'CREATE_NOTE', payload:noNotes})
            //     this.setState({createNote:false})
            // }

            return students.map(student=>this.props.notes.find(note=>note.idEtudiant===student.idEtudiant && note.idCour===this.state.idCour))
        }else return null
    }

    handleNoteChange=(e,std)=>{
        let newNote = {
            idNote: std.idNote,
            idCour: std.idCour,
            idEtudiant:std.idEtudiant,
            notes:{...std.notes, [this.state.typeEvaluation]:{ note: Number(e.target.value), published: std.notes[this.state.typeEvaluation].published }}
        }
       fetch(`https://dp-dbv2.herokuapp.com/teacher/notes/${newNote.idNote}/update`, {
                         method: 'put',
                         headers: {'Content-Type': 'application/json','x-access-token':window.localStorage.getItem("token")},
                         body: JSON.stringify({
                            note: newNote
                         })
            })
       .then(response=>response.json())
       .then(data=>{
            if(data.message){
                 console.log('Successfull')
                             console.log(data.message)
                            this.props.dispatch({type: "UPDATE_NOTE", payload: {
                                 idNote:data.message._id, 
                                idCour:data.message.idCour, 
                                idEtudiant:data.message.idEtudiant,  
                                notes:data.message.notes, 
                            }})
                     this.props.dispatch({ type:'UPDATE_NOTE', payload: newNote })
                         }
                else{
                            alert('Failed')
                           console.log(data)
                }
            })
       .catch(err=>{
        alert('Failed')
        console.log(err)
       })
    }

    displayNotes=()=>{
        if(this.state.noteAction!==''){
            let index=0
            
            return this.state.noteAction==='view'?(
                <div className="displayTeacherNotes">
                    <div className="displayTeacherNotesHeader  displayTeacherNotesHeaderView">
                        <span>No</span>
                        <span>Matricule</span>
                        <span>Nom et prenoms</span>
                        <span>CC</span>
                        <span>Examen</span>
                        <span>Rattrapage</span>
                    </div>
                    <div className="displayTeacherGivenNotes displayTeacherGivenNotesView">
                        {
                            this.getStudentSubjectNotes().filter(note=>note!==undefined).map(studentMark=><div key={studentMark.idEtudiant} className='studentNote'>
                                <span>{++index}</span>
                                <span>{this.props.etudiants.find(etudiant=>etudiant.idEtudiant===studentMark.idEtudiant).matriculePersonnel}</span>
                                <span>{this.props.etudiants.find(etudiant=>etudiant.idEtudiant===studentMark.idEtudiant).nom+' '+this.props.etudiants.find(etudiant=>etudiant.idEtudiant===studentMark.idEtudiant).prenom}</span>
                                <span>{studentMark.notes.CC.note}</span>
                                <span>{studentMark.notes.Examen.note}</span>
                                <span>{studentMark.notes.Rattrapage.note}</span>
                            </div>)
                        }
                    </div>
                </div>
            ):(
                <div className="displayTeacherNotes">
                    <div className="displayTeacherNotesHeader">
                        <span>No</span>
                        <span>Matricule</span>
                        <span>Nom et prenoms</span>
                        <span>{this.state.typeEvaluation}</span>
                    </div>
                    <div className="displayTeacherGivenNotes">
                        {
                            this.getStudentSubjectNotes().filter(note=>note!==undefined).map(studentMark=><div key={studentMark.idEtudiant} className='studentNote'>
                                <span>{++index}</span>
                                <span>{this.props.etudiants.find(etudiant=>etudiant.idEtudiant===studentMark.idEtudiant).matriculePersonnel}</span>
                                <span>{this.props.etudiants.find(etudiant=>etudiant.idEtudiant===studentMark.idEtudiant).nom+' '+this.props.etudiants.find(etudiant=>etudiant.idEtudiant===studentMark.idEtudiant).prenom}</span>
                                <input type='number' placeholder='Entrer une note' onChange={(e)=>this.handleNoteChange(e,studentMark)} id={studentMark.idEtudiant} value={studentMark.notes[this.state.typeEvaluation].note} />
                            </div>)
                        }
                    </div>
                </div>
            )

        }else return null
    }

    render() {
        return (
            //You have done everything asked by the interface. but the one thing this interface prevents the teacher from doing is publishing
            //his notes. if the teacher cannot publish his notes, then rest assured
            //neither the students nor the coordo will be able to see any notes. 
            //hence you have to work out the problem of teachers publishing their notes.
            //PS: Boston always finds a way out ;)
            <div>
                {parseJwt(window.localStorage.getItem('token')).user.role==='coordonateur'?<CoordoNav />:<TeacherNav />}
                <div className='teacherNotesOverallHolder'>
                {(!this.state.idPersonnel)?
                    <div id="loading-on">Loading</div>
                :
                <Hoc>
                    <div className="teacherNotesSelect">
                        {this.personnelSubjectSelect()}
                        {this.subjectClassesSelect()}
                        {this.typeEvaluationSelect()}
                    </div>
                    {this.showActionBtns()}
                    {this.displayNotes()}
                </Hoc>
                }
                </div>
            </div>
        )
    }
}

const mapStateToProps=(state)=>{
    return {
        classes: state.Classe.classes,
        cours: state.Cour.cours,
        etudiants: state.Etudiant.etudiants,
        personnels: state.Personnel.personnels,
        typeEvaluations: state.TypeEvaluation.typeEvaluations,
        notes: state.Note.notes
    }
}

export default connect(mapStateToProps)(TeacherNotes)