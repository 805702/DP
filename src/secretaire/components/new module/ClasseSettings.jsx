import React, { Component } from 'react';
import { connect }  from 'react-redux'
import Spinner from '../../../shared/alerts/Spinner';
import BadAlert from '../../../shared/alerts/BadAlert';
import GoodAlert from '../../../shared/alerts/GoodAlert';
import JustAlert from '../../../shared/alerts/JustAlert';


import './ClasseSettigns.css'


class ClasseSettings extends Component {
    state={
        //working data
        filiere:'',
        classe:'',
        nomNewMatiere:'',
        codeNewMatiere:'',
        poidsNewMatiere:'',
        teacherNewMatiere:'',
        nomNewModule:'',
        codeNewModule:'',
        creditNewModule:'',
        newMatieres:[],
        matiereEdit:'',
        edit:'',
        nouveauModule:false,
        open:'',
    }

    TeachersOnly=()=>{
        let Teachers = this.props.personnels.filter(personnel=>personnel.role==='enseignant' || personnel.role==='coordonateur')
        return Teachers
    }

    FacultyOptions=()=>{
        return this.props.facultes.map(faculte=>(
            <optgroup key={faculte.nomFaculte} label={faculte.nomFaculte}>
                {faculte.filieres.map(filiere=>(
                    <option key={filiere.nomFiliere} value={filiere._id}>{filiere.nomFiliere}</option>
                ))}
            </optgroup>
        ))
    }

    showFiliereClass=()=>{
        let requiredClasses = this.props.classes.filter(classe=>classe.filiere.idFiliere === this.state.filiere)
        console.log(this.state.filiere)
        
        return requiredClasses.map(classe=>
        <option key={classe.filiere.nomFiliere+' '+classe.niveau} value={classe.idClasse}>
            {classe.filiere.nomFiliere+' '+classe.niveau}
        </option>
        )
    }

    handleDelete=(e)=>{
        let element = e.target.id
        let newList = this.state.newMatieres.filter(matiere=>Number(element) !== matiere.index)
        newList = this.adjustIndex(newList)
        this.setState({newMatieres:newList})
    }

    adjustIndex = (listArray) => {
        let index = 0;
        let tempQuestions = []
        listArray.map(matiere => {
            index = index + 1
            matiere.index = index
            tempQuestions.push(matiere)
            return null;
        })

        return tempQuestions;
    }
    
    handleEditBtn =(e)=>{
        let element = this.state.newMatieres.find(matiere=>matiere.index === Number(e.target.id))
        this.setState({
            matiereEdit:element,
            edit:e.target.id,
        })
    }
    
    handleEditChange=(e)=>{
		let editMatiere = {nomMatiere:this.state.matiereEdit.nomMatiere, codeMatiere:this.state.matiereEdit.codeMatiere,  poidsMatiere:this.state.matiereEdit.poidsMatiere, index:this.state.matiereEdit.index}
		switch(e.target.id){
			case 'nomMatiere':
				editMatiere.nomMatiere=e.target.value
				break
			case 'codeMatiere':
				editMatiere.codeMatiere=e.target.value
				break
			case 'poidsMatiere':
				editMatiere.poidsMatiere=e.target.value
                break
            default:
                break
		}
        this.setState({matiereEdit:editMatiere})
    }

	handleEditSave =()=>{
        let newMatieres = []
        this.state.newMatieres.filter(matiere=>{
            if(matiere.index === this.state.matiereEdit.index) newMatieres.push(this.state.matiereEdit)
            else newMatieres.push(matiere)
            return null
        })
        this.setState({newMatieres:newMatieres, edit:''})

    }
    
    changeToAngleDown=(elementID)=>{
		let elementClasslist=document.getElementById(elementID).classList
		elementClasslist.remove('fa-angle-up')
		elementClasslist.add('fa-angle-down')			
		this.setState({open:''})
	}

    handleOpenModule=(codeModule)=>{
        let elementClasslist=document.getElementById(codeModule).classList
		if(elementClasslist.contains('fa-angle-down')){
			if(this.state.open!==''){this.changeToAngleDown(this.state.open)}
			elementClasslist.remove('fa-angle-down')
			elementClasslist.add('fa-angle-up')
			this.setState({open:codeModule})
		}else{
			elementClasslist.remove('fa-angle-up')
			elementClasslist.add('fa-angle-down')			
			this.setState({open:''})
		}
    }

