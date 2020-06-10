import React, { Component } from 'react';
import { connect } from 'react-redux';

import parseJwt from '../shared/utils/parseJwt.js'
import getClassNameFromId from '../shared/utils/getClassNameFromId'

import './Questionnaire.css';
import TeacherNav from '../shared/UIElements/TeacherNav.jsx';
import CoordoNav from '../shared/UIElements/CoordoNav.jsx';

class Questionnaire extends Component {
    state={
        idConnectedPersonnel:null,

        concernedSubject:'',
        concernedTypeEvaluation:'',
        newEvaluation:false,
        optionInput:'',
        mark:2,
        new:true,
        refFiles:[],

        editableEvaluation:{idEvaluation:'', idPersonnel:'', idCour:'', dateTime:"", deadline:"", duree:'', idTypeEvaluation:'', questions:[], published:false},
    }

    newEvaluation={idEvaluation:'', idPersonnel:'', idCour:'', duree:'', idTypeEvaluation:'', questions:[], published:false}

    handleCreerEvaluation=()=>{
        let newEvaluation = {...this.state.editableEvaluation, idCour:this.state.concernedSubject, idTypeEvaluation:1}
        this.setState({editableEvaluation:newEvaluation})
    }
    addIndexesToQuestions=(evaluation)=>{
        let index=1
        let tempQuestions = evaluation.questions.map(question=>{
            question.index=index++
            return question
        })
        evaluation.questions = tempQuestions
        return evaluation
    }
    handleSaveEvaluation=()=>{
        if(this.state.editableEvaluation.idTypeEvaluation!==3){
            if(new Date(this.state.editableEvaluation.dateTime).toString()!=='Invalid Date' && this.state.editableEvaluation.duree!==''){
                let evaluationToCreate={...this.state.editableEvaluation, idPersonnel: this.state.idConnectedPersonnel}
                delete evaluationToCreate.idEvaluation

                console.log(evaluationToCreate)
                fetch(`https://tranquil-thicket-81941.herokuapp.com/teacher/questionnaire/new`, {
                                method: 'post',
                                headers: {'Content-Type': 'application/json','x-access-token':window.localStorage.getItem("token")},
                                body: JSON.stringify({
                                    evaluation: this.addIndexesToQuestions(evaluationToCreate),
                                    startDate: Date.now()
                                })
                            })
                            .then(response=>response.json())
                            .then(data=>{
                                if(data.message){
                                    alert('successfully saved the questionnaire')
                                    console.log(data.message)
                                    const evaluation = [data.message].map(evaluation=> {
                                            return {
                                                idEvaluation:evaluation._id, 
                                                idPersonnel:evaluation.idPersonnel, 
                                                idCour:evaluation.idCour, 
                                                duree:evaluation.duree, 
                                                idTypeEvaluation:evaluation.idTypeEvaluation, 
                                                questions:evaluation.questions,
                                                published:evaluation.published,
                                                dateTime:evaluation.dateTime,
                                                deadline:evaluation.deadline
                                            }
                                        })
                                    this.props.dispatch({type: "CREATE_EVALUATION", payload: evaluation })
                                }
                                else{
                                    alert('Failed to save the questionnaire')
                                console.log(data)
                                }
                            })
                            .catch(error=>{
                                    alert('Failed to save the questionnaire');
                                    console.log(error);
                                }) 
                console.log("evaluationToCreate",evaluationToCreate)
                this.setState({editableEvaluation:this.newEvaluation})
            }else alert('invalid date or time or duree verify and submit again')
        }else{
            if(this.state.editableEvaluation.deadline!==''){
                let evaluationToCreate={...this.state.editableEvaluation, idPersonnel: this.state.idConnectedPersonnel}
                delete evaluationToCreate.idEvaluation

                console.log(evaluationToCreate)
                fetch(`https://tranquil-thicket-81941.herokuapp.com/teacher/questionnaire/new`, {
                                method: 'post',
                                headers: {'Content-Type': 'application/json','x-access-token':window.localStorage.getItem("token")},
                                body: JSON.stringify({
                                    evaluation: this.addIndexesToQuestions(evaluationToCreate),
                                    startDate: Date.now()
                                })
                            })
                            .then(response=>response.json())
                            .then(data=>{
                                if(data.message){
                                    alert('successfully saved the questionnaire')
                                    console.log(data.message)
                                    const evaluation = [data.message].map(evaluation=> {
                                            return {
                                                idEvaluation:evaluation._id, 
                                                idPersonnel:evaluation.idPersonnel, 
                                                idCour:evaluation.idCour, 
                                                duree:evaluation.duree, 
                                                idTypeEvaluation:evaluation.idTypeEvaluation, 
                                                questions:evaluation.questions,
                                                published:evaluation.published,
                                                dateTime:evaluation.dateTime,
                                                deadline:evaluation.deadline
                                            }
                                        })
                                    this.props.dispatch({type: "CREATE_EVALUATION", payload: evaluation })
                                }
                                else{
                                    alert('Failed to save the questionnaire')
                                console.log(data)
                                }
                            })
                            .catch(error=>{
                                    alert('Failed to save the questionnaire');
                                    console.log(error);
                                }) 
                console.log("evaluationToCreate",evaluationToCreate)
                this.setState({editableEvaluation:this.newEvaluation})
            }else alert('invalid date limite verify and try again')
        }
    }

