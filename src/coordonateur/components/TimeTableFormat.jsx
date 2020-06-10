import React, { Component } from 'react'
import TimeTableLine from './TimeTableLine'

import Hoc from '../../shared/utils/hoc.js'
import parseJwt from '../../shared/utils/parseJwt.js'

import './TimeTableFormat.css'
import { connect } from 'react-redux'
import ClasseCoordo from './ClasseCoordo'
import ClasseDefinir from './ClasseDefinir'
import CoordoNav from '../../shared/UIElements/CoordoNav'

class TimeTableFormat extends Component {
    state={
        tableHeader:{weekStart:'', weekEnd:''},
        Table:[],
        //matriculeCoordo is data that is supposed to be gotten when a coordo signs in... after decrypting the jwt, just pump the data into the state on the matriculeCoordo
        matriculeCoordo:'',
        theClasse:''
    }

    definirTable={
        tableHeader:{weekStart:'', weekEnd:''},
        table:[
            {index:1, debut:'08:00', fin:'12:00', mon:{cour:'', salle:''}, tue:{cour:'', salle:''}, wed:{cour:'', salle:''}, thur:{cour:'', salle:''}, fri:{cour:'', salle:''}, sat:{cour:'', salle:''}, sun:{cour:'', salle:''}},
            {index:2, debut:'13:00', fin:'17:00', mon:{cour:'', salle:''}, tue:{cour:'', salle:''}, wed:{cour:'', salle:''}, thur:{cour:'', salle:''}, fri:{cour:'', salle:''}, sat:{cour:'', salle:''}, sun:{cour:'', salle:''}}
        ]
    }

    findClassFaculty=()=>this.props.faculties.find(faculty=>{
        return faculty.filieres.find(filiere=>filiere.nomFiliere===this.state.theClasse.split(' ')[0])
    })
    // ._id

    getSalleCours=()=>{
        let classeFaculty=this.findClassFaculty()
        console.log(classeFaculty)
        return 'hello world'
        // return this.props.batiments.filter(batiment=>batiment.idFaculty===classeFaculty).map(batiment=>(
        //     <optgroup key={batiment.nomBatiment} label={batiment.nomBatiment}>
        //         {batiment.salles.map(salle=><option key={salle.nomSalle}>{salle.nomSalle}</option>)}
        //     </optgroup>
        // ))
    }

    memoGetNameFromId = () =>{
        let nameId = {id:null, name:null};
        return (id)=>
        {
            if(nameId.id===id)return nameId.name
            nameId.id=id;
            nameId.name=this.props.personnels.find(personnel=>{ 
                return personnel.idPersonnel===id?true:false
            }).nom;
            return nameId.name
        }
    }

    getPersonnelName=(idPersonnel)=>{
        let personnel = this.props.personnels.find(perso=>perso.idPersonnel===idPersonnel)
        return personnel===undefined?'':personnel.nom
        // return 'Ndzi'
    }

    getNameFromId = (id) =>{let memo = this.memoGetNameFromId(); return memo(id)}
    getClasseCours=()=>this.props.cours.filter(cour=>cour.classe.includes(this.state.theClasse.split(' ')[this.state.theClasse.split(' ').length-1])).sort((a,b)=>(a.nomCours>b.nomCours)?1:-1).map(cour=>{
        console.log(cour)
        return <option key={cour.codeCours} value={cour.nomCours+'_'+cour.nomEnseignant+'_'+this.getPersonnelName(cour.nomEnseignant)}>{cour.nomCours+'_'+this.getPersonnelName(cour.nomEnseignant)}</option>
    })

