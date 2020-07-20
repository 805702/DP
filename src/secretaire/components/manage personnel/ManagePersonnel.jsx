import React, { Component } from 'react';
import { connect }  from 'react-redux';
import SecretaireNav from '../../../shared/UIElements/SecretaireNav'

import './ManagePersonnel.css';
import Spinner from '../../../shared/alerts/Spinner';
import BadAlert from '../../../shared/alerts/BadAlert';
import GoodAlert from '../../../shared/alerts/GoodAlert';
import JustAlert from '../../../shared/alerts/JustAlert';


class ManagePersonnel extends Component {
    state={
        inEditableState:'',
        editableObject:{},
        newCoordoClass:'',
        newPersonnelCoordoClass:'',
        newPersonnel:{matricule:'', nom:'', prenom:'', mail:'', tel:'', role:''},
        openNewPersonnel:false,
        spin:false,
        gAlert:false,
        alertCounter:0,
        spinMessage:''
    }

    /*
        1. verify the email and phone that they respect the format before sending them to backend
        2. show alert messages of actions that are done (globally... write two components Alert and Message for both cases)
    */

    sortPersonnelWRTRoleAndName=()=>this.props.personnels.sort((a,b)=>(a.role>b.role)?1:(a.role===b.role)?((a.nom>b.nom)?1:(a.nom===b.nom)?((a.prenom>b.prenom)?1:-1):-1):-1)

    handlePersonnelEdit=(e)=>{
        this.setState({inEditableState:e.target.id,editableObject:this.props.personnels.find(personnel=>personnel.matricule===e.target.id)})
    }

    handlePersonnelDelete=(personnelMatricule)=>{
        /*
            1. Delete the personnel with this matricule
            2. fetch the personnel collection from the database and load the personnel part of redux
        */
        let Perso = this.props.personnels.find(personnel=>personnel.matricule===personnelMatricule)
        this.setState({spin:true, spinMessage:"Nous supprimons un membre du personnel"})
        fetch(`https://dp-dbv2.herokuapp.com/manage-personnel/${Perso.idPersonnel}/delete`, {
            method: 'delete',
            headers: {'Content-Type': 'application/json','x-access-token':window.localStorage.getItem("token")}
          })
          .then(response=>response.json())
          .then(data=>{
            console.log(data.message)
            if(data.message){
              this.props.dispatch({type: "DELETE_PERSONNEL", payload: personnelMatricule})
              this.setState({
                spin:false,
                alertCounter:0,
                spinMessage:`Suppression du personnel ${personnelMatricule} faite avec success`,
                gAlert:'good',
                })
            }
            else{
              console.log(data)
              this.setState({
                spin:false,
                alertCounter:0,
                spinMessage:`Echec de suppression`,
                gAlert:'bad',
            })
            }
          })
          .catch(error=>{
              this.setState({
                  spin:false,
                  alertCounter:0,
                  spinMessage:`INTERNAL SERVER ERROR`,
                  gAlert:'just',
                })
              console.log(error)
            })
    }

    handleEditChange=(e)=>{
        let tempObj={}
        switch(e.target.id){
            case 'managePersonnelMail':
                tempObj={...this.state.editableObject, mail:e.target.value}
                this.setState({editableObject:tempObj})
                break
            case 'managePersonnelTel':
                tempObj={...this.state.editableObject, tel:e.target.value}
                this.setState({editableObject:tempObj})
                break
            case 'managePersonnelRole':
                tempObj={...this.state.editableObject, role:e.target.value}
                this.setState({editableObject:tempObj})
                break
            case 'newCoordoClass':
                this.setState({newCoordoClass:e.target.value})
                break
            default:
                break
        }
    }