    handleEvaluationTypeChange=(e)=>{
        let newEvaluation = {...this.state.editableEvaluation, idTypeEvaluation:Number(e.target.value)}
        this.setState({editableEvaluation:newEvaluation})
    }

    handleDureeChange=(e)=>{
        if(e.target.id==='date'||e.target.id==='time'){
            let date = new Date(document.getElementById('date').value).toDateString()
            let time = document.getElementById('time').value+':00'
            let dateTime=date+' '+time

            console.log(dateTime)
            let newEvaluation = {...this.state.editableEvaluation, dateTime:dateTime}
            this.setState({editableEvaluation:newEvaluation})
        }else{
            let newEvaluation = {...this.state.editableEvaluation, [e.target.id]:e.target.value}
            this.setState({editableEvaluation:newEvaluation})
        }
    }
    
    handleTimeFocus=(e)=>{
        document.getElementById(e.target.id).setAttribute('type', 'time')
    }

    handleDateFocus=(e)=>{
        document.getElementById(e.target.id).setAttribute('type', 'date')
    }

    handleTimeBlur=(e)=>{
        document.getElementById(e.target.id).setAttribute('type', 'text')
    }

    createNewEvaluation=()=>{
        if(this.state.concernedSubject!==''){
            return this.state.editableEvaluation.idCour===''?<input type='button' className='newEvaluationBtn' value='Nouvelle Evaluation' onClick={this.handleCreerEvaluation} />
            :(this.state.editableEvaluation.idCour!=='' && this.state.editableEvaluation.idEvaluation==='')?(
                <div className='newEvaluationHeader'>
                    <input type='button' onClick={this.handleSaveEvaluation} className='newEvaluationBtn' value='Save evaluation' id={'saveEvaluation'} />
                    <select className='QuestionnaireChooseExamType' onChange={this.handleEvaluationTypeChange}>
                        {<option hidden value=''>{this.props.typeEvaluations.find(type=>type.idTypeEvaluation===1).nomTypeEvaluation}</option>}
                        {this.props.typeEvaluations.map(evaluationType=><option key={evaluationType.idTypeEvaluation} value={evaluationType.idTypeEvaluation}>{evaluationType.nomTypeEvaluation}</option>)}
                    </select>

                    {this.state.editableEvaluation.idTypeEvaluation!==3?(<div className="questionnaireDureeHolder">
                            <input type='text' id='date' onFocus={this.handleDateFocus} onBlur={this.handleTimeBlur} onChange={this.handleDureeChange} placeholder='Date' />
                            <input type='text' id='time'  onFocus={this.handleTimeFocus} onBlur={this.handleTimeBlur} onChange={this.handleDureeChange} placeholder="L'heure HH:MM" />
                            <input type='text' id='duree' onFocus={this.handleTimeFocus} onBlur={this.handleTimeBlur}  onChange={this.handleDureeChange} placeholder='Duree HH:MM' />
                        </div>):<input type='text' id='deadline' onFocus={this.handleDateFocus} onBlur={this.handleTimeBlur} placeholder='Date limite' onChange={this.handleDureeChange} />}
                    {console.log(this.state.editableEvaluation.idTypeEvaluation)}
                </div>
            ):<input type='button' className='QuestionnaireSaveBtn' onClick={()=>this.handleSaveClick(this.state.editableEvaluation)} value='Save' id={'save'} />
        }
    }