    handleLineDataChange=(lineNumber, e)=>{
        // let Day=day.split('_')[0]
        // let block=day.split('_')[1]
        // console.log(lineNumber+' '+day.target.value)
        let lineObject=this.state.Table[lineNumber-1]
        switch(e.target.id.split('_')[0]){
            case 'mon':
                switch(e.target.id.split('_')[1]){
                    case 'cours':
                        lineObject={...lineObject, mon:{cour:e.target.value, salle:lineObject.mon.salle}}
                        console.log(lineObject.mon.cour)
                        break
                    case 'salle':
                        lineObject={...lineObject, mon:{cour:lineObject.mon.cour, salle:e.target.value}}
                        break
                    default:
                        break
                }
                break
            case 'tue':
                switch(e.target.id.split('_')[1]){
                    case 'cours':
                        lineObject={...lineObject, tue:{cour:e.target.value, salle:lineObject.tue.salle}}
                        break
                    case 'salle':
                        lineObject={...lineObject, tue:{cour:lineObject.tue.cour, salle:e.target.value}}
                        break
                    default:
                        break
                }
                break
            case 'wed':
                switch(e.target.id.split('_')[1]){
                    case 'cours':
                        lineObject={...lineObject, wed:{cour:e.target.value, salle:lineObject.wed.salle}}
                        break
                    case 'salle':
                        lineObject={...lineObject, wed:{cour:lineObject.wed.cour, salle:e.target.value}}
                        break
                    default:
                        break
                }
                break
            case 'thur':
                switch(e.target.id.split('_')[1]){
                    case 'cours':
                        lineObject={...lineObject, thur:{cour:e.target.value, salle:lineObject.thur.salle}}
                        break
                    case 'salle':
                        lineObject={...lineObject, thur:{cour:lineObject.thur.cour, salle:e.target.value}}
                        break
                    default:
                        break
                }
                break
            case 'fri':
                switch(e.target.id.split('_')[1]){
                    case 'cours':
                        lineObject={...lineObject, fri:{cour:e.target.value, salle:lineObject.fri.salle}}
                        break
                    case 'salle':
                        lineObject={...lineObject, fri:{cour:lineObject.fri.cour, salle:e.target.value}}
                        break
                    default:
                        break
                }
                break
            case 'sat':
                switch(e.target.id.split('_')[1]){
                    case 'cours':
                        lineObject={...lineObject, sat:{cour:e.target.value, salle:lineObject.sat.salle}}
                        break
                    case 'salle':
                        lineObject={...lineObject, sat:{cour:lineObject.sat.cour, salle:e.target.value}}
                        break
                    default:
                        break
                }
                break
            case 'sun':
                switch(e.target.id.split('_')[1]){
                    case 'cours':
                        lineObject={...lineObject, sun:{cour:e.target.value, salle:lineObject.sun.salle}}
                        break
                    case 'salle':
                        lineObject={...lineObject, sun:{cour:lineObject.sun.cour, salle:e.target.value}}
                        break
                    default:
                        break
                }
                break
            default:
                break
        }
        let tempTable=[]
        this.state.Table.map(tableLine=>{
            if(tableLine.index===lineNumber)tempTable.push(lineObject)
            else tempTable.push(tableLine)
            return null
        })

        this.setState({Table:tempTable})
    }

    showLines=()=>this.state.Table.map(line=>{
        return <TimeTableLine lineNumber={this.handleLineDataChange} line={line} cours={this.getClasseCours()} salles={this.getSalleCours()} key={line.index}/>
    })

    getCoordoObject=()=>this.props.coordonateurs.find(coordonateur=>coordonateur.matriculePersonnel===this.state.matriculeCoordo)
    convertCoordoClasses=(obj)=>obj.classes.map(Oclasse=>this.props.classes.find(Cclasse=>Cclasse.idClasse===Oclasse))
    handleDefinirClick=(e)=>{this.setState({theClasse:e.target.id.split('_')[0]+' '+e.target.id.split('_')[1]+' '+e.target.id.split('_')[2], tableHeader:this.definirTable.tableHeader, Table:this.definirTable.table})}

    handleModifyEmtpy=()=>{this.setState({tableHeader:this.definirTable.tableHeader, Table:this.definirTable.table})}

    getClasseTimetable=()=>this.getCoordoObject().timetables.find(timetable=>timetable.classe===this.state.theClasse.split(' ')[this.state.theClasse.split(' ').length-1])

    handleModifierClick=(e)=>{
        this.setState({theClasse:e.target.id.split('_')[0]+' '+e.target.id.split('_')[1]+' '+e.target.id.split('_')[2]},()=>{
                console.log(this.getClasseTimetable(),"get timetable")
            if (this.getClasseTimetable().timetable===undefined || Object.keys(this.getClasseTimetable().timetable.table).length!==2)this.handleModifyEmtpy()
            else{
                let timetableObject= this.getClasseTimetable()
                this.setState({tableHeader:timetableObject.timetable.tableHeader, Table:timetableObject.timetable.table})
            }
        })
    }