    handleEditSave=(e)=>{
        console.log(e.target.id)
        console.log(this.state.editableObject)
        let updatedPersonnel = this.state.editableObject
        if(this.state.editableObject.mail!=='' && this.state.editableObject.tel!=='' && this.state.role!==''){
            if(this.state.editableObject.role==='coordonateur' && this.state.newCoordoClass!==''){
                let coordoClasses = this.props.classes.filter(classe=>classe.filiere.nomFiliere===this.state.newCoordoClass)
                let coordoUploadObject={matriculePersonnel:this.state.editableObject.matricule, classes:coordoClasses}
                console.log(coordoUploadObject,this.state.newCoordoClass)
                /*
                    The document to change in the backend has matricule: e.target.id
                    and it should be updated with the object: this.state.editableObject
                    the new element to add in the coordo collection is: coordoUploadObject

    
                    Both should be created in a transaction (the update and the creation of the new coordo)
                    After having updated these field, fetch the personnel data back to the redux state so the interface can refresh
                */
                this.setState({spin:true, spinMessage:"Nous modifions le coordonateur"})
                fetch(`https://dp-dbv2.herokuapp.com/manage-personnel/${this.state.editableObject.idPersonnel}/update`, {
                        method: 'put',
                        headers: {'Content-Type': 'application/json','x-access-token':window.localStorage.getItem("token")},
                        body: JSON.stringify({
                        matricule:this.state.editableObject.matricule,
                        nom:this.state.editableObject.nom,
                        prenom:this.state.editableObject.prenom,
                        email: this.state.editableObject.mail.toLowerCase(),
                        tel:this.state.editableObject.tel,
                        role:this.state.editableObject.role,
                        classe:coordoUploadObject.classes.map(classe=>classe.idClasse)
                        })
                    })
                       .then(response=>response.json())
                       .then(data=>{
                         if(data.message){
                            console.log(data.message,updatedPersonnel)
                            this.props.dispatch({type: "UPDATE_PERSONNEL", payload: updatedPersonnel})
                            this.setState({
                                spin:false,
                                alertCounter:0,
                                spinMessage:`Modification du personnel ${updatedPersonnel.matricule}  faite avec success`,
                                gAlert:'good',
                            })
                         }
                         else{
                            this.setState({
                                spin:false,
                                alertCounter:0,
                                spinMessage:`Echec de modification`,
                                gAlert:'bad',
                            })
                           console.log(data)
                         }
                       })
                       .catch(error=>{
                        this.setState({
                            spin:false,
                            alertCounter:0,
                            spinMessage:`INTERNAL SERVER ERROR`,
                            gAlert:'just',
                        })
                           console.log(error)
                        })
            }else if(this.state.editableObject.role==='coordonateur' && this.state.newCoordoClass==='')alert('Invalid filiere.\nhoose a filiere and for the newly created coordo')
            else{
                /*
                    The document to change in the backend has matricule: e.target.id
                    and it should be updated with the object: this.state.editableObject

                    After having updated these field, fetch the personnel data back to the redux state so the interface can refresh
                */
                    this.setState({spin:true, spinMessage:"Nous modifions le personnel"})
                    fetch(`https://dp-dbv2.herokuapp.com/manage-personnel/${this.state.editableObject.idPersonnel}/update`, {
                         method: 'put',
                         headers: {'Content-Type': 'application/json','x-access-token':window.localStorage.getItem("token")},
                         body: JSON.stringify({
                            matricule:this.state.editableObject.matricule,
                            nom:this.state.editableObject.nom,
                            prenom:this.state.editableObject.prenom,
                            email: this.state.editableObject.mail.toLowerCase(),
                            tel:this.state.editableObject.tel,
                            role:this.state.editableObject.role
                         })
                       })
                       .then(response=>response.json())
                       .then(data=>{
                         if(data.message){
                            console.log(data.message,updatedPersonnel)
                            this.props.dispatch({type: "UPDATE_PERSONNEL", payload: updatedPersonnel})
                            this.setState({
                                spin:false,
                                alertCounter:0,
                                spinMessage:`Modification du personnel ${updatedPersonnel.matricule}  faite avec success`,
                                gAlert:'good',
                            })
                         }
                         else{
                            this.setState({
                                spin:false,
                                alertCounter:0,
                                spinMessage:`Echec de modification`,
                                gAlert:'bad',
                            })
                           console.log(data)
                         }
                       })
                       .catch(error=>{
                        this.setState({
                            spin:false,
                            alertCounter:0,
                            spinMessage:`INTERNAL SERVER ERROR`,
                            gAlert:'just',
                        })
                           console.log(error)
                        }) 
            }

            this.handleEditCancel()

        }
    }