    handleOpenClick=(e)=>{
        let idEditableEvaluation = e.target.id.split('_')[0]
        let getEditableEvaluation = this.props.evaluations.find(evaluation=>evaluation.idEvaluation===idEditableEvaluation)

        this.setState({editableEvaluation:getEditableEvaluation})
    }

    handleCancelClick=()=>{
        this.setState({editableEvaluation:this.newEvaluation})
    }

    handleDeleteClick=(e)=>{
        let idDeleteObject = e.target.id.split('_')[0]
        console.log(idDeleteObject)
        fetch(`https://tranquil-thicket-81941.herokuapp.com/teacher/questionnaire/${idDeleteObject}/delete`, {
            method: 'delete',
            headers: {'Content-Type': 'application/json','x-access-token':window.localStorage.getItem("token")}
          })
          .then(response=>response.json())
          .then(data=>{
            console.log("backend",data.message)
            if(data.message){
              this.props.dispatch({type: "DELETE_EVALUATION", payload: idDeleteObject})
              alert('Evaluation deleted.')
            }
            else{
              console.log(data)
            }
          })
          .catch(error=>console.log(error))     
    }
    
    handleSaveClick=(evalx)=>{
        /*
            In the evaluation collection, the object to update(save) has idEvaluation: this.state.editableEvaluation.idEvaluation
            and it is to be updated with the object: this.state.editableEvaluation
        */
        const evaluation = {...evalx};
        delete evaluation.idEvaluation
         fetch(`https://tranquil-thicket-81941.herokuapp.com/teacher/questionnaire/${evalx.idEvaluation}/update`, {
                         method: 'put',
                         headers: {'Content-Type': 'application/json','x-access-token':window.localStorage.getItem("token")},
                         body: JSON.stringify({
                            evaluation: this.addIndexesToQuestions(evaluation)
                         })
                       })
                       .then(response=>response.json())
                       .then(data=>{
                         if(data.message){
                             alert(`${evalx.published?"Publised":"Saved"} the Changes made to Evaluation`)
                             console.log(data.message)
                            this.props.dispatch({type: "UPDATE_EVALUATION", payload: this.addIndexesToQuestions(evalx)})
                         }
                         else{
                           console.log(data)
                         }
                       })
                       .catch(error=>console.log(error)) 
        console.log("handlesaveclick",evalx)
       this.setState({editableEvaluation:this.newEvaluation})
    }

    handlePublierClick=(e)=>{
        let idToBePublishedObject = e.target.id.split('_')[0]
        let toBePublishedObject= this.props.evaluations.find(evaluation=>evaluation.idEvaluation===idToBePublishedObject)
        toBePublishedObject ={...toBePublishedObject, published:true}
        /*
        In the evaluation collection, the item to be puslished has id: idToBePublishedObject
        
        publishing an evaluation is based on the typeEvaluation. if it is a devoir, then it will be published in the devoir collection else it will be published in the epreuve collection.
        
        the publishing will be done in a transaction. i.e. writing to the evaluation and epreuve/devoir collection should either all succeed or all fail.
        */
        this.handleSaveClick(toBePublishedObject)
        
    }

    handleSelectChange=(e)=>{
        console.log(e.target.id,e.target.value)
        this.setState({[e.target.id]:e.target.value})
    }

    getToughtSubjects=()=>{
        let cours = this.props.cours.filter(cour=>cour.nomEnseignant===this.state.idConnectedPersonnel).sort((a,b)=>a.nomCours>b.nomCours?1:-1)
        cours = cours.map(cour=><option key={cour.codeCours} value={cour.idCour}>{cour.nomCours}</option>)

        return (
            <select id='concernedSubject' onChange={this.handleSelectChange}>
                <option hidden value=''>Choisir une matiere</option>
                {cours}
            </select>
        )
    }

