import React, { Component } from 'react'
import { connect } from 'react-redux'

import Hoc from '../shared/utils/hoc.js'
import parseJwt from '../shared/utils/parseJwt.js'


import './Devoir.css'
import StudentNav from '../shared/UIElements/StudentNav.jsx'

class Devoir extends Component {
    state={
        idEtudiant:null,
        idEvaluation:'',
        newPropositions:[],
    }

    getAllIdCours=()=>{
        let theEtudiant = this.props.etudiants.find(etudiant=>etudiant.idEtudiant===this.state.idEtudiant)
        let theClasse =this.props.classes.find(classe=>classe.idClasse===theEtudiant.idClasse)
        theClasse=theClasse.idClasse
        let cours = this.props.cours.filter(cour=>cour.classe.includes(theClasse))
        return cours.map(cour=>cour.idCour)
    }

    getAllDueDevoirs=()=>{
        let subjectIDs=this.getAllIdCours()
        let devoirs = subjectIDs.map(idSubject=>this.props.evaluations.filter(evaluation=>evaluation.idCour===idSubject && new Date(evaluation.deadLine)>=new Date() && evaluation.idTypeEvaluation===3))
        let theDevoirs = []
        devoirs.map(subjectDevoir=>subjectDevoir.map(devoir=>theDevoirs.push(devoir)))
        return theDevoirs
    }

    onContinuerClick=(e)=>{
        
         this.setState({idEvaluation:e.target.id.split('_')[1]})
         let copie = this.props.copies.find(copie=>copie.idEvaluation===e.target.id.split('_')[1] && copie.idEtudiant===this.state.idEtudiant && copie.idTypeEvaluation===3)
         this.setState({newPropositions:copie.propositions})
        /*
            1. get the copie with idEvaluation and idEtudiant equal to this.state.idEvaluation and this.state.idEtudiant
            2. get the propositions of this copie and put them in this.state.newPropositions
            3. get the evaluation with id this.state.idEvaluation
            4. display the questions and the corresponding propositions that exist.
        */
    }

    onDoClick=(e)=>{
        this.setState({idEvaluation:e.target.id.split('_')[1]})
        /*
            1. get the evaluation with id this.state.idEvaluation
            2. display the questions
        */
    }

    handlePropositionChange=(e)=>{
        let questionProp = this.state.newPropositions.find(proposition=>proposition.index===Number(e.target.id.split('_')[1]))
        questionProp = questionProp!==undefined?questionProp:{index:Number(e.target.id.split('_')[1]), proposition:'', score:0}
        questionProp.proposition=e.target.value;
        let tempProps =this.state.newPropositions.filter(proposition=>proposition.index!==Number(e.target.id.split('_')[1]))
        tempProps.push(questionProp)
        console.log(e.target.value)
        console.log(tempProps)
        this.setState({newPropositions:tempProps})
    }

    displayQuestions=()=>{
        if(this.state.idEvaluation!==''){
            let evaluation = this.props.evaluations.find(evaluatn=>evaluatn.idEvaluation===this.state.idEvaluation)
            let index = 0
            let theQuestions = evaluation.questions.map(question=>{
                let optionIndex=0
                let questionType = this.props.typeQuestions.find(typeQuestion=>typeQuestion.idTypeQuestion===Number(question.idTypeQuestion)).nomTypeQuestion
                let questionProposition = this.state.newPropositions!==undefined?this.state.newPropositions.find(proposition=>proposition.index===question.index):undefined
                questionProposition= questionProposition!==undefined?(questionProposition.proposition):''
                return(
                    <div className="askedQuestion" key={question.index}>
                        <span className='askedQuestionHeader'>Question {question.index}</span>
                        <span className='askedQuestionIndications'>{question.indications}</span>
                        <span className='askedQuestionIndications'>{question.question}</span>
                        {/* upload and image and display here on a 100 x 100 scale if there is a ref to this question */}
                        {question.refFiles.map((id,i)=><img key={i} src={"https://tranquil-thicket-81941.herokuapp.com/teacher/questionnaire/image/"+id} style={{height: "100px",width: "100px"}} alt="uploaded"/>)}
                        
                      {questionType==='QCM'?(
                            <form  className="displayOptions">
                                {question.options.map(option=>(
                                    <label htmlFor={'option_'+question.index+'_'+optionIndex} key={optionIndex}>
                                        <input type='radio' onChange={this.handlePropositionChange} id={'option_'+question.index+'_'+optionIndex} key={optionIndex++} name={'question_'+question.index} value={option} checked={questionProposition===option} />
                                        {option}
                                    </label>
                                ))}
                            </form>
                        ):(
                            <textarea className='askedQuestionAnswer' id={'option_'+question.index+'_'+optionIndex} onChange={this.handlePropositionChange} placeholder='Entrez la reponse' value={questionProposition} />
                        )
                        }
                    </div>
                )
            })
            return theQuestions
        }else return null
    }
    handleCancelClick=(e)=>{
        this.setState({idEvaluation:'', newPropositions:[]})
    }