    handleInputChange=(e)=>{
        let tempHeader = {...this.state.tableHeader, weekStart:e.target.value}
        this.setState({tableHeader:tempHeader},()=>this.fillToDate())
    }

    fillToDate=()=>{
        let tempHeader = new Date(this.state.tableHeader.weekStart)
        tempHeader = tempHeader.setDate(tempHeader.getDate()+6)
        tempHeader = new Date(tempHeader).toDateString()
        tempHeader={...this.state.tableHeader, weekEnd:tempHeader}
        this.setState({tableHeader:tempHeader})
    }

    handleEnregistrerClick=()=>{
        let uploadData ={tableHeader:this.state.tableHeader, table:this.state.Table}
        let concernedClass = this.state.theClasse
        let concernedCoordo = this.state.matriculeCoordo
        /*
            1. Go to the coordonateur collection and get the coordonateur with matricule: concernedCoordo (this is the coordonateur document to be updated)
            2. in this coordonateur's document gotten in 1, look for the timetable in its timetable array that has class: concernedClass (this is the class whose timetable field will be updated)
            3. when you already know the class, update the timetable of that class with : uploadData
            4. fetch the coordonateur collection and feed the coordonateur reducer with.
        */
        fetch(`https://tranquil-thicket-81941.herokuapp.com/coordo/timetable/update`, {
                         method: 'put',
                         headers: {'Content-Type': 'application/json','x-access-token':window.localStorage.getItem("token")},
                         body: JSON.stringify({
                            timetable:uploadData,
                            classe:concernedClass.split(' ')[2],
                            matricule:concernedCoordo,
                         })
                       })
                       .then(response=>response.json())
                       .then(data=>{
                         if(data.message){
                             alert('successfully saved the timetable')
                             console.log(data.message)
                              const coordos = [data.message].map(coordo=>{return{
                                    idCoordonateur:coordo._id,
                                    matriculePersonnel: coordo.matriculePersonnel,
                                    idPersonnel: coordo.idPersonnel,
                                    classes: coordo.classes,
                                    timetables: coordo.timetables.map(timetable=>{return{classe: timetable.classe, timetable: timetable.timetable}}),
                                }})
                            this.props.dispatch({type: "CREATE_COORDONATEUR", payload: coordos })
                         }
                         else{
                            alert('Failed to save the timetable')
                           console.log(data)
                         }
                       })
                       .catch(error=>{
                            alert('Failed to save the timetable');
                            console.log(error);
                        }) 

        console.log(uploadData)
        console.log(concernedClass)
        console.log(concernedCoordo)
        console.log('those are the gururs to the functioning of this page')
        this.setState({theClasse:'', tableHeader:this.definirTable.tableHeader, Table:this.definirTable.table})
    }