    getFiliereModules=()=>{
        let theModules=this.props.modules.filter(module=>module.idClasse===this.state.classe)
        return theModules.map(module=>{
            return <div className="ModuleData" key={module.codeModule}>
                <div className="moduleDataHeader" onClick={()=>this.handleOpenModule(module.codeModule)} >
                    <span className='moduleCodeName'>{module.codeModule+' '+module.nomModule}</span>
                    <i className='fa fa-angle-down' id={module.codeModule} />
                </div>
                {
                    this.state.open===module.codeModule?this.moduleSubjects(module.matieres):null
                }
            </div>
        })
    }

    moduleSubjects=(subjectList)=>{
        let subjects=[]
        let index=0
        subjectList.map(subject=>{
            subjects.push({index:++index, poidsMatiere:subject.poids, subject:this.props.cours.find(cour=>cour.codeCours===subject.codeCours)})
            return null
        })

        return subjects.map(subject=>{
            let teacher = subject.subject!==undefined?this.props.personnels.find(personnel=>personnel.idPersonnel===subject.subject.nomEnseignant):undefined
            teacher = teacher!==undefined? teacher.nom+' '+teacher.prenom:'Aucun enseignant pour ce cours'
            return <div className="moduleSubject" key={subject.subject.nomCours}>
                <span className=''>{subject.index}</span>
                <span className=''>{subject.subject.nomCours}</span>
                <span className=''>{subject.subject.codeCours}</span>
                <span className=''>{subject.poidsMatiere}</span>
                <span className=''>{teacher}</span>
            </div>
        })
    }

    handleChange=(e)=>{
        this.setState({[e.target.id]:e.target.value})
    }

    handleAjouterClick=(e)=>{
        e.preventDefault()
        if(this.state.nomNewMatiere!=='' && this.state.codeNewMatiere!=='' && this.state.poidsNewMatiere!=='' && this.state.teacherNewMatiere!==''){
            let newSubject={index:this.state.newMatieres.length+1, nomMatiere:this.state.nomNewMatiere, codeMatiere:this.state.codeNewMatiere, poidsMatiere:this.state.poidsNewMatiere, nomEnseignant:this.state.teacherNewMatiere, classe:this.state.classe}

            let totalPoids =0
            this.state.newMatieres.map(matiere=>totalPoids=totalPoids+Number(matiere.poidsMatiere))
            let alertVariable =this.state.newMatieres.find(matiere=>matiere.codeMatiere===newSubject.codeMatiere)
            if(alertVariable===undefined){
                if(totalPoids+Number(newSubject.poidsMatiere)<=1){
                    let newSubjects =[...this.state.newMatieres, newSubject]
                    this.setState({newMatieres:newSubjects},()=>this.resetSubject())
                }else alert('La somme totale des poids ne doit pas être supérieure à 1. Ajustez les pondérations pour faire leur somme totale 1 et réessayez \n \nVous êtes en excès de '+(totalPoids+Number(newSubject.poidsMatiere)-1))
            }else alert('Un sujet avec ce code sujet est déjà pris. vérifier et réessayer')
        }else alert('Remplissez tous les champs de la nouvelle classe avant de cliquer sur ajouter')
    }

    teacherOptions=()=>{
        let teacherList=this.TeachersOnly()
        return teacherList.map(teacher=><option key={teacher.matricule} value={teacher.idPersonnel}>{teacher.nom+' '+teacher.prenom}</option>)
    }

    addedNewMatieres =()=>{
        return this.state.newMatieres.map(matiere=>(
            Number(this.state.edit)===matiere.index?(
                <div className="toBeAddedSubject" key={matiere.codeMatiere}>
                    <span>{matiere.index}</span>
                    <input type='text' value={this.state.matiereEdit.nomMatiere}  className='editInput' id='nomMatiere' onChange={this.handleEditChange} />
                    <input type='text' value={this.state.matiereEdit.codeMatiere}  className='editInput' id='codeMatiere' onChange={this.handleEditChange} />
                    <input type='number' min={0.1} max={1} step={0.1} value={Number(this.state.matiereEdit.poidsMatiere)}  className='editInput' id='poidsMatiere' onChange={this.handleEditChange} />
                    <input type='button' value='Save' className='newSubjectActionBtn1' id={matiere.index} onClick={this.handleEditSave}/>
                    <input type='button' value='Delete' className='newSubjectActionBtn' id={matiere.index} onClick={this.handleDelete}/>
                </div>
            ):(
            <div className="toBeAddedSubject" key={matiere.codeMatiere}>
                <span>{matiere.index}</span>
                <span>{matiere.nomMatiere}</span>
                <span>{matiere.codeMatiere}</span>
                <span>{matiere.poidsMatiere}</span>
                <input type='button' value='Edit' className='newSubjectActionBtn1' id={matiere.index} onClick={this.handleEditBtn}/>
                <input type='button' value='Delete' className='newSubjectActionBtn' id={matiere.index} onClick={this.handleDelete}/>
            </div>)
        ))
    }