    getTypeEvaluations=()=>{
        let typeEvaluations = this.props.typeEvaluations.sort((a,b)=>a.nomTypeEvaluation>b.nomTypeEvaluation?1:-1).map(typeEvaluation=>(
        <option key={typeEvaluation.idTypeEvaluation} value={typeEvaluation.idTypeEvaluation+'_'+typeEvaluation.nomTypeEvaluation}>{typeEvaluation.nomTypeEvaluation}</option>
        ))
        console.log(typeEvaluations)
        return (
            <select id='concernedTypeEvaluation' onChange={this.handleSelectChange}>
                <option hidden value=''>Type Evaluation</option>
                {typeEvaluations}
            </select>
        )
    }

    showConcernedClasses=()=>this.props.cours.find(cour=>cour.idCour===this.state.concernedSubject).classe.map(nomClasse=><span key={nomClasse}>{getClassNameFromId(nomClasse,this.props.classes)}</span>)

    getSubjectEvaluation=()=>this.props.evaluations.filter(evaluation=>evaluation.idCour===this.state.concernedSubject)

    showEvaluationList=()=>{
        let evaluationList=this.getSubjectEvaluation().sort((a,b)=>a.idTypeEvaluation>b.idTypeEvaluation?1:-1)
        console.log("evaluationList",evaluationList,this.state.editableEvaluation)
        return evaluationList.map(evaluation=>{
            let subject = this.props.cours.find(cour=>cour.idCour===evaluation.idCour)

            return <div className='evaluationListElement' key={evaluation.idEvaluation}>
                <span>{subject.nomCours}</span>
                <span>{this.showConcernedClasses()}</span>
                <span>{this.props.typeEvaluations.find(typeEvaluation=>typeEvaluation.idTypeEvaluation===evaluation.idTypeEvaluation).nomTypeEvaluation}</span>
                {this.state.editableEvaluation.idEvaluation===evaluation.idEvaluation?(
                    <span className="actionBtns">
                        <input type='button' onClick={()=>this.handleSaveClick(this.state.editableEvaluation)} value='Save' id={evaluation.idEvaluation+'save'} />
                        <input type='button' onClick={this.handleCancelClick} value='Cancel' id={evaluation.idEvaluation+'cancel'} />
                    </span>
                ):(
                    <span className="actionBtns">
                        <input onClick={this.handleOpenClick} type='button' value='Open' id={evaluation.idEvaluation+'_open'}/>
                        <input onClick={this.handleDeleteClick} type='button' value='Delete' id={evaluation.idEvaluation+'_delete'} />
                        {evaluation.published?<input type='button' value='published' disabled />:<input onClick={this.handlePublierClick} type='button' value='Publier' id={evaluation.idEvaluation+'_publier'} />}
                    </span>
                )}
            </div>
        })
    }

    handleToggleDate=()=>{
        let element = document.getElementById('deadLine')
        if(element.type==='text'){
            element.type='date'
        }else element.type='text'
    }

    
    removeOption=(option, questionIndex)=>{
        console.log(questionIndex)
        let newOptions = this.state.editableEvaluation.questions[questionIndex-1].options.filter(anOption=>anOption!==option)
        let newQuestion = {...this.state.editableEvaluation.questions[questionIndex-1], options:newOptions}
        let newQuestions = [...this.state.editableEvaluation.questions]
        newQuestions[questionIndex-1]=newQuestion
        let newEvaluation = {...this.state.editableEvaluation, questions:newQuestions}
        // console.log(newEvaluation)
        this.setState({editableEvaluation:newEvaluation})
    }

    addOption=(e)=>{
        let questionIndex = Number(e.target.id.split('_')[0])
        let optionIndex = Number(this.state.optionInput.split('_')[0])
        if(this.state.optionInput!=='' && (optionIndex===questionIndex)){
            let newOptions = this.state.editableEvaluation.questions[questionIndex-1].options
            newOptions.push(this.state.optionInput.split('_')[1])
            let newQuestion = {...this.state.editableEvaluation.questions[questionIndex-1], options:newOptions}
            let newQuestions = [...this.state.editableEvaluation.questions]
            newQuestions[questionIndex-1]=newQuestion
            let newEvaluation = { ...this.state.editableEvaluation, questions:newQuestions }
            // console.log(newEvaluation)
            this.setState({editableEvaluation:newEvaluation, optionInput:''})
            document.getElementById(e.target.id.split('_')[0]+'_optionInput').value=''
        }else alert('Enter a valid option. the option is empty')
    }