    handlePublierClick=()=>{
        let uploadData ={tableHeader:this.state.tableHeader, table:this.state.Table}
        let concernedClass = this.state.theClasse
        let concernedCoordo = this.state.matriculeCoordo
        /*
            1. Go to the coordonateur collection and get the coordonateur with matricule: concernedCoordo (this is the coordonateur document to be updated)
            2. in this coordonateur's document gotten in 1, look for the timetable in its timetable array that has class: concernedClass (this is the class whose timetable field will be updated)
            3. when you already know the class, update the timetable of that class with : uploadData
            
            // this part is for the students to be able to see their timetables.
            4. Go to the timetables collection, and look for the class with classe: concernedClass
            5. when you already know the class, update the timetable of that class with : uploadData
            6. fetch the coordonateur collection and feed the coordonateur reducer with.
        */
         fetch(`https://tranquil-thicket-81941.herokuapp.com/coordo/timetable/update-publish`, {
                         method: 'put',
                         headers: {'Content-Type': 'application/json','x-access-token':window.localStorage.getItem("token")},
                         body: JSON.stringify({
                            timetable:uploadData,
                            classe:concernedClass,
                            matricule:concernedCoordo,
                            startDate: Date.now()
                         })
                       })
                       .then(response=>response.json())
                       .then(data=>{
                         if(data.message){
                             alert('successfully published the timetable')
                             console.log(data.message)
                              const coordos = [data.message].map(coordo=>{return{
                                    idCoordonateur:coordo._id,
                                    matriculePersonnel: coordo.matriculePersonnel,
                                    idPersonnel: coordo.idPersonnel,
                                    classes: coordo.classes,
                                    timetables: coordo.timetables.map(timetable=>{return{classe: timetable.classe, timetable: timetable.timetable}}),
                                }})
                            this.props.dispatch({type: "CREATE_COORDONATEUR", payload: coordos })
                         }
                         else{
                            alert('Failed to publish the timetable')
                           console.log(data)
                         }
                       })
                       .catch(error=>{
                            alert('Failed to publish the timetable');
                            console.log(error);
                        }) 
        console.log(uploadData)
        console.log(concernedClass)
        console.log(concernedCoordo)
        console.log('updated data for both students and the coordo... the students can now see their timetable in the timetables collection.')
        this.setState({theClasse:'', tableHeader:this.definirTable.tableHeader, Table:this.definirTable.table})

    }
    componentDidMount(){
        fetch('https://tranquil-thicket-81941.herokuapp.com/coordo/timetable/coordo-classes-timetables-courses-batiment-faculties-users', {
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
                  const cours = data.message.courses.map(cour=>{return{
                    idCour:cour._id,
                    classe: cour.classes,
                    nomCours: cour.nomCour,
                    codeCours: cour.codeCour,
                    nomEnseignant: cour.idEnseignant,
                }})
                const timetables = data.message.timetables.map(timetable=>{return{
                    idTimetable: timetable._id,
                    classe: timetable.classe,
                    tableHeader: timetable.tableHeader,
                    table: timetable.table,
                }})
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
                this.props.dispatch({type: "LOAD_CLASSE", payload: classes})
                this.props.dispatch({type: "LOAD_PERSONNEL", payload: users})
                this.props.dispatch({type: "LOAD_COUR", payload: cours})
                this.props.dispatch({type: "CREATE_FACULTY", payload: Facultx})
                this.props.dispatch({type: "CREATE_COORDONATEUR", payload: coordos})
                this.props.dispatch({type: "CREATE_TIMETABLE", payload: timetables})
                this.setState({matriculeCoordo:parseJwt(window.localStorage.getItem('token')).user.matricule})
            }
            else{
              console.log(data)
            }
          })
          .catch(error=>console.log(error))      
    }
    render() {
        console.log(this.props,this.state)
        return (
            <div>
                <CoordoNav />
            {(!this.state.matriculeCoordo)?
                <div id="loading-on">Loading</div>
            :
            <Hoc>
                <ClasseCoordo classes={this.convertCoordoClasses(this.getCoordoObject()).sort((a,b)=>(a>b)?1:-1)} handleDefinirClick={this.handleDefinirClick} handleModifierClick={this.handleModifierClick} />
                {this.state.theClasse!==''?
                                <div className='timetableBottom'>
                                    <ClasseDefinir theClasse={this.state.theClasse} handleInputChange={this.handleInputChange} fromDate={this.state.tableHeader.weekStart} toDate={this.state.tableHeader.weekEnd}/>
                                    <TimeTableLine type='th' />
                                    {this.showLines()}
                                    <div className="timeTableBtns">
                                        <input type='button' value='Enregistrer' className='enregistrerBtn' onClick={this.handleEnregistrerClick} />
                                        <input type='button' value='Publier' className='publierBtn' onClick={this.handlePublierClick}/>
                                    </div>
                                </div>
                                :
                                null}
            </Hoc>
            }
            </div>
        )
    }
}

const mapStateToProps=(state)=>{
    return{
        coordonateurs: state.Coordonateur.coordonateurs,
        cours: state.Cour.cours,
        batiments: state.Batiment.batiments,
        classes: state.Classe.classes,
        faculties: state.Faculty.faculties,
        timetables: state.Timetable.timetables,
        user: state.User.user,
        personnels: state.Personnel.personnels
    }
}

export default connect(mapStateToProps)(TimeTableFormat)