    resetSubject=()=>{
        this.setState({codeNewMatiere:'', teacherNewMatiere:'', poidsNewMatiere:'', nomNewMatiere:''})
    }

    openNewSubject=()=>{
        this.resetSubject()
        let element=document.getElementById('subjectHeaderIcon').classList
        if(element.contains('fa-plus-circle')){
            element.remove('fa-plus-circle')
            element.add('fa-minus-circle')
            this.setState({newSubject:true})
        }else{
            element.remove('fa-minus-circle')
            element.add('fa-plus-circle')
            this.setState({newSubject:false, edit:''})
        }
    }

    newSubject=()=>{
        return (
            <div className="newSubject">
                <div className="toBeAddedSubjects">
                    {this.addedNewMatieres()}
                </div>
                <div className="newSubjectHeader" onClick={this.openNewSubject}>
                    <i className='fa fa-plus-circle' id='subjectHeaderIcon' />
                    <span className='newSubjectName'>Nouvelle matiere</span>
                </div>
                {this.state.newSubject?<div className="newSubjectsInputs">
                    <input type='text' value={this.state.nomNewMatiere} placeholder='Nom matiere' id='nomNewMatiere' onChange={this.handleChange} />
                    <input type='text' value={this.state.codeNewMatiere} placeholder='Code' id='codeNewMatiere' onChange={this.handleChange} />
                    <input type='number' value={this.state.poidsNewMatiere} placeholder='poids' id='poidsNewMatiere' onChange={this.handleChange} min={0.1} max={1} step={0.1} />
                    <select className='chooseSubjectTeacher' value={this.state.teacherNewMatiere} id='teacherNewMatiere' onChange={this.handleChange} >
                        <option value='' hidden>Enseignant</option>
                        {this.teacherOptions()}
                    </select>
                    <input type='submit' value='Ajouter' onClick={this.handleAjouterClick} />
                </div>:null
                }
            </div>
        )
    }

    resetModule=()=>{
        this.setState({
            nomNewMatiere:'', nomNewModule:'', codeNewModule:'', creditNewModule:'', codeNewMatiere:'', poidsNewMatiere:'', teacherNewMatiere:'', newMatieres:[], matiereEdit:'', edit:'', newSubject:false
        })        
    }

    openNewModule=()=>{
        let element = document.getElementById('moduleHeaderIcon').classList
        this.resetModule()
        if(element.contains('fa-plus-circle')){
            element.remove('fa-plus-circle')
            element.add('fa-minus-circle')
            this.setState({nouveauModule:true})
        }else{
            element.remove('fa-minus-circle')
            element.add('fa-plus-circle')
            this.setState({nouveauModule:false})
        }
    }