    handleEditCancel=()=>{
        this.setState({editableObject:{}, inEditableState:'', newCoordoClass:''})
    }

    displayPersonnelList=()=>{
        let key=0
        let personnelList=this.sortPersonnelWRTRoleAndName()
        return personnelList.map(personnel=>{
            return this.state.inEditableState!==personnel.matricule?(
            <div className="personnel" key={++key} >
                <span className='managePersonnelIndex'>{key}</span>
                <span className='managePersonnelMatricule'>{personnel.matricule}</span>
                <span className='managePersonnelNom'>{personnel.nom}</span>
                <span className='managePersonnelPrenom'>{personnel.prenom}</span>
                <span className='managePersonnelMail'>{personnel.mail}</span>
                <span className='managePersonnelTel'>{personnel.tel}</span>
                <span className='managePersonnelRole'>{personnel.role}</span>
                <div className="personnelActionBtns">
                    <input type='button' value='Editer' id={personnel.matricule} onClick={this.handlePersonnelEdit} className='managePersonnelActionBtnEdit' />
                    <input type='button' value='Suppr...' onClick={()=>this.handlePersonnelDelete(personnel.matricule)} className='managePersonnelActionBtnDelete' />
                </div>
            </div>
            ):(
            <div className="personnel" key={++key} >
                <span className='managePersonnelIndex'>{key}</span>
                <span className='managePersonnelMatricule'>{personnel.matricule}</span>
                <span className='managePersonnelNom'>{personnel.nom}</span>
                <span className='managePersonnelPrenom'>{personnel.prenom}</span>
                <input type='email' className='managePersonnelEditable' id='managePersonnelMail' value={this.state.editableObject.mail} onChange={this.handleEditChange} />
                <input type='text' className='managePersonnelEditable' id='managePersonnelTel' value={this.state.editableObject.tel} onChange={this.handleEditChange} />
                {this.state.editableObject.role!=='secretaire'?<select id='managePersonnelRole' onChange={this.handleEditChange}>
                    <option value='' hidden>Choissisez le role</option>
                    {this.props.roles.map(role=>{
                        if(role.nomRole!=='secretaire'){
                            return <option selected={this.state.editableObject.role===role.nomRole} key={role.nomRole}>{role.nomRole}</option>
                        }return null
                    })}
                </select>:<span className='managePersonnelRole'>Secretaire</span>}
                {this.state.editableObject.role==='coordonateur'?(
                    <select id='newCoordoClass' onChange={this.handleEditChange}>
                        <option hidden value=''>Choissisez la filiere</option>
                        {
                            this.props.faculties.map(faculty=>(
                                <optgroup key={faculty.nomFaculte} label={faculty.nomFaculte}>
                                    {faculty.filieres.map(filiere=><option key={filiere.nomFiliere}>{filiere.nomFiliere}</option>)}
                                </optgroup>
                            ))
                        }
                    </select>
                ):null}
                <input type='button' value='Save' id={personnel.matricule} onClick={this.handleEditSave} className='managePersonnelActionBtnSave' />
                <input type='button' value='Cancel' onClick={this.handleEditCancel} className='managePersonnelActionBtnCancel' /> 
            </div>
            )
        })
    }