    onSaveClick=(e)=>{
        let { id, value } = e.target;
        this.setState({idEvaluation:this.state.idEvaluation?this.state.idEvaluation:id.split('_')[1]},()=>{
        let findCopie = this.props.copies.find(copie=>copie.idEvaluation === this.state.idEvaluation && copie.idEtudiant===this.state.idEtudiant && copie.idTypeEvaluation===3)
        console.log(11,this.state)
        if(findCopie!==undefined){
            findCopie.propositions=this.state.newPropositions.length>0?this.state.newPropositions:findCopie.propositions
            findCopie.submitted=id.split('_')[0]==='sendCopie'
            findCopie.doneMarking=false
            /*
                being here means that the copie exist. so just update the copie's propositions

                1. change the copie with idCopie: findCopie.idCopie with findCopie
            */
             fetch(`https://tranquil-thicket-81941.herokuapp.com/student/compos/examen/${findCopie.idCopie}/update`, {
                         method: 'put',
                         headers: {'Content-Type': 'application/json','x-access-token':window.localStorage.getItem("token")},
                         body: JSON.stringify({
                            copie: findCopie
                         })
                       })
                       .then(response=>response.json())
                       .then(data=>{
                         if(data.message){
                             alert('Successfull')
                             console.log(data.message)
                            this.props.dispatch({type: "UPDATE_COPIE", payload: {
                                idCopie:data.message._id, 
                                idEvaluation:data.message.idEvaluation, 
                                idEtudiant:data.message.idEtudiant,  
                                dateRemis:data.message.dateRemis, 
                                idTypeEvaluation:Number(data.message.idTypeEvaluation), 
                                propositions:data.message.propositions,
                                submitted:data.message.submitted,
                                doneMarking: false
                            }})
                         }
                         else{
                            alert('Failed')
                           console.log(data)
                         }
                       })
                       .catch(error=>{
                            alert('Failed');
                            console.log(error);
                        }) 

            console.log(findCopie)
        }else{
            let toBeUploadedCopie = {
                idEvaluation:(id.split('_')[1])?id.split('_')[1]:this.state.idEvaluation,
                idEtudiant:this.state.idEtudiant,
                dateRemis:new Date().toDateString(),
                idTypeEvaluation: 3,
                propositions:this.state.newPropositions,
                submitted:id.split('_')[0]==='sendCopie',
                doneMarking: false
            }
            /*
                being here means that the copie doesn't exist. so we need to create a new copie.
                
                1. the new copie to be created is toBeUploadedCopie
            */
            console.log("hello",toBeUploadedCopie,this.state,id)
            fetch(`https://tranquil-thicket-81941.herokuapp.com/student/compos/examen/new`, {
                         method: 'post',
                         headers: {'Content-Type': 'application/json','x-access-token':window.localStorage.getItem("token")},
                         body: JSON.stringify({
                            copie: toBeUploadedCopie
                         })
                       })
                       .then(response=>response.json())
                       .then(data=>{
                         if(data.message){
                             alert('Successfull')
                             console.log(data.message)
                            this.props.dispatch({type: "CREATE_COPIE", payload: [{
                                idCopie:data.message._id, 
                                idEvaluation:data.message.idEvaluation, 
                                idEtudiant:data.message.idEtudiant,  
                                dateRemis:data.message.dateRemis, 
                                idTypeEvaluation:Number(data.message.idTypeEvaluation), 
                                propositions:data.message.propositions,
                                submitted:data.message.submitted,
                                doneMarking: false
                            }]})
                         }
                         else{
                            alert('Failed')
                           console.log(data)
                         }
                       })
                       .catch(error=>{
                            alert('Failed');
                            console.log(error);
                        }) 
        }
        this.setState({newPropositions:[], idEvaluation:''})

        })
    }


