import React, { Component } from 'react'
import './DisplayStudents.css'
import { connect } from 'react-redux'

class DisplayStudents extends Component {
    state={
        idFiliere:'',
        idClasse:'',
    }
    componentDidMount=()=>{
        fetch('https://tranquil-thicket-81941.herokuapp.com/faculty/faculty-classes-students')
        .then(response=>response.json())
        .then(data=>{
            console.log(data.messages)
            const Facultx = data.messages.faculty.map((faculty,j)=>{
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
            const classes = data.messages.classes.map(classe=> {
                return {
                    idClasse:classe._id, 
                    filiere:{
                        nomFiliere:classe.nomClasse, 
                        idFiliere: classe.idFiliere
                    }, 
                    niveau:classe.niveau
                }
              })
              const student = data.messages.students.map(student=>{return{
                idEtudiant:student._id,
                matriculePersonnel: student.matricule,
                nom: student.nom,
                prenom: student.prenom,
                mail: student.email,
                tel: student.tel,
                role: student.role,
                idClasse: student.idClasse
            }})

            this.props.dispatch({type: "CREATE_ETUDIANT", payload: student})
            this.props.dispatch({type: "CREATE_FACULTY", payload: Facultx})
            this.props.dispatch({type: "LOAD_CLASSE", payload: classes})
        })
        .catch(error=>{
            console.log(error)
        })
    }

    handleSelectChange=(e)=>{
        this.setState({[e.target.id]:e.target.value})
    }

    selectFiliere=()=>{
        let selectOptions = this.props.faculties.map(faculty=><optgroup key={faculty._id} label={faculty.nomFaculte}>
            {
                faculty.filieres.map(filiere=><option key={filiere._id} value={filiere._id}>{filiere.nomFiliere}</option>)
            }
        </optgroup>)
        return <select id='idFiliere' className='displayStudentsSelect' onChange={this.handleSelectChange}>
            <option value='' hidden>Choisissez la filiere</option>
            {selectOptions}
        </select>
    }

    selectClasse=()=>{
            let classes = this.props.classes.filter(classe=>classe.filiere.idFiliere===this.state.idFiliere).sort((a,b)=>a.niveau>b.niveau?1:-1)
            classes = classes.map(classe=><option key={classe.idClasse} value={classe.idClasse}>{`${classe.filiere.nomFiliere} ${classe.niveau}`}</option>)
            return <select id='idClasse' className='displayStudentsSelect' onChange={this.handleSelectChange}>
                <option value='' hidden>Choisissez la classe</option>
                {classes}
            </select>
    }

    displayStudents=()=>{
        let students = this.props.etudiants.filter(student=>student.idClasse===this.state.idClasse)
        let classe = this.props.classes.find(classe=>classe.idClasse===this.state.idClasse)
        classe = classe.filiere.nomFiliere+' '+classe.niveau
        let index=0
        students = students.map(student=>(
            <span className='unEtudiant' key={student.idEtudiant}>
                <span className='unEtudiantData'>{++index}</span>
                <span className='unEtudiantData'>{student.matriculePersonnel}</span>
                <span className='unEtudiantData'>{student.nom}</span>
                <span className='unEtudiantData'>{student.prenom}</span>
                <span className='unEtudiantData'>{student.mail}</span>
                <span className='unEtudiantData'>{classe}</span>
            </span>
        ))
        return <div className="classeStudentList">
            <span className='classeName'>{classe}</span>
            <span className='classEffectif'>Effectif de la classe: {students.length} etudiants</span>
            <div className="classList">
                {students}
            </div>
        </div>
    }

    render() {
        return (
            <div>
                <div className="displayStudentsSelectHolder">
                    {this.selectFiliere()}
                    {this.selectClasse()}
                </div>
                {this.state.idClasse!==''?this.displayStudents():null}
            </div>
        )
    }
}

const mapStateToProps=(state)=>{
    return{
        classes:state.Classe.classes,
        faculties: state.Faculty.faculties,
        etudiants: state.Etudiant.etudiants
    }
}

export default connect(mapStateToProps)(DisplayStudents)