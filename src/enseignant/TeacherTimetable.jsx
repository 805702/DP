import React, { Component } from 'react';
import { connect } from 'react-redux'

import Hoc from '../shared/utils/hoc.js'
import parseJwt from '../shared/utils/parseJwt.js'
import TeacherNav from '../shared/UIElements/TeacherNav'

import './TeacherTimetable.css'
import { Link } from 'react-router-dom';
import CoordoNav from '../shared/UIElements/CoordoNav.jsx';

class TeacherTimetable extends Component {
    state={
        /*
            Change this data with data from the local storage.
            what i mean by this is when the teacher connects himself, the token that comes with it should have th idPersonnel
            do something like componentDidMount(){this.setState(idConnectedPersonnel:localStorage.getItem(idPersonnel))}
            i don't know but sth like that.
        */
        idConnectedPersonnel:null,
        activeTab:'timetable'
    }

    getConnectedTeacher=()=>this.props.teachers.find(teacher=>teacher.idPersonnel===this.state.idConnectedPersonnel)
    getPersonnelObject=()=>this.props.personnels.find(personnel=>personnel.idPersonnel===this.state.idConnectedPersonnel)

    getToughtClassesTimetables=()=>{
      let tempObj=[] 
        let toughtClasses=this.getConnectedTeacher().toughtClasses
        // console.log('tought classes: ', toughtClasses)
        toughtClasses.forEach(classe=>{
            let tempClasse = this.props.timetable.find(timetable=>{
                return timetable.classe.idClasse === classe.idClasse
            })
            if(tempClasse){
                let tempClasseWeek = new Date(tempClasse.tableHeader.weekStart).toDateString()
                // console.log(this.getWeekMonday(tempClasseWeek))
                if(this.getWeekMonday(tempClasseWeek)===this.getMonday()) tempObj.push(tempClasse)
            }
        })
        return tempObj
    }

    getClassWeekSubjects=()=>{
        let timetables=this.getToughtClassesTimetables()
        let mappedTimetable = timetables.filter(timetable=>timetable!==undefined).map(timetable=>timetable.table.map(tableLine=>{
            let line=tableLine
            delete line.index
            delete line.debut
            delete line.fin
            return Object.keys(line).map(day=>line[day].cour+'-'+line[day].salle)
        }))

        let line=0;
        let hisTable =[]
        let personnelData=this.props.teachers[0]
        console.log(mappedTimetable,'mappedTimetable')
        mappedTimetable.map(aClassTable=>aClassTable.filter(aclassLine=>{
            let index = 0;
            line++
            aclassLine.map(elmt=>{
                console.log(personnelData.idPersonnel, elmt.split('_')[1])
               if(elmt.split('_')[1]===personnelData.idPersonnel){
                   let classIndex=0
                   let theLine=0
                   classIndex=Math.ceil(line/2)
                   theLine = line%2===0?2:1
                   let toughtClasses = this.getConnectedTeacher().toughtClasses
                   let subject = elmt.split('_')[0]
                   let salle = elmt.split('-')[1]
                   ++index
                   let day=0
                   let idCour = this.props.cours.find(cour=>{
                       return cour.nomCours===elmt.split('_')[0] && cour.nomEnseignant===personnelData.idPersonnel
                    }).idCour
                   switch(index){
                       case 1:
                           day='mon'
                           break
                       case 2:
                           day='tue'
                           break
                       case 3:
                           day='wed'
                           break
                       case 4:
                           day='thur'
                           break
                       case 5:
                           day='fri'
                           break
                       case 6:
                           day='sat'
                           break
                       case 7:
                           day='sun'
                           break
                        default:
                            break
                   }
                   hisTable.push(toughtClasses[classIndex-1].nomClasse+'_'+theLine+'_'+day+'_'+subject+'_'+salle+'_'+idCour)
               }else ++index
               return null
            })
            return null
        }))
        // console.log(hisTable,"hisTable")
        return hisTable
        /*
            output: ["IRT 3_1_mon_IDE_B03_0012", "IRT 3_1_tue_IDE__0012", "IRT 3_2_mon_IDE__0012", "IRT 2_2_thur_IDE__0012"]

            meaning: className_lineNumber_day_subject_salle_idCour
        */
    }

    generateTeacherTimetable=()=>{
        let representativeTable= this.getClassWeekSubjects()
        let table=[
            {index:1, debut:'08:00', fin:'12:00', mon:{classe:'', cour:'', salle:'', idCour:''}, tue:{classe:'', cour:'', salle:'', idCour:''}, wed:{classe:'', cour:'', salle:'', idCour:''}, thur:{classe:'', cour:'', salle:'', idCour:''}, fri:{classe:'', cour:'', salle:'', idCour:''}, sat:{classe:'', cour:'', salle:'', idCour:''}, sun:{classe:'', cour:'', salle:'', idCour:''}},
            {index:2, debut:'13:00', fin:'17:00', mon:{classe:'', cour:'', salle:'', idCour:''}, tue:{classe:'', cour:'', salle:'', idCour:''}, wed:{classe:'', cour:'', salle:'', idCour:''}, thur:{classe:'', cour:'', salle:'', idCour:''}, fri:{classe:'', cour:'', salle:'', idCour:''}, sat:{classe:'', cour:'', salle:'', idCour:''}, sun:{classe:'', cour:'', salle:'', idCour:''}}
        ]

        representativeTable.map(weekSubject=>{
            let length = weekSubject.split('_').length
            let lineIndex = Number(weekSubject.split('_')[1])-1
            let day = weekSubject.split('_')[2]
            table[lineIndex][day].classe=weekSubject.split('_')[0]
            table[lineIndex][day].cour=weekSubject.split('_')[3]
            table[lineIndex][day].salle=weekSubject.split('_')[4]
            table[lineIndex][day].idCour=weekSubject.split('_')[length-1]
            return null
        })
        return table
    }