    styleAllDevoirs=()=>{
        let devoirs = this.getAllDueDevoirs()
        return devoirs.map((devoir,i)=>{
            let nomCour= this.props.cours.find(cour=>cour.idCour===devoir.idCour).nomCours
            let dateLimite = new Date(devoir.deadLine).toDateString()
            let brouillon = this.props.copies.find(copie=>copie.idEvaluation===devoir.idEvaluation && copie.idEtudiant===this.state.idEtudiant && copie.idTypeEvaluation===3)
            let display = brouillon!==undefined?(brouillon.submitted):null
            brouillon = brouillon!==undefined?('brouillon'):null
            return display?null:(
                <div className="styledDevoir" key={devoir.idEvaluation}>
                    <div className="styledDevoirHeader">
                        <span className='devoirTitreCours'>{nomCour}</span>
                        <span className='devoirBrouillon'>{brouillon}</span>
                    </div>
                    <span className='devoirDeadline'>Delai: {dateLimite}</span>
                    <div className="devoirActionBtns">
                        {this.state.idEvaluation===devoir.idEvaluation?<button className='devoirFaire' id='saveCopie' onClick={this.onSaveClick}>Save</button>:(
                            brouillon==='brouillon'?<button className='devoirFaire' id={'devoir_'+devoir.idEvaluation} onClick={this.onContinuerClick}>Continuer</button>:<button onClick={this.onDoClick} id={'devoir_'+devoir.idEvaluation} className='devoirFaire'>Faire</button>)}
                        {this.state.idEvaluation===devoir.idEvaluation?<button className='devoirEnvoyer' onClick={this.handleCancelClick}>Cancel</button>:<button className='devoirEnvoyer' id={'sendCopie_'+devoir.idEvaluation} onClick={this.onSaveClick}>Envoyer</button>}
                    </div>
                </div>
            )
        })
    }

    onChange=(e)=>{
        let daet = document.getElementById('date').value
        daet = daet.split('-')
        let time = document.getElementById('time').value
        time= time.split(':')
        let dateTime = new Date(daet[0],daet[1],daet[2],time[0],time[1])
        dateTime=dateTime+''
        dateTime=dateTime.split(' G')[0]
    }
    componentDidMount() {
        fetch('https://tranquil-thicket-81941.herokuapp.com/student/compos/examen', {
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
                const evaluations = data.message.evaluations.map(evaluation=> {
                    return {
                        idEvaluation:evaluation._id, 
                        idPersonnel:evaluation.idPersonnel, 
                        idCour:evaluation.idCour, 
                        duree:evaluation.duree, 
                        deadLine:evaluation.deadLine, 
                        dateTime:evaluation.dateTime, 
                        idTypeEvaluation:evaluation.idTypeEvaluation, 
                        questions:evaluation.questions,
                        published:evaluation.published
                    }
                  })
                const copies = data.message.copies.map(copie=> {
                    return {
                        idCopie:copie._id, 
                        idEvaluation:copie.idEvaluation, 
                        idEtudiant:copie.idEtudiant,  
                        dateRemis:copie.dateRemis, 
                        idTypeEvaluation:copie.idTypeEvaluation, 
                        propositions:copie.propositions,
                        submitted:copie.submitted,
                        doneMarking:copie.doneMarking
                    }
                  })
                this.props.dispatch({type: "CREATE_ETUDIANT", payload: student})
                this.props.dispatch({type: "LOAD_CLASSE", payload: classes})
                this.props.dispatch({type: "LOAD_COUR", payload: cours})
                this.props.dispatch({type: "CREATE_EVALUATION", payload: evaluations})
                this.props.dispatch({type: "CREATE_COPIE", payload: copies})
                this.setState({idEtudiant:parseJwt(window.localStorage.getItem('token')).user._id})
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
                {this.styleAllDevoirs().length!==0?this.styleAllDevoirs:"Pas de devoir a faire"}
                {this.displayQuestions()}
            </Hoc>
            }
            </div>
        )
    }
}

const mapStateToProps=(state)=>{
    return {
        etudiants: state.Etudiant.etudiants,
        evaluations: state.Evaluation.evaluations,
        cours: state.Cour.cours,
        classes: state.Classe.classes,
        copies: state.Copie.copies,
        typeQuestions: state.TypeQuestion.typeQuestions
    }
}

export default connect(mapStateToProps)(Devoir)