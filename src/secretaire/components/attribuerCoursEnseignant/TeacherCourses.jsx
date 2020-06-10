import React, { Component } from 'react'

import './TeacherCourses.css'
import { connect } from 'react-redux'
import SecretaireNav from '../../../shared/UIElements/SecretaireNav'
import Spinner from '../../../shared/alerts/Spinner';
import BadAlert from '../../../shared/alerts/BadAlert';
import GoodAlert from '../../../shared/alerts/GoodAlert';
import JustAlert from '../../../shared/alerts/JustAlert';


class TeacherCourses extends Component {
    state={
        actualClasse:'',
        actualFiliere:'',
        actualSubject:'',
        actualTeacher:'',
        theFiliere:'',
        theClasse:'',
        theModule:'',
    }

    getTeachers=()=>{
        let teachers=this.props.personnels.filter(personnel=>personnel.role==='enseignant' || personnel.role==='coordonateur')
        return teachers.map(teacher=><option key={teacher.matricule} value={teacher.idPersonnel}>{teacher.nom+' '+teacher.prenom}</option>)
    }

    handleChange=(e)=>{
        switch(e.target.id){
            case 'actualFiliere':
                this.setState({actualClasse:'', actualSubject:''})
                break
            case 'actualClasse':
                this.setState({actualSubject:''})
                break
            default:
                break
        }
        this.setState({[e.target.id]:e.target.value})
    }

    handleClick=()=>{
        if(this.state.actualSubject!=='' && this.state.actualTeacher!==''){
            /*
                this is where you take care of the update...
                you are to update classe with the cours with codeCours: this.state.actualSubject
                The new teacher to be assigned to this cours is : this.state.actualTeacher
            */
            let teacherId = this.state.actualTeacher;
            let codeCour = this.state.actualSubject.split(" ")[0];
            this.setState({spin:true, spinMessage:"Nous changeons l'enseignant"})
              fetch(`https://tranquil-thicket-81941.herokuapp.com/coordo/teacher-courses/update-cour`, {
                         method: 'put',
                         headers: {'Content-Type': 'application/json','x-access-token':window.localStorage.getItem("token")},
                         body: JSON.stringify({
                            codeCour,
                            teacherId
                        })
                    })
                .then(response=>response.json())
                .then(data=>{
                    if(data.message){
                        this.props.dispatch({type: "UPDATE_A_COUR",payload:{codeCour,teacherId}})
                        this.setState({
                            spin:false,
                            alertCounter:0,
                            spinMessage:"Operation reussi",
                            gAlert:'good',
                        })
                        // alert("You've changed the teacher of the subject with subject code: "+this.state.actualSubject+' to: '+this.state.actualTeacher)
                        this.setState({actualSubject:''})
                    }else{
                        this.setState({
                            spin:false,
                            alertCounter:0,
                            spinMessage:"Nous n'avons pas pu changer l'enseignant",
                            gAlert:'bad',
                        })
                        console.log(data)
                    }
                })
                .catch(error=>{
                    this.setState({
                        spin:false,
                        alertCounter:0,
                        spinMessage:"INTERNAL SERVER ERROR",
                        gAlert:'just',
                    })
                    console.log(error)
                })
        }else {
            this.setState({
                spin:false,
                alertCounter:0,
                spinMessage:"Choissisez une classe, cours puis l'enseignant de ce cours",
                gAlert:'just',
            })
            // alert('Choose a classe, then subject then assign a teacher to that subject')
        }
    }

    displayMiddlePart=()=>{
        return (
            <div className='attribuerCours'>
                <select className='attribuerCoursFaculty' id='actualFiliere' onChange={this.handleChange}>
                    <option hidden>Choisissez la filiere</option>
                    {this.getFilieres()}
                </select>
                <select className="attribuerCoursSelect" id='actualClasse' onChange={this.handleChange}>
                    <option hidden>Choisissez la classe</option>
                    {this.getFiliereClasses(this.state.actualFiliere).map(classe=><option key={classe.filiere.nomFiliere+classe.niveau} value={classe.idClasse}>{classe.filiere.nomFiliere+' '+classe.niveau}</option>)}
                </select>
                <select className='attribuerCoursSelect' id='actualSubject' onChange={this.handleChange}>
                    <option hidden>Choisissez le cours</option>
                    {this.getClasseCourses(this.state.actualClasse).map(course=><option key={course.codeCours}>{course.codeCours+' '+course.nomCours}</option>)}
                </select>
                <select className='attribuerCoursSelect' id='actualTeacher' onChange={this.handleChange}>
                    <option hidden>Choisissez l'enseignant</option>
                    {this.getTeachers()}
                </select>
                <input type='button' value='Attribuer' onClick={this.handleClick} />
            </div>
        )
    }