    handleCreerClick=()=>{

        if(this.state.nomNewModule!=='' && this.state.codeNewModule!=='' && this.state.creditNewModule!=='' && this.state.newMatieres.length!==0){
            let newSubjects= []
            let totalPoids =0
            this.state.newMatieres.map(matiere=>{
                totalPoids+=Number(matiere.poidsMatiere)
                let subject={codeCours:matiere.codeMatiere, poids:matiere.poidsMatiere}
                newSubjects.push(subject)
                return null
            })
            console.log(totalPoids)
            if(totalPoids>=1){
                //add ID to the newModule object before upload or what do you think we should just use the codeCours as the id?? answer me on whatsapp when you see this comment
                let newModule = {
                    nomModule:this.state.nomNewModule, 
                    codeModule  :this.state.codeNewModule, 
                    idClasse:this.state.classe, 
                    credit:this.state.creditNewModule, 
                    cours:newSubjects,
                    startDate: Date.now()
                }
                console.log(newModule)

                //prepare cours Array of objects
                let newMatieres= []
                this.state.newMatieres.map(matiere=>{
                    // delete matiere.poidsMatiere
                    newMatieres.push(matiere)
                    return null
                })
                //get list of subjects to create
                //every object of the created array should be added an idCours property or what do you think we should just use the codeCours as the id?? answer me on whatsapp when you see this comment
                /*
                    every object of the update array are the subjects to be updated in the back end.
                    submitted in the format {codeCours, classe}
                    you'll write the function that will take a code cours and look for it in the backend
                    then when you have found the cours in question, you'll add classe to its classes array
                */
                let update=[]
                let created=[]
                newMatieres.filter(newSubject=>{
                    if(this.props.cours.find(cour=>cour.codeCours===newSubject.codeMatiere) === undefined){
                        let object={
                            nomCour:newSubject.nomMatiere, 
                            codeCour:newSubject.codeMatiere, 
                            idEnseignant:newSubject.nomEnseignant, 
                            poids: newSubject.poidsMatiere, 
                            classes:[newSubject.classe], 
                            startDate: Date.now()
                        }
                        created.push(object)
                        return null
                    }else{
                        let theObject={codeCours:newSubject.codeMatiere, classe:newSubject.classe}
                        update.push(theObject)
                        return null
                    }
                })
                console.log(update)
                if(update.length>0){
                    this.setState({spin:true, spinMessage:"Nous creeons les cours"})
                    fetch('https://dp-dbv2.herokuapp.com/classe/module/cour/update', {
                    method: 'post',
                    headers: {'Content-Type': 'application/json','x-access-token':window.localStorage.getItem("token")},
                    body: JSON.stringify({
                      cours: update
                    })
                  })
                  .then(response=>response.json())
                  .then(data=>{
                    if(data.message){
                        const cours = data.message.map(cour=>{return{
                            idCour:cour._id,
                            classe: cour.classes,
                            nomCours: cour.nomCour,
                            codeCours: cour.codeCour,
                            nomEnseignant: cour.idEnseignant,
                        }})
                        this.props.dispatch({type: "UPDATE_COUR", payload: cours})
                        // this.setState({
                        //     spin:false,
                        //     alertCounter:0,
                        //     spinMessage:"Module cree avec success",
                        //     gAlert:'good',
                        // })

                    }
                    else{
                      console.log(data)
                    //   this.setState({
                    //         spin:false,
                    //         alertCounter:0,
                    //         spinMessage:"Echec de creation de module",
                    //         gAlert:'bad',
                    //     })
                    }
                  })
                  .catch(error=>{
                    // this.setState({
                    //     spin:false,
                    //     alertCounter:0,
                    //     spinMessage:"INTERNAL SERVER ERROR",
                    //     gAlert:'just',
                    // })
                      console.log(error)
                    })
                  }      
                if(created.length>0){
                    fetch('https://dp-dbv2.herokuapp.com/classe/module/new', {
                        method: 'post',
                        headers: {'Content-Type': 'application/json','x-access-token':window.localStorage.getItem("token")},
                        body: JSON.stringify({
                          newModule,
                          coursArray: created
                        })
                      })
                      .then(response=>response.json())
                      .then(data=>{
                        if(data.message){
                            console.log(data.message)
                            let module = data.message[0].module;
                            module = [module];

                            const modules = module.map(module=>{return{
                                idClasse: module.idClasse,
                                idModule:module._id,
                                nomModule: module.nomModule,
                                codeModule: module.codeModule,
                                matieres: module.cours.map(cour=>{return{codeCours: cour.codeCours, poids: cour.poids}}),
                            }})
                            this.props.dispatch({type: "CREATE_MODULE", payload: {...modules[0]}})
                            const cours = data.message.slice(1).map(cour=>{return{
                                idCour:cour._id,
                                classe: cour.classes,
                                nomCours: cour.nomCour,
                                codeCours: cour.codeCour,
                                nomEnseignant: cour.idEnseignant,
                            }})
                            this.props.dispatch({type: "CREATE_COUR", payload: cours})
                            this.setState({
                                spin:false,
                                alertCounter:0,
                                spinMessage:"Module cree avec success",
                                gAlert:'good',
                            })

                        }
                        else{
                          console.log(data)
                              this.setState({
                                    spin:false,
                                    alertCounter:0,
                                    spinMessage:"Echec de creation de module",
                                    gAlert:'bad',
                                })

                        }
                      })
                      .catch(error=>{
                          console.log(error)
                        this.setState({
                            spin:false,
                            alertCounter:0,
                            spinMessage:"INTERNAL SERVER ERROR",
                            gAlert:'just',
                        })

                        })   
                  }      
                        /*
                    you can handle your backend here... do all neccessary creates, updates,

                    the data needed for this interface to work are:
                        1. all available classes in the database
                        2. all available courses in the database
                        3. all available faculties in the databases
                        4. all available modules in the databases
                        5. all available personnel in the databases.. 
                    I don't know if it's possible, but in a bid to ease the integration of this page,
                    if there is a way, load data directly into the redux so it appears here normally(don't forget to empty the dummy data i put there first).
                    then this way, you'll only have to handle creations and the updates to be done.

                    for the module to be created, the variable is: newModule
                    for the courses to update their classes, the array is: update
                    for the courses to create, the array is: created
                */
                // this.resetModule()
            }else alert('La pondération totale des sujets est inférieure à 1. \nLa pondération totale des sujets pour un module doit être égale à 1. \nRéglez les pondérations et réessayez')
        }else alert('Nom de module ou code de module ou poids de module non valide ou aucun sujet pour le module. vérifiez cela et réessayez')
    }