    handleChangeNewPersonnel=(e)=>{
        let tempObj={}
        switch(e.target.id){
            case 'newPersonnelMatricule':
                tempObj={...this.state.newPersonnel, matricule:e.target.value}
                this.setState({newPersonnel:tempObj})
                break;
            case 'newPersonnelNom':
                tempObj={...this.state.newPersonnel, nom:e.target.value}
                this.setState({newPersonnel:tempObj})
                break;
            case 'newPersonnelPrenom':
                tempObj={...this.state.newPersonnel, prenom:e.target.value}
                this.setState({newPersonnel:tempObj})
                break;
            case 'newPersonnelMail':
                tempObj={...this.state.newPersonnel, mail:e.target.value}
                this.setState({newPersonnel:tempObj})
                break;
            case 'newPersonnelTel':
                tempObj={...this.state.newPersonnel, tel:e.target.value}
                this.setState({newPersonnel:tempObj})
                break;
            case 'newPersonnelRole':
                tempObj={...this.state.newPersonnel, role:e.target.value}
                this.setState({newPersonnel:tempObj})
                break;
            case 'newPersonnelCoordoClass':
                this.setState({newPersonnelCoordoClass:e.target.value})
                break;
            default:
                break;
        }
    }

    setGAlertFalse=()=>{
        this.setState({gAlert:false})
    }
  
    setAlertCounter=()=>{
        this.setState({alertCounter:this.state.alertCounter+1})
    }
  
    handleCreerClick=(e)=>{
        e.preventDefault()
        console.log(this.state.newPersonnel)
        if(this.state.newPersonnel.matricule!=='' && this.state.newPersonnel.nom!=='' && this.state.newPersonnel.prenom!=='' && this.state.newPersonnel.mail!=='' && this.state.newPersonnel.tel!=='' && this.state.newPersonnel.role!==''){
          if(this.state.newPersonnel.role==='coordonateur' && this.state.newPersonnelCoordoClass!==''){
            let coordoClasses = this.props.classes.filter(classe=>classe.filiere.nomFiliere===this.state.newPersonnelCoordoClass)
            let coordoUploadObject={matriculePersonnel:this.state.newPersonnel.matricule, classes:coordoClasses}
            this.setState({spin:true, spinMessage:"Nous creeons le coordonateur"})
            fetch('https://dp-dbv2.herokuapp.com/manage-personnel/new', {
                method: 'post',
                headers: {'Content-Type': 'application/json','x-access-token':window.localStorage.getItem("token")},
                body: JSON.stringify({
                    matricule:this.state.newPersonnel.matricule,
                    nom:this.state.newPersonnel.nom,
                    prenom:this.state.newPersonnel.prenom,
                    email: this.state.newPersonnel.mail.toLowerCase(),
                    tel:this.state.newPersonnel.tel,
                    role:this.state.newPersonnel.role,
                    startDate: Date.now(),
                    classes: coordoUploadObject.classes.map(classe=>classe.idClasse)
                })
            })
            .then(response=>response.json())
            .then(data=>{
                if(data.message){
                console.log(data.message)
                let user = data.message
                const Personnel = {
                    idPersonnel:user._id,
                    matricule: user.matricule,
                    nom: user.nom,
                    prenom: user.prenom,
                    mail: user.email,
                    tel: user.tel,
                    role: user.role
                }
                this.props.dispatch({type: "LOAD_PERSONNEL", payload: [Personnel]})
                this.setState({
                    spin:false,
                    alertCounter:0,
                    spinMessage:"Success de l'operation",
                    gAlert:'good',
                  })
  
            }
                else{
                    console.log(data)
                    this.setState({
                        spin:false,
                        alertCounter:0,
                        spinMessage:'Echec',
                        gAlert:'bad',
                    })
      
                }
            })
                .catch(error=>console.log(error)) 
                console.log(this.state.newPersonnel)
                console.log(coordoUploadObject)
                this.setState({openNewPersonnel:false, newPersonnel:{matricule:'', nom:'', prenom:'', mail:'', tel:'', role:''}, newPersonnelCoordoClass:''})
                }else if(this.state.newPersonnel.role==='coordonateur' && this.state.newPersonnelCoordoClass===''){
                    this.setState({
                        spin:false,
                        alertCounter:0,
                        spinMessage:'Erreur... Choisir une classe pour le coordonateur',
                        gAlert:'just',
                    })        
                }
                else{
                    /*
                    The object to be created in the personnel collection is: this.state.newPersonnel
                    */
                   this.setState({spin:true, spinMessage:"Nous creeons le personnel"})
                    fetch('https://dp-dbv2.herokuapp.com/manage-personnel/new', {
                        method: 'post',
                        headers: {'Content-Type': 'application/json','x-access-token':window.localStorage.getItem("token")},
                        body: JSON.stringify({
                            matricule:this.state.newPersonnel.matricule,
                            nom:this.state.newPersonnel.nom,
                            prenom:this.state.newPersonnel.prenom,
                            email: this.state.newPersonnel.mail.toLowerCase(),
                            tel:this.state.newPersonnel.tel,
                            role:this.state.newPersonnel.role,
                            startDate: Date.now()
                        })
                    })
                    .then(response=>response.json())
                    .then(data=>{
                        if(data.message){
                            console.log(data.message)
                            let user = data.message
                            const Personnel = {
                            idPersonnel:user._id,
                            matricule: user.matricule,
                            nom: user.nom,
                            prenom: user.prenom,
                            mail: user.email,
                            tel: user.tel,
                            role: user.role
                        }
                        this.props.dispatch({type: "LOAD_PERSONNEL", payload: [Personnel]})
                        this.setState({
                            spin:false,
                            alertCounter:0,
                            spinMessage:"Success de l'operation",
                            gAlert:'good',
                        })
        
                    }else{
                        console.log(data)
                        this.setState({
                            spin:false,
                            alertCounter:0,
                            spinMessage:'Echec',
                            gAlert:'bad',
                        })    
                    }
                })
                .catch(error=>{
                    this.setState({
                        spin:false,
                        alertCounter:0,
                        spinMessage:'INTERNAL SERVER ERROR',
                        gAlert:'just',
                    }) 
                    console.log(error)
                }) 
                console.log(this.state.newPersonnel)
                this.setState({openNewPersonnel:false, newPersonnel:{matricule:'', nom:'', prenom:'', mail:'', tel:'', role:''}, newPersonnelCoordoClass:''})
                }
            }else{
                this.setState({
                    spin:false,
                    alertCounter:0,
                    spinMessage:'Erreur... Remplir tout les champs puis essayer a nouveau',
                    gAlert:'just',
                })    
            }
    }

