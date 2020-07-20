import React, { Component } from 'react'
import { connect } from 'react-redux'
import Hoc from '../shared/utils/hoc.js'
import parseJwt from '../shared/utils/parseJwt.js'
import './StudentNotes.css'
import StudentNav from '../shared/UIElements/StudentNav.jsx'

class StudentNotes extends Component {
    state={
        idEtudiant:null,
    }

    getStudentNotes=()=>this.props.notes.filter(note=>note.idEtudiant===this.state.idEtudiant)

    displayNotes=()=>{
        let studentNotes = this.getStudentNotes()
        let index=0
        return studentNotes.map(note=>(
            <div className="aStudentNote" key={note.idNote}>
                <span>{++index}</span>
                <span>{this.props.cours.find(cour=>cour.idCour===note.idCour).nomCours}</span>
                <span>{
                    (function(perso,course){
                                    let personnel=perso.find(personnel=>personnel.idPersonnel===course.find(cour=>cour.idCour===note.idCour).nomEnseignant);
                                    if(!personnel)return "enseignant not found"; 
                                    return personnel.nom +" "+ personnel.prenom
                                })(this.props.personnels,this.props.cours)
                    }</span>
                <span>{(note.notes.CC.published)?(note.notes.CC.note):('N/A')}</span>
                <span>{(note.notes.Examen.published)?(note.notes.Examen.note):('N/A')}</span>
            </div>
        ))
    }

    displayNotesHeader=()=>(
        <div className='displayStudentNotesHeader'>
            <span>No</span>
            <span>Matieres</span>
            <span>Enseignant</span>
            <span>CC</span>
            <span>Examen</span>
        </div>
    )
    componentDidMount(){
        fetch('https://dp-dbv2.herokuapp.com/student/compos/notes-courses', {
            method: 'get',
            headers: {'Content-Type': 'application/json','x-access-token':window.localStorage.getItem("token")}
          })
          .then(response=>response.json())
          .then(data=>{
            if(data.message){
              console.log(data.message)
                  const cours = data.message.courses.map(cour=>{return{
                    idCour:cour._id,
                    classe: cour.classes,
                    nomCours: cour.nomCour,
                    codeCours: cour.codeCour,
                    nomEnseignant: cour.idEnseignant,
                }})
                const notes = data.message.notes.map(note=> {
                    return {
                        idNote:note._id, 
                        idCour:note.idCour, 
                        idEtudiant:note.idEtudiant,  
                        notes:note.notes, 
                    }
                  })
                const users = data.message.users.map(user=>{return{
                    idPersonnel:user._id,
                    matricule: user.matricule,
                    nom: user.nom,
                    prenom: user.prenom,
                    mail: user.email,
                    tel: user.tel,
                    role: user.role
                }})
                this.props.dispatch({type: "LOAD_PERSONNEL", payload: users})
                this.props.dispatch({type: "LOAD_COUR", payload: cours})
                this.props.dispatch({type: "CREATE_NOTE", payload: notes})
                this.setState({idEtudiant:parseJwt(window.localStorage.getItem('token')).user._id})
                console.log("passing here 1")
            }
            else{
              console.log(data)
            }
          })
          .catch(error=>console.log(error))   
    }
    render() {
        return (
            <div>
                <StudentNav />
            {(!this.state.idEtudiant)?
                <div id="loading-on">Loading</div>
            :
            <Hoc>
                {this.displayNotesHeader()}
                {this.displayNotes()}
            </Hoc>
            }
            </div>
        )
    }
}

const mapStateToProps=(state)=>{
    return {
        personnels: state.Personnel.personnels,
        notes: state.Note.notes,
        cours: state.Cour.cours,
    }
}

export default connect(mapStateToProps)(StudentNotes)