    nouveauModule=()=>{
        return (
            <div className="nouveauModule">
                {this.getFiliereModules()}
                <div className="nouveauModuleHeader" onClick={this.openNewModule}>
                    <i className='fa fa-plus-circle' id='moduleHeaderIcon' />
                    <span className='nouveauModuleName'>Nouveau module</span>
                </div>
                {this.state.nouveauModule?<div className='nouveauModuleInputs'>
                    <input type='text' placeholder='Nom module' value={this.state.nomNewModule} id='nomNewModule' onChange={this.handleChange} />
                    <input type='text' placeholder='Code module' value={this.state.codeNewModule} id='codeNewModule' onChange={this.handleChange}/>
                    <input type='number' min={1} step={1} placeholder='Credit' value={this.state.creditNewModule} id='creditNewModule' onChange={this.handleChange} />
                    {this.newSubject()}
                
                    <input type='submit' value='Creer' onClick={this.handleCreerClick} />
                </div>:null
                }
            </div>
        )
    }

    componentDidMount(){
        fetch('https://dp-dbv2.herokuapp.com/classe/module/users-courses-modules', {
            method: 'get',
            headers: {'Content-Type': 'application/json','x-access-token':window.localStorage.getItem("token")}
          })
          .then(response=>response.json())
          .then(data=>{
              console.log(data)
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
                this.props.dispatch({type: "LOAD_PERSONNEL", payload: users})
                this.props.dispatch({type: "LOAD_COUR", payload: cours})
                this.props.dispatch({type: "LOAD_MODULE", payload: modules})
            }
            else{
              console.log(data)
            }
          })
          .catch(error=>console.log(error))     
    }

    setGAlertFalse=()=>{
        this.setState({gAlert:false})
    }
  
    setAlertCounter=()=>{
        this.setState({alertCounter:this.state.alertCounter+1})
    }
    
    render() {
        return (
            <div className='classeSettingsContainer'>
                <span className="settingsBlockHeader">ADMINISTRATION DES CLASSES</span>
                <Spinner spin={this.state.spin} message={this.state.spinMessage}/>
                {this.state.gAlert?<BadAlert message={this.state.spinMessage} alertCounter={this.state.alertCounter} setCounter={this.setAlertCounter} gAlertSetter={this.setGAlertFalse} spin={this.state.gAlert} message={this.state.spinMessage} />:null}
                {this.state.gAlert?<GoodAlert message={this.state.spinMessage} alertCounter={this.state.alertCounter} setCounter={this.setAlertCounter} gAlertSetter={this.setGAlertFalse} spin={this.state.gAlert} message={this.state.spinMessage} />:null}
                {this.state.gAlert?<JustAlert message={this.state.spinMessage} alertCounter={this.state.alertCounter} setCounter={this.setAlertCounter} gAlertSetter={this.setGAlertFalse} spin={this.state.gAlert} message={this.state.spinMessage} />:null}

                <div className="chooseSettingsClass">
                    <select className='settingsClass' onChange={(e)=>this.setState({filiere:e.target.value})} id='filiere'>
                        <option value='' hidden  >Choisir une filiere</option>
                        {this.FacultyOptions()}
                    </select>
                    <select className='settingsClass' onChange={(e)=>this.setState({classe:e.target.value})} id='choosenClasse' >
                        <option value='' hidden >Choisir une classe</option>
                        {this.showFiliereClass()}
                    </select>
                </div>
                {this.state.classe!==''?this.nouveauModule():null}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        classes: state.Classe.classes,
        cours: state.Cour.cours,
        facultes: state.Faculty.faculties,
        modules: state.Module.modules,
        personnels: state.Personnel.personnels
    }
};

export default  connect(mapStateToProps)(ClasseSettings)