    handleCreerCancel=()=>{
        this.setState({openNewPersonnel:false, newPersonnel:{matricule:'', nom:'', prenom:'', mail:'', tel:'', role:''}})
    }

    enableCreation=(e)=>{
        if(this.state.openNewPersonnel===false){
            this.setState({openNewPersonnel:true})
        }else alert('Termine avec la creation en cours ou annuler celui-ci.')
    }

    addNewPersonnel=()=>{
        return (
            <div className="newPersonnelCreationPane">
                {this.state.openNewPersonnel?(
                <form className='newPersonnelForm' onSubmit={this.handleCreerClick}>
                    <span className='managePersonnelIndex'>{this.props.personnels.length+1}</span>
                    <input className='newPersonnelInput' placeholder='Matricule' id='newPersonnelMatricule' onChange={this.handleChangeNewPersonnel} value={this.state.newPersonnelMatricule} />
                    <input className='newPersonnelInput' placeholder='Entrer le nom' id='newPersonnelNom' onChange={this.handleChangeNewPersonnel} value={this.state.newPersonnelMatricule} />
                    <input className='newPersonnelInput' placeholder='Entrer le prenom' id='newPersonnelPrenom' onChange={this.handleChangeNewPersonnel} value={this.state.newPersonnelMatricule} />
                    <input className='newPersonnelInput' placeholder='Entrer le mail' id='newPersonnelMail' onChange={this.handleChangeNewPersonnel} value={this.state.newPersonnelMatricule} />
                    <input className='newPersonnelInput' placeholder='Telephone' id='newPersonnelTel' onChange={this.handleChangeNewPersonnel} value={this.state.newPersonnelMatricule} />
                    <select id='newPersonnelRole' onChange={this.handleChangeNewPersonnel}>
                        <option hidden value=''>Choissisez le role</option>
                        {this.props.roles.map(role=>{
                            if(role.nomRole!=='secretaire'){
                                return <option key={role.nomRole}>{role.nomRole}</option>
                            }return null
                        })}
                    </select>
                    {this.state.newPersonnel.role==='coordonateur'?(
                        <select id='newPersonnelCoordoClass' onChange={this.handleChangeNewPersonnel}>
                            <option hidden value=''>Choissisez la filiere</option>
                            {
                                this.props.faculties.map(faculty=>(
                                    <optgroup key={faculty.nomFaculte} label={faculty.nomFaculte}>
                                        {faculty.filieres.map(filiere=><option key={filiere.nomFiliere}>{filiere.nomFiliere}</option>)}
                                    </optgroup>
                                ))
                            }
                        </select>
                    ):null}
                    <div className="personnelActionBtns">
                        <input type='submit' value='Creer' id={this.state.newPersonnel.matricule} onClick={this.handleCreerClick} className='createPersonnelActionBtnCreer' />
                        <input type='button' value='Cancel' onClick={this.handleCreerCancel} className='createPersonnelActionBtnCancel' />
                    </div>
                </form>):null}
                <div className="newPersonnelOpening" onClick={this.enableCreation}>
                    <Spinner spin={this.state.spin} message={this.state.spinMessage}/>
                    {this.state.gAlert?<BadAlert message={this.state.spinMessage} alertCounter={this.state.alertCounter} setCounter={this.setAlertCounter} gAlertSetter={this.setGAlertFalse} spin={this.state.gAlert} message={this.state.spinMessage} />:null}
                    {this.state.gAlert?<GoodAlert message={this.state.spinMessage} alertCounter={this.state.alertCounter} setCounter={this.setAlertCounter} gAlertSetter={this.setGAlertFalse} spin={this.state.gAlert} message={this.state.spinMessage} />:null}
                    {this.state.gAlert?<JustAlert message={this.state.spinMessage} alertCounter={this.state.alertCounter} setCounter={this.setAlertCounter} gAlertSetter={this.setGAlertFalse} spin={this.state.gAlert} message={this.state.spinMessage} />:null}
                    <i className='fa fa-plus-circle' id='enableCreateNewPersonnel' />
                    {/* <span className='newPersonnelPhrase'>Nouveau personnel</span> */}
                </div>
            </div>
        )
    }

    personnelListHeader=()=>(
        <div className='displayPersonnelListHeader'>
            <span className='displayPersonnelListHeaderElement'>No</span>
            <span className='displayPersonnelListHeaderElement'>Matricule</span>
            <span className='displayPersonnelListHeaderElement'>Nom</span>
            <span className='displayPersonnelListHeaderElement'>Prenom</span>
            <span className='displayPersonnelListHeaderElement'>Email</span>
            <span className='displayPersonnelListHeaderElement'>Telephone</span>
            <span className='displayPersonnelListHeaderElement'>Role</span>
            <span className='displayPersonnelListHeaderElement'>ACTIONS</span>
        </div>
    )
    
    componentDidMount(){
        console.log(this.props)
       fetch('https://dp-dbv2.herokuapp.com/manage-personnel/users-classes-faculties', {
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
                {this.personnelListHeader()}
                {this.displayPersonnelList()}
                {this.addNewPersonnel()}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        personnels: state.Personnel.personnels,
        faculties: state.Faculty.faculties,
        roles: state.Role.roles,
        classes: state.Classe.classes
    }
}

export default  connect(mapStateToProps)(ManagePersonnel)