    showOptions = (options, questionIndex) =>{
        return options.map(option => (
            <div className="tagged" key={option}>
                {option}<i className='fa fa-close' onClick={()=>this.removeOption(option, questionIndex)} />
            </div>
        ))
    }

    handleMarkChange=(e)=>{
        let questionIndex = Number(e.target.id.split('_')[0])
        let newMark = Number(e.target.value)
        let newQuestion = {...this.state.editableEvaluation.questions[questionIndex-1], mark:newMark}
        let newQuestions = [...this.state.editableEvaluation.questions]
        newQuestions[questionIndex-1]=newQuestion
        let newEvaluation = {...this.state.editableEvaluation, questions:newQuestions}
        // console.log(newEvaluation)

        this.setState({editableEvaluation:newEvaluation})
    }

    handleOptionInputChange=(e)=>{
        this.setState({[e.target.id.split('_')[1]]:e.target.id.split('_')[0]+'_'+e.target.value})
    }

    handleTextareaChange=(e)=>{
        let questionIndex = Number(e.target.id.split('_')[0])
        let textarea=e.target.id.split('_')[1]

        let newQuestion = {...this.state.editableEvaluation.questions[questionIndex-1], [textarea]:e.target.value}
        let newQuestions = [...this.state.editableEvaluation.questions]
        newQuestions[questionIndex-1]=newQuestion
        let newEvaluation = {...this.state.editableEvaluation, questions:newQuestions}
        this.setState({editableEvaluation:newEvaluation})
    }
    fileChanged= async (e)=> {
        let questionIndex = Number(e.target.id.split('_')[0])
        const files = Array.from(e.target.files);
        let Fd = new FormData();
        files.forEach(file=>Fd.append('files',file))
        console.log(...Fd)

        let data = await fetch('https://tranquil-thicket-81941.herokuapp.com/teacher/questionnaire/upload', {
                         method: 'post',
                         // headers: {'x-access-token':window.localStorage.getItem("token")},
                         body: Fd
                       })
        data = await data.json()
        console.log(data)
        
        if(data.error) return alert('Something went wrong!')
        
        let newQuestion = {...this.state.editableEvaluation.questions[questionIndex-1], refFiles: data.files}
        let newQuestions = [...this.state.editableEvaluation.questions]
        newQuestions[questionIndex-1]=newQuestion
        let newEvaluation = {...this.state.editableEvaluation, questions:newQuestions}
        console.log(newEvaluation)
        this.setState({editableEvaluation:newEvaluation},()=>console.log("fileChanged",this.state.editableEvaluation))
    }
    handleDisplayQuestions=()=>{
        if(this.state.editableEvaluation.idCour!==''){
            let index=0
            let theQuestions = this.state.editableEvaluation.questions.map(question=>{
                let questionType=this.props.typeQuestions.find(typeQuestion=>typeQuestion.idTypeQuestion===Number(question.idTypeQuestion)).nomTypeQuestion
                return <div className="question" key={++index}>
                    <div className='questionHeader'>
                        <span>Question {' '+index}</span>
                        <select id={index+'_idTypeQuestion'} onChange={this.handleTextareaChange}>
                            <option hidden>{questionType}</option>
                            {this.props.typeQuestions.map(questionType=>(<option key={questionType.idTypeQuestion} value={questionType.idTypeQuestion}>{questionType.nomTypeQuestion}</option>))}
                        </select>
                    </div>
                    <textarea className='indications' placeholder='Indications' id={index+'_indications'} onChange={this.handleTextareaChange} value={question.indications} />
                    <textarea className='theQuestion' placeholder='Entrer la question' id={index+'_question'} onChange={this.handleTextareaChange} value={question.question} />
                    {/* Upload and image and display the image on a 100 x 100 format here */}
                    <div>
                        <input type="file" accept="image/jpeg,image/jpg,image/png,image/pneg" id={index+'_filesInput'} onChange={(e)=>this.fileChanged(e)} multiple/>
                        <br/>
                        {this.state.editableEvaluation.questions.length?
                            this.state.editableEvaluation.questions[index-1].refFiles.map((id,i)=><img key={i} src={"https://tranquil-thicket-81941.herokuapp.com/teacher/questionnaire/image/"+id} style={{height: "100px",width: "100px"}} alt="uploaded"/>)
                        :null}
                    </div>
                    <textarea className='answer' id={index+'_answer'} onChange={this.handleTextareaChange}placeholder='Entrer la repose a cette question' value={question.answer} />
                    {
                        questionType==='QCM'?(
                            <div className='taggedInput'>
                                {this.showOptions(question.options, index)}
                                <input className="option" id={index+'_optionInput'} required onChange={this.handleOptionInputChange} placeholder="Entrez l'option" type='text' /><br />
                                <input type='button' id={index+'_validerBtn'} onClick={(e) => this.addOption(e)} className='newOption' value='Valider' />
                            </div>
                        ):null
                    }
                    <input type='number' id={index+'_markInput'} value={question.mark===0?'':question.mark} placeholder='/pts' min={0} max={20} onChange={(e) => this.handleMarkChange(e)} />
                </div>
            })

            return (
                <div  className='QuestionnaireDisplayQuestionsOverallHolder'>
                    {theQuestions}
                    {this.addNewQuestion()}
                </div>

            )
        }
    }