    handleSelectChange=(e)=>{
        switch(e.target.id){
            case 'theFiliere':
                this.setState({theClasse:'', theModule:''})
                break
            case 'theClasse':
                this.setState({theModule:''})
                break
            default:
                break
        }
        this.setState({[e.target.id]:e.target.value})
    }

    displayBottomHeader=()=>{
        return(
            <div className='teacherCourseBottomSelects'>
                <select className="TeacherCourseBottomSelect" id='theFiliere' onChange={this.handleSelectChange}>
                    <option hidden>Choisissez la filiere</option>
                    {this.getFilieres()}
                </select>
                <select name="teacherCourseBottomSelect" id="theClasse" onChange={this.handleSelectChange}>
                    <option hidden>Choisissez la classe</option>
                    {this.getFiliereClasses(this.state.theFiliere).map(classe=><option key={classe.filiere.nomFiliere+' '+classe.niveau} value={classe.idClasse}>{classe.filiere.nomFiliere+' '+classe.niveau}</option>)}
                </select>
                <select className="teacherCourseBottomSelect" id="theModule" onChange={this.handleSelectChange}>
                    <option hidden>Choisissez un module</option>
                    {this.getClasseModules(this.state.theClasse).map(module=><option key={module.codeModule}>{module.codeModule+' '+module.nomModule}</option>)}
                </select>
            </div>
        )
    }

    getFiliereClasses=(nomFiliere)=>{
        let filiereClasses =this.props.classes.filter(classe=>classe.filiere.nomFiliere===nomFiliere)
        return filiereClasses.sort((a,b)=>(a.niveau>b.niveau)?1:-1)
    }

    getClasseModules=(idClasse)=>{
        console.log(idClasse)
        let classModules=this.props.modules.filter(module=>module.idClasse===idClasse)
        return classModules.sort((a,b)=>(a.nomModule>b.nomModule)?1:-1)
    }

    getModuleCourses=(codeModule)=>{
        let theModule=this.props.modules.find(module=>module.codeModule===codeModule)
        if(theModule!==undefined){
            let moduleSubjects = theModule.matieres.map(matiere=>{
                let coursData = this.props.cours.find(cour=>cour.codeCours===matiere.codeCours)
                let poids = matiere.poids
                return {...coursData, poids}
            })
    
            return moduleSubjects.sort((a,b)=>(a.poids<b.poids)?1:-1)
        }return []
    }

    getClasseCourses=(nomClasse)=>{
        let classeCourses = this.props.cours.filter(cour=>cour.classe.includes(nomClasse))
        return classeCourses.sort((a,b)=>(a.nomCours>b.nomCours)?1:-1)
    }

    getFilieres=()=>{
       let faculties= this.props.faculties.sort((a,b)=>(a.nomFaculte>b.nomFaculte)?1:-1)
       return faculties.map(faculty=>{
            let filieres = faculty.filieres.sort((a,b)=>(a.nomFiliere>b.nomFiliere)?1:-1)
           return (
            <optgroup label={faculty.nomFaculte} key={faculty.nomFaculte}>
                {filieres.map(filiere=><option key={filiere.nomFiliere}>{filiere.nomFiliere}</option>)}
            </optgroup>
           )
       })
    }

