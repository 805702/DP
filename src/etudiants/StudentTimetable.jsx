import React, { Component } from 'react'

import Hoc from '../shared/utils/hoc.js'
import parseJwt from '../shared/utils/parseJwt.js'

import './StudentTimetable.css'

import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import StudentNav from '../shared/UIElements/StudentNav.jsx'

class StudentTimetable extends Component {
    state={
        idEtudiant:null,
        activeTab:'timetable'
    }

    getStudentTimetable=()=>{
        let student = this.props.etudiants.find(etudiant=>etudiant.idEtudiant===this.state.idEtudiant)
        return this.props.timetables.find(timetable=>timetable.classe.idClasse === student.idClasse)
    }

    showTimetableHeader=()=>{
        if(this.getStudentTimetable()!==undefined){
            let studentHeader=this.getStudentTimetable().tableHeader
            let weekStart=new Date(studentHeader.weekStart).toDateString()

            return (
                <div className='studentTimeTableHeader'>
                    {weekStart} - {studentHeader.weekEnd}
                </div>
            )
        }else return null

    }

    showStudentTable=()=>{
        if(this.getStudentTimetable()!==undefined){
            let studentTable = this.getStudentTimetable().table
            let days=['mon', 'tue', 'wed', 'thur', 'fri', 'sat', 'sun']
            return studentTable.map(line=>(
                <div className='LineHolder' key={line.index}>
                    <div className="columnTime">
                        <span className='hmm'>
                            <h3>Debut: </h3><span id='fromTime'>{line.debut}</span>
                        </span>
                        <span className='hmm'>
                            <h3>Fin: </h3><span id='toTime'>{line.fin}</span>
                        </span>
                    </div>
                    {days.map(day=> {
                        let theLink =this.props.cours.map(cour=>{
                            if(cour.nomCours===line[day].cour.split('_')[0])return cour.idCour
                            else return 'none'
                        })
                        theLink = theLink.filter(link=>link!=='none')
                        theLink=theLink.filter(link=>link!==undefined)[0]
                        return line[day].cour.split('_')[0]===''?(
                        <div className='columnDay' key={line.index+day}>
                            <span className='day_cours' >{line[day].cour.split('_')[0]}</span>
                            <span className='day_cours' >{line[day].cour.split('_')[2]}</span>
                            <span className='day_cours' >{line[day].salle}</span>
                        </div>
                        ):(
                            <Link to={'/student/forum/'+theLink} className="columnDay" key={line.index+day}>
                                <span className='day_cours' >{line[day].cour.split('_')[0]}</span>
                                <span className='day_cours' >{line[day].cour.split('_')[2]}</span>
                                <span className='day_cours' >{line[day].salle}</span>
                            </Link>)
                        }
                    )}
                </div>
            ))
        }else return 
    }
    componentDidMount(){
  console.log('passing here')
        fetch('https://tranquil-thicket-81941.herokuapp.com/student/timetable', {
            method: 'get',
            headers: {'Content-Type': 'application/json','x-access-token':window.localStorage.getItem("token")}
          })
          .then(response=>response.json())
          .then(data=>{
            if(data.message){
              console.log(data.message)
                const student = data.message.student.map(student=>{return{
                    idEtudiant:student._id,
                    matriculePersonnel: student.matricule,
                    nom: student.nom,
                    prenom: student.prenom,
                    mail: student.email,
                    tel: student.tel,
                    role: student.role,
                    idClasse: student.idClasse
                }})
                const timetables = data.message.timetables.map(timetable=>{return{
                    idTimetable: timetable._id,
                    classe: timetable.classe,
                    tableHeader: timetable.tableHeader,
                    table: timetable.table,
                }})
                const cours = data.message.courses.map(cour=>{return{
                    idCour:cour._id,
                    classe: cour.classes,
                    nomCours: cour.nomCour,
                    codeCours: cour.codeCour,
                    nomEnseignant: cour.idEnseignant,
                }})
               this.props.dispatch({type: "LOAD_COUR", payload: cours})
               this.props.dispatch({type: "CREATE_ETUDIANT", payload: student})
               this.props.dispatch({type: "CREATE_TIMETABLE", payload: timetables})
               this.setState({idEtudiant:parseJwt(window.localStorage.getItem('token')).user._id})
            }
            else{
              console.log(data)
            }
          })
          .catch(error=>console.log(error))      
    }

    getStudentSubjects=()=>{
        console.log(this.props.cours)
        let cours = this.props.cours.map(cour=> 
                <Link to={'/student/forum/'+cour.idCour} className="aTeacherSubject">
                    <span>{cour.nomCours}</span>
                    <span className='gotoClass'>Ouvrer le cours</span>
                </Link>
            )

        return(
            <div className="theTeachersSubjects">
                <span className='theTeacherSubjectsHeader'>Vos matieres suivi</span>
                <div className="theTeacherSubjectsBody">
                    {cours}
                </div>
            </div>
        )
    }

    handleTabClick=(e)=>{
        document.getElementById(this.state.activeTab).classList.remove('activeTab')
        this.setState({activeTab:e.target.id},()=>{
            document.getElementById(this.state.activeTab).classList.add('activeTab')
        })
    }

    displayTab=()=>{
        return(
            <div className="timeTableTab">
                <span className='tabElement activeTab' id='timetable' onClick={this.handleTabClick}>Emploie</span>
                <span className='tabElement' id='subjects' onClick={this.handleTabClick}>Matiers</span>
            </div>
        )
    }

    render() {
        console.log(this.state)
        return (
            <div>
                <StudentNav />
                <div className='studentTimeTableOverall'>
                {(!this.state.idEtudiant)?
                    <div id="loading-on">Loading</div>
                :
                <Hoc>
                    {this.displayTab()}
                    {this.state.activeTab!=='timetable'?this.getStudentSubjects():this.getStudentTimetable()!==undefined?
                    (
                      <div>
                          {this.showTimetableHeader()}
                          <div className='LineHolder'>
                              <div className="columnTime th">
                              </div>
                              <div className="columnDay th">
                                  Lundi
                              </div>
                              <div className="columnDay th">
                                  Mardi
                              </div>
                              <div className="columnDay th">
                                  Mercredi
                              </div>
                              <div className="columnDay th">
                                  Jeudi
                                  </div>
                              <div className="columnDay th">
                                  Vendredi
                              </div>
                              <div className="columnDay th">
                                  Samedi
                              </div>
                              <div className="columnDay th">
                                  Dimanche
                              </div>
                          </div>
                          {this.showStudentTable()}
                      </div>  
                    ):<div>Pas d'emploie de temps disponible</div>}
                </Hoc>
                }
                </div>
            </div>
        )
    }
}

const mapStateToProps=(state)=>{
    return{
        timetables: state.Timetable.timetables,
        etudiants: state.Etudiant.etudiants,
        personnels: state.Personnel.personnels,
        cours: state.Cour.cours
    }
}

export default connect(mapStateToProps)(StudentTimetable)