    handleAddNewQuestion=()=>{
        let questionObject = {index:'', idTypeQuestion:1, indications:'', question:'', options:[], answer:'', refFiles:[], mark:0}
        let newQuestions = this.state.editableEvaluation.questions
        newQuestions.push(questionObject)
        let newEvaluation = {...this.state.editableEvaluation, questions:newQuestions}
        this.setState({editableEvaluation:newEvaluation})

    }

    addNewQuestion=()=><i className='fa fa-plus-circle' onClick={this.handleAddNewQuestion} />
    componentDidMount(){
        fetch('https://tranquil-thicket-81941.herokuapp.com/teacher/questionnaire/evaluation-classes-courses', {
            method: 'get',
            headers: {'Content-Type': 'application/json','x-access-token':window.localStorage.getItem("token")}
          })
          .then(response=>response.json())
          .then(data=>{
            if(data.message){
                console.log(data.message)
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
                const evaluations = data.message.evaluations.map(evaluation=> {
                    return {
                        idEvaluation:evaluation._id, 
                        idPersonnel:evaluation.idPersonnel, 
                        idCour:evaluation.idCour, 
                        duree:evaluation.duree, 
                        idTypeEvaluation:evaluation.idTypeEvaluation, 
                        questions:evaluation.questions,
                        published:evaluation.published,
                        dateTime:evaluation.dateTime,
                        deadline:evaluation.deadline
                    }
                  })
                  const cours = data.message.courses.map(cour=>{return{
                    idCour:cour._id,
                    classe: cour.classes,
                    nomCours: cour.nomCour,
                    codeCours: cour.codeCour,
                    nomEnseignant: cour.idEnseignant,
                }})

                this.props.dispatch({type: "LOAD_CLASSE", payload: classes})
                this.props.dispatch({type: "LOAD_COUR", payload: cours})
                this.props.dispatch({type: "CREATE_EVALUATION", payload: evaluations})
                this.setState({idConnectedPersonnel:parseJwt(window.localStorage.getItem('token')).user._id})
            }
            else{
              console.log(data)
            }
          })
          .catch(error=>console.log(error))      
    }
    render() {
        console.log("Props, state",this.state,this.props)
        return (
            <div>
                {parseJwt(window.localStorage.getItem('token')).user.role==='coordonateur'?<CoordoNav />:<TeacherNav />}
                <div className='QuestionnaireOverallHolder'>
                    {this.getToughtSubjects()}
                    {this.state.concernedSubject!==''?
                    <div className="chosenSubject">
                        <span>{this.showConcernedClasses()}</span>
                        <div className='evaluationListHolder'>{this.showEvaluationList()}</div>
                    </div>:null}
                    {this.createNewEvaluation()}
                    {this.handleDisplayQuestions()}
                </div>
            </div>
        )
    }
}

const mapStateToProps=(state)=>{
    return{
        typeEvaluations: state.TypeEvaluation.typeEvaluations,
        classes: state.Classe.classes,
        evaluations: state.Evaluation.evaluations,
        cours: state.Cour.cours,
        typeQuestions: state.TypeQuestion.typeQuestions
    }
}

export default connect(mapStateToProps)(Questionnaire)
//you haven't handle dateTime, deadline, duree