    displayBottomPart=()=>{
        let key=0
        return <div className='teacherCourseBottomDisplay'>
            {this.displayBottomHeader()}
            <div className='teacherCourseModuleData'>
                <div className='teacherCourseModuleName'>{this.state.theModule}</div>
                <Spinner spin={this.state.spin} message={this.state.spinMessage}/>
                {this.state.gAlert?<BadAlert message={this.state.spinMessage} alertCounter={this.state.alertCounter} setCounter={this.setAlertCounter} gAlertSetter={this.setGAlertFalse} spin={this.state.gAlert} message={this.state.spinMessage} />:null}
                {this.state.gAlert?<GoodAlert message={this.state.spinMessage} alertCounter={this.state.alertCounter} setCounter={this.setAlertCounter} gAlertSetter={this.setGAlertFalse} spin={this.state.gAlert} message={this.state.spinMessage} />:null}
                {this.state.gAlert?<JustAlert message={this.state.spinMessage} alertCounter={this.state.alertCounter} setCounter={this.setAlertCounter} gAlertSetter={this.setGAlertFalse} spin={this.state.gAlert} message={this.state.spinMessage} />:null}
                <div className="teacherCourseModuleCourseHeader">
                    <span className='moduleCourseHeaderData'>No</span>
                    <span className='moduleCourseHeaderData'>Code matiere</span>
                    <span className='moduleCourseHeaderData'>Intitule du Cours</span>
                    <span className='moduleCourseHeaderData'>Poids du cours</span>
                    <span className='moduleCourseHeaderData'>Classe commune</span>
                    <span className='moduleCourseHeaderData'>Enseignant</span>
                </div>
                {
                    this.getModuleCourses(this.state.theModule.split(' ')[0]).map(course=>(
                        <div className="teacherCourseModuleCourse" key={++key}>
                            <span className="teacherModuleCourseData">{key+'\n'}</span>
                            <span className='teacherModuleCourseData'>{course.codeCours}</span>
                            <span className='teacherModuleCourseData'>{course.nomCours}</span>
                            <span className='teacherModuleCourseData'>{course.poids}</span>
                            <div className='teacherModuleCourseData otherClasses'>
                                {
                                    course.classe.filter(classe=>classe!==this.state.theClasse).map(otherClasse=><span key={otherClasse} className='otherClasseData'>{otherClasse}</span>)
                                }
                            </div>
                            <span className='teacherModuleCourseData'>{
                                (function(perso){
                                    let personnel=perso.find(personnel=>personnel.idPersonnel===course.nomEnseignant);
                                    if(!personnel)return "enseignant not found"; 
                                    return personnel.nom +" "+ personnel.prenom
                                })(this.props.personnels)
                            }</span>
                        </div>
                    ))
                }
            </div>
        </div>
    }
    
    setGAlertFalse=()=>{
        this.setState({gAlert:false})
    }
  
    setAlertCounter=()=>{
        this.setState({alertCounter:this.state.alertCounter+1})
    }

    componentDidMount(){
        console.log(this.props)
       fetch('https://tranquil-thicket-81941.herokuapp.com/coordo/teacher-courses/users-courses-modules-faculties-classes', {
            method: 'get',
            headers: {'Content-Type': 'application/json','x-access-token':window.localStorage.getItem("token")}
          })
          .then(response=>response.json())
          .then(data=>{
            if(data.message){
                const users = data.message.users.map(user=>{return{
                    idPersonnel:user._id,
                    matricule: user.matricule,
                    nom: user.nom,
                    prenom: user.prenom,
                    mail: user.email,
                    tel: user.tel,
                    role: user.role
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
                const Facultx = data.message.faculties.map((faculty,j)=>{
                    return{
                    nomFaculte: faculty.nomFaculty,
                    filieres: faculty.filieres.map((filiere,i)=>{
                        return {
                         nomFiliere: filiere.nomFiliere, 
                         niveauMax: filiere.maxNiveau, 
                         index: i+1,
                         _id: filiere._id
                        }
                    }), 
                    index: j+1,
                    _id: faculty._id
                  }
                })
                const cours = data.message.courses.map(cour=>{return{
                    idCour:cour._id,
                    classe: cour.classes,
                    nomCours: cour.nomCour,
                    codeCours: cour.codeCour,
                    nomEnseignant: cour.idEnseignant,
                }})
                const modules = data.message.modules.map(module=>{return{
                    idClasse: module.idClasse,
                    idModule:module._id,
                    nomModule: module.nomModule,
                    codeModule: module.codeModule,
                    matieres: module.cours.map(cour=>{return{codeCours: cour.codeCours, poids: cour.poids}}),
                }})
                this.props.dispatch({type: "LOAD_COUR", payload: cours})
                this.props.dispatch({type: "LOAD_MODULE", payload: modules})
                this.props.dispatch({type: "LOAD_PERSONNEL", payload: users})
                this.props.dispatch({type: "LOAD_CLASSE", payload: classes})
                this.props.dispatch({type: "CREATE_FACULTY", payload: Facultx})
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
                <SecretaireNav />
                <div className="TitleSettingPage">ATTRIBUTION DE COURS</div>
                {this.displayMiddlePart()}
                {this.displayBottomPart()}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        personnels: state.Personnel.personnels,
        faculties: state.Faculty.faculties,
        roles: state.Role.roles,
        classes: state.Classe.classes,
        cours: state.Cour.cours,
        modules: state.Module.modules
    }
}

export default connect(mapStateToProps)(TeacherCourses)