    getMonday=()=>{
        let today=new Date();
        if(today.getDay()!==1){
            today.setHours(-24*(today.getDay()-1))
            return today.toDateString()
        }else return today.toDateString()
    }

    getWeekMonday=(date)=>{
        let theDate=new Date(date)
        if(theDate.getDay()!==1){
            theDate.setHours(-24*(theDate.getDay()-1))
            return theDate.toDateString()
        }else return theDate.toDateString()
    }

    getSunday=()=>{
        let monday=new Date(this.getMonday())
        monday.setDate(monday.getDate()+6)
        return new Date(monday).toDateString()
    }

    showTeacherTable=()=>{
        let teacherTable = this.generateTeacherTimetable()
        let days=['mon', 'tue', 'wed', 'thur', 'fri', 'sat', 'sun']
        return teacherTable.map(line=>(
        <div className='LineHolder' key={line.index}>
            <div className="columnTime">
                <span className='hmm'>
                    <h3>Debut: </h3><span id='fromTime'>{line.debut}</span>
                </span>
                <span>
                    <h3>Fin: </h3><span id='toTime'>{line.fin}</span>
                </span>
            </div>
            {days.map(day=> {
                return line[day].cour.split('_')[0]===''?(
                <div className='columnDay' key={line.index+day}>
                    <span className='day_cours' >{line[day].cour.split('_')[0]}</span>
                    <span className='day_cours' >{line[day].classe}</span>
                    <span className='day_cours' >{line[day].salle}</span>
                </div>
                ):(
                    <Link to={'/teacher/forum/'+line[day].idCour} className="columnDay" key={line.index+day}>
                        <span className='day_cours' >{line[day].cour.split('_')[0]}</span>
                        <span className='day_cours' >{line[day].classe}</span>
                        <span className='day_cours' >{line[day].salle}</span>
                    </Link>)}
            )}
        </div>
        ))
    }
 componentDidMount(){
//   console.log('Mounted')
        fetch('https://tranquil-thicket-81941.herokuapp.com/teacher/timetable', {
            method: 'get',
            headers: {'Content-Type': 'application/json','x-access-token':window.localStorage.getItem("token")}
          })
          .then(response=>response.json())
          .then(data=>{
            if(data.message){
              console.log(data.message)
                const teacher = data.message.teacher.map(teacher=>{return{
                    idPersonnel:teacher._id,
                    matriculePersonnel: teacher.matricule,
                    nom: teacher.nom,
                    prenom: teacher.prenom,
                    mail: teacher.email,
                    tel: teacher.tel,
                    role: teacher.role,
                    toughtClasses: teacher.taughtClasses
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
                this.props.dispatch({type: "CREATE_TEACHER", payload: teacher})
                this.props.dispatch({type: "CREATE_TIMETABLE", payload: timetables})
                this.setState({idConnectedPersonnel:parseJwt(window.localStorage.getItem('token')).user._id})
            }
            else{
              console.log(data)
            }
          })
          .catch(error=>console.log(error))      
    }

    getTeacherSubjects=()=>{
        let cours = this.props.cours.filter(cour=>cour.nomEnseignant===this.state.idConnectedPersonnel)
        cours = cours.map(cour=> 
                <Link to={'/teacher/forum/'+cour.idCour} key={cour.idCour} className="aTeacherSubject">
                    <span>{cour.nomCours}</span>
                    <span className='gotoClass'>Ouvrer le cours</span>
                </Link>
            )

        return(
            <div className="theTeachersSubjects">
                <span className='theTeacherSubjectsHeader'>Vos matieres enseigne</span>
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
    //    console.log(this.props,this.state)
        return (
            <div>
                {parseJwt(window.localStorage.getItem('token')).user.role==='coordonateur'?<CoordoNav />:<TeacherNav />}
                <div className='studentTimeTableOverall'>
                {(!this.state.idConnectedPersonnel)?
                    <div id="loading-on">Loading</div>
                :
                <Hoc>
                    {this.displayTab()}
                    {this.state.activeTab!=='timetable'?this.getTeacherSubjects():
                    (
                        <div>
                            <div className='weekDate'>
                                <span>Semaine allant de: {this.getMonday()} - {this.getSunday()}</span>
                            </div>
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
                            {this.showTeacherTable()}
                        </div>
                    )
                }</Hoc>
                }
                </div>
            </div>
        )
  }
}

const mapStateToProps=(state)=>{
    return{
        teachers: state.Teacher.teachers,
        personnels: state.Personnel.personnels,
        timetable: state.Timetable.timetables,
        cours: state.Cour.cours
    }
}

export default connect(mapStateToProps)(TeacherTimetable)