import React, { Component } from 'react'
import { connect } from 'react-redux'
import Hoc from '../../shared/utils/hoc.js'
import parseJwt from '../../shared/utils/parseJwt.js'
import './PublierNoteExamen.css'
import CoordoNav from '../../shared/UIElements/CoordoNav.jsx'

class PublierNoteExamen extends Component {
    state={
        idPersonnel:null,

        idClasse:'',
    }

    getCoordoClasses=()=>this.props.coordonateurs.find(coordonateur=>coordonateur.idPersonnel===this.state.idPersonnel).classes

    getClassesObjects=()=>{
        let classes = this.getCoordoClasses()
        return classes.map(aclass=>this.props.classes.find(classe=>classe.idClasse===aclass))
    }

    handleSelectChange=(e)=>{
        this.setState({[e.target.id]:e.target.value})
    }

    displayClasseSelect=()=>{
        let classes = this.getClassesObjects()
        return (
            <select className='publierNoteChooseClasse' id='idClasse' onChange={this.handleSelectChange}>
                <option value='' hidden>Choisissez une classe</option>
                {classes.map(classe=><option key={classe.idClasse} value={classe.idClasse}>{classe.filiere.nomFiliere+' '+classe.niveau}</option>)}
            </select>
        )
    }
    
    handlePublierNotesCoordo=(e)=>{
        let module=this.props.modules.find(module=>module.idModule===e.target.id.split('_')[1])
        let moduleSubjects = module.matieres.map(matiere=>this.props.cours.find(cour=>cour.codeCours===matiere.codeCours))
        let notes = moduleSubjects.map(subject=>this.props.notes.filter(note=>note.idCour===subject.idCour))
        let noteArray = []
        notes.map(subjectNotes=>subjectNotes.map( async note=>{
            let tempNote = note
            tempNote.notes.Examen.published=true
            let data = await fetch(`https://tranquil-thicket-81941.herokuapp.com/coordo/note/${tempNote.idNote}/publish`, {
                         method: 'put',
                         headers: {"Content-Type": "application/json",'x-access-token':window.localStorage.getItem("token")},
                         body: JSON.stringify({note: tempNote})
                       })
        data = await data.json()
        console.log(data)
        
        if(data.error) return alert('Something went wrong!')
        this.props.dispatch({type: "UPDATE_NOTE", payload: {
                        idNote:data._id, 
                        idCour:data.idCour, 
                        idEtudiant:data.idEtudiant,  
                        notes:data.notes, 
                    }})
            //update the note with id: tempNote.idNote with tempNote
            noteArray.push(tempNote)
        }))
        console.log(noteArray)
        //for every subject in the module, get all the notes who's idCour's correspond to subject.idCour
        //change the published state of all these notes Examen and put it to true
        //update all these notes.
    }

    displayClassModules=()=>{
        if(this.state.idClasse!==''){
            let classModules = this.props.modules.filter(module=>module.idClasse === this.state.idClasse)
            console.log(220000,classModules)
            //for every modules, get the courses.
            return classModules.map(module=>{
                let moduleSubjects = module.matieres.map(matiere=>this.props.cours.find(cour=>cour.codeCours===matiere.codeCours))
                let moduleState=[]
            console.log(5500,moduleSubjects)

                let styledModuleSubjects = moduleSubjects.map(subject=>{

                    //for every course, find a note whose subject is this, then verify the published state of the examen mark
                    let subjectState = this.props.notes.find(note=>note.idCour===subject.idCour)
                    subjectState= subjectState!==undefined?subjectState.notes.Examen.published:false
                    moduleState.push(subjectState)

                    //if the published !== false, then display (disponible) else display (non disponible)
                    return subjectState !==false?(
                        <div className="moduleSubjectState" key={subject.idCour}>
                            <span>{subject.nomCours}</span>
                            <span>Disponible</span>
                        </div>
                    ):(
                        <div className="moduleSubjectState" key={subject.idCour}>
                            <span>{subject.nomCours}</span>
                            <span>Non disponible</span>
                        </div>
                    )
                })

                return <div className="moduleState" key={module.idModule}>
                    <span className='ModuleStateName'>{module.nomModule}</span>
                    {styledModuleSubjects}
                    {/*
                        //if all subjects are inTransit, then the button should have value(Publier)
                        //else the button should be grey and disabled
                        //if the subjects have already been published, then no button
                    */}
                    {moduleState.includes(false)?(<button className='publierNoteExamBtn' disabled>Publier</button>)
                    :moduleState.includes('inTransit')?(<button className='publierNoteExamBtn' id={'module_'+module.idModule} onClick={this.handlePublierNotesCoordo} >Publier</button>):null}
                </div>
            })
        }else return null
    }

    componentDidMount(){
        fetch('https://tranquil-thicket-81941.herokuapp.com/coordo/note', {
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
                const coordos = data.message.coordos.map(coordo=>{return{
                    idCoordonateur:coordo._id,
                    matriculePersonnel: coordo.matriculePersonnel,
                    idPersonnel: coordo.idPersonnel,
                    classes: coordo.classes,
                    timetables: coordo.timetables.map(timetable=>{return{classe: timetable.classe, timetable: timetable.timetable}}),
                }})
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
                const modules = data.message.modules.map(module=>{return{
                    idClasse: module.idClasse,
                    idModule:module._id,
                    nomModule: module.nomModule,
                    codeModule: module.codeModule,
                    matieres: module.cours.map(cour=>{return{codeCours: cour.codeCours, poids: cour.poids}}),
                }})
                this.props.dispatch({type: "LOAD_CLASSE", payload: classes})
                this.props.dispatch({type: "LOAD_PERSONNEL", payload: users})
                this.props.dispatch({type: "LOAD_COUR", payload: cours})
                this.props.dispatch({type: "CREATE_COORDONATEUR", payload: coordos})
                this.props.dispatch({type: "LOAD_MODULE", payload: modules})
                this.props.dispatch({type: "CREATE_NOTE", payload: notes})
                this.setState({idPersonnel:parseJwt(window.localStorage.getItem('token')).user._id})
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
                <CoordoNav />
              <div className='publierNoteOverallHolder'>
                  {(!this.state.idPersonnel)?<div id="loading-on">Loading</div>:
                    <Hoc>
                        {this.displayClasseSelect()}
                        <div className="displayTheModules">
                            {this.displayClassModules()}
                        </div>
                    </Hoc>}
            </div>
        </div>
        )
    }
}

const mapStateToProps=(state)=>{
    return {
        modules: state.Module.modules,
        cours: state.Cour.cours,
        notes: state.Note.notes,
        classes: state.Classe.classes,
        coordonateurs: state.Coordonateur.coordonateurs,
        personnels: state.Personnel.personnels
    }
}

export default connect(mapStateToProps)(PublierNoteExamen)