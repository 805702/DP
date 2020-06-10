import React, { Component } from 'react'
import { connect } from 'react-redux'

import Hoc from '../shared/utils/hoc.js'
import parseJwt from '../shared/utils/parseJwt.js'

import './Examen.css'
import StudentNav from '../shared/UIElements/StudentNav.jsx'

class Examen extends Component {
    state={
        idEtudiant:null,
        idEvaluation:'',
        newPropositions:[],
        questionOrder:[],
        composer:false
    }

    componentDidMount() {
        this.interval = setInterval(() => this.setState({ time: Date.now() }), 1000);

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
                        submitted:copie.submitted
                    }
                  })
                this.props.dispatch({type: "CREATE_ETUDIANT", payload: student})
                this.props.dispatch({type: "LOAD_CLASSE", payload: classes})
                this.props.dispatch({type: "LOAD_COUR", payload: cours})
                this.props.dispatch({type: "CREATE_EVALUATION", payload: evaluations})
                this.props.dispatch({type: "CREATE_COPIE", payload: copies})
                this.setState({idEtudiant:parseJwt(window.localStorage.getItem('token')).user._id})
        console.log("passing here 1")
            }
            else{
              console.log(data)
            }
          })
          .catch(error=>console.log(error))      
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    getAllIdCours=()=>{
        let theEtudiant = this.props.etudiants.find(etudiant=>etudiant.idEtudiant===this.state.idEtudiant)
        let theClasse =this.props.classes.find(classe=>classe.idClasse===theEtudiant.idClasse)
        let cours = this.props.cours.filter(cour=>cour.classe.includes(theClasse.idClasse))
        return cours.map(cour=>cour.idCour)
    }

    timeToMins=(time)=>{
        var b = time.split(':');
        return b[0]*60 + +b[1];
      }
      
      // Convert minutes to a time in format hh:mm
      // Returned value is in range 00  to 24 hrs
      timeFromMins=(mins)=> {
        function z(n){return (n<0?'':(n<10)?'0':'') + n;}
        var h = (mins/60 |0) % 24;
        var m = mins % 60;
        return z(h) + ':' + z(m);
      }
      
      // Add two times in hh:mm format
      addTimes=(t0, t1)=>{
        return this.timeFromMins(this.timeToMins(t0) + this.timeToMins(t1));
      }
      

    getAllDueCompos=()=>{
        let subjectIDs=this.getAllIdCours()
        console.log(this.adjustGmtTime(1))
        console.log(this.props.evaluations)
        let compos = subjectIDs.map(idSubject=>this.props.evaluations.filter(evaluation=>{
            console.log(evaluation)
            if(evaluation.deadLine!==undefined && evaluation.dateTime!==''){
                let theTime = evaluation.dateTime.split(' ')[4].split(':')
                theTime=theTime[0]+':'+theTime[1]
                theTime = this.addTimes(theTime, evaluation.duree)

                let theDate = evaluation.dateTime.split(' ')
                theDate[4]=theTime
                theDate=theDate[0]+' '+theDate[1]+' '+theDate[2]+' '+theDate[3]+' '+theDate[4]
                return evaluation.idCour===idSubject && new Date(theDate)>=this.adjustGmtTime(1) && evaluation.published && evaluation.idTypeEvaluation!==3
            }else return 'none'
        }))
        let theCompos = []
        compos = compos.filter(compo=>compo!=='none')
        compos.map(subjectCompos=>subjectCompos.map(compo=>theCompos.push(compo)))
        return theCompos
    }

    //this method helps get the compos of the day that is today.
    getDayCompos=()=>{
        let compos = this.getAllDueCompos()
        compos = compos.map(compo=>{
            let compoDate = compo.dateTime.split(' ')
            compoDate.pop()
            compoDate = compoDate[0]+' '+compoDate[1]+' '+compoDate[2]+' '+compoDate[3]
            if(compoDate === this.adjustGmtTime(1).toDateString()) return compo
            else return 'none'
        })
        compos = compos.filter(compo=>compo!=='none')
        return compos[0]===undefined?[]:compos
    }

    handleComposerClick=(e)=>{
        this.setState({idEvaluation: e.target.id.split('_')[1], composer:true},()=>{
            if(this.state.questionOrder.length===0){
                let evaluation = this.props.evaluations.find(evaluatn=>evaluatn.idEvaluation===this.state.idEvaluation)
                let questionOrder =[]
                while(questionOrder.length!==evaluation.questions.length){
                    let rand = this.randomInteger(1,evaluation.questions.length)
                    if(!questionOrder.includes(rand))questionOrder.push(rand)
                }
                this.setState({questionOrder:questionOrder})
            }
        })
    }

    adjustGmtTime=(shift)=>{
        let date=new Date().toUTCString()
        date = date.split(' ')
        let time = date[4].split(':')

        let hour = Number(time[0])+shift
        if(hour>24){
            hour=hour/24
            hour = hour-Math.floor(hour)
            time[0] = Math.ceil(hour*24).toString()
        }else time[0]=hour.toString()
        time = `${time[0]}:${time[1]}:${time[2]}`
        date[4] = time

        let gmtTime = `${date[0]} ${date[1]} ${date[2]} ${date[3]} ${date[4]}`
        return new Date(gmtTime)
    }

    styleAllCompos=()=>{
        let compos = this.getDayCompos()
        return compos.map(compo=>{
            let nomCour= this.props.cours.find(cour=>cour.idCour===compo.idCour).nomCours
            let timeLeft = compo.dateTime.split(' ')[4]
            
            let now = this.adjustGmtTime(1)
            now = now+''.split(' G')[0]
            now = now.split(' ')[4]
            now = now.split(':')
            now = '-'+now[0]+':-'+now[1]

            let compoTime = compo.dateTime.split(' ')[4]
            compoTime = compoTime.split(':')
            compoTime = compoTime[0]+':'+compoTime[1]

            let checkCopie = this.props.copies.find(copie=>copie.idEtudiant===this.state.idEtudiant && copie.idEvaluation===compo.idEvaluation && copie.idTypeEvaluation===compo.idTypeEvaluation)
            //verify time left to compos
            if(checkCopie!==undefined){
                timeLeft=<span className='late'>Vous avez deja remis votre epreuve</span>
            }else if(new Date(compo.dateTime)>=this.adjustGmtTime(1)){
                timeLeft = this.addTimes(now, compoTime)
                let theSeconds = this.adjustGmtTime(1)+''
                theSeconds = theSeconds.split(' G')[0]
                theSeconds = theSeconds.split(' ')[4]
                theSeconds = 59-Number(theSeconds.split(':')[2])
                theSeconds = theSeconds<10? '0'+theSeconds:theSeconds

                let theMinutes = 0
                theMinutes = Number(timeLeft.split(':')[1])-1
                theMinutes = theMinutes<0? 0:theMinutes
                theMinutes = theMinutes<10?('0'+theMinutes):theMinutes

                timeLeft = <div className='timeleft'>
                    <span className='dans'>Dans: </span>
                    <span className='hours'>{timeLeft.split(':')[0]}H : </span>
                    <span className='minutes'>{theMinutes}M : </span>
                    <span className='seconds'>{theSeconds}S</span>
                </div>
            }else {
                //verify lateness rate(how many minutes late)
                let lateness = this.addTimes(compoTime, now)
                lateness = lateness.split(':')
                if(Number(lateness[0])===0 && Number(lateness[1])>=-15) timeLeft=<button id={'compo_'+compo.idEvaluation} className='composerBtn' onClick={this.handleComposerClick}>Composer</button>
                else timeLeft=<span className='late'>Vous etes en retard</span>
            }
            console.log(compo)
            //calculate time left to end of compos
            let compoType = ''
            switch(compo.idTypeEvaluation){
                case 1:
                    compoType='CC'
                    break
                case 2:
                    compoType='Examen'
                    break
                case 4:
                    compoType='Rattrapage'
                    break
                default:
                    break;
            }

            return (
                <div className="styledCompo" key={compo.idEvaluation}>
                    <div className="styledCompoHeader">
                        <span className='composTitreCours'>{compoType} de {nomCour}</span>
                        <span className='duree'>{'Duree: '}{compo.duree.split(':')[0]+'h'+compo.duree.split(':')[1]+'m'}</span>
                    </div>
                    {timeLeft}
                </div>
            )
        })
    }

    handlePropositionChange=(e)=>{
        let questionNumber = Number(e.target.id.split('_')[1])
        let questionProp = this.state.newPropositions.find(proposition=>proposition.index===questionNumber)
        questionProp===undefined? questionProp={index:questionNumber, proposition:e.target.value}:questionProp.proposition=e.target.value
        let tempProps =this.state.newPropositions.filter(proposition=>proposition.index!==Number(e.target.id.split('_')[1]))
        tempProps.push(questionProp)
        this.setState({newPropositions:tempProps})
    }

    randomInteger = (min, max)=> {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    displayQuestions=()=>{
        if(this.state.idEvaluation!==''){
            let evaluation = this.props.evaluations.find(evaluatn=>evaluatn.idEvaluation===this.state.idEvaluation)
            console.log("The Evaluation",this.state.idEvaluation,evaluation)
            let theTime = evaluation.dateTime.split(' ')[4].split(':')
            theTime=theTime[0]+':'+theTime[1]
            theTime = this.addTimes(theTime, evaluation.duree)

            let now = this.adjustGmtTime(1)
            now = now+''.split(' G')[0]
            now = now.split(' ')[4]
            now = now.split(':')
            let theSeconds = 59-Number(now[2])
            if(theSeconds<10)theSeconds='0'+theSeconds
            now = '-'+now[0]+':-'+now[1]

            let composTimeLeft = this.addTimes(now, theTime)

            let index = 0
            let theQuestions = this.state.questionOrder.map(questionIndex=>{
                let question = evaluation.questions.find(question=>question.index===questionIndex)
                let optionIndex=0
                let questionType = this.props.typeQuestions.find(typeQuestion=>typeQuestion.idTypeQuestion===Number(question.idTypeQuestion)).nomTypeQuestion
                let questionProposition = this.state.newPropositions!==undefined?this.state.newPropositions.find(proposition=>proposition.index===question.index):undefined
                questionProposition= questionProposition!==undefined?(questionProposition.proposition):''
                return(
                    <div className="askedQuestion" key={++index}>
                        <span className='askedQuestionHeader'>Question {index}</span>
                        <span className='askedQuestionIndications'>{question.indications}</span>
                        <span className='askedQuestionQuestion'>{question.question}</span>
                        {question.refFiles.map((id,i)=>typeof(id)==="string"?<img key={i} src={"https://tranquil-thicket-81941.herokuapp.com/teacher/questionnaire/image/"+id} style={{height: "100px",width: "100px"}} alt="uploaded"/>:null)}
                        {questionType==='QCM'?(
                            <form  className="displayOptions">
                                {question.options.map(option=>(
                                    <label htmlFor={'option_'+index+'_'+optionIndex} key={optionIndex}>
                                        <input type='radio' onChange={this.handlePropositionChange} id={'option_'+question.index+'_'+optionIndex} key={optionIndex++} name={'question_'+index} value={option} checked={questionProposition===option} />
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
            let theMinutes = 0
            theMinutes = Number(composTimeLeft.split(':')[1]) - 1
            theMinutes = theMinutes<10?('0'+theMinutes):theMinutes
            if(Number(composTimeLeft.split(':')[0])===0 && Number(composTimeLeft.split(':')[1])===0){
                this.handleRemettreClick()
            }else{
                return (<div className="questionPaper">
                    <div className="timeLeft">Temps restant: <span className='ghostTime'>{composTimeLeft.split(':')[0]+':'+theMinutes+':'+theSeconds}</span></div>
                    {this.displayDoneBtn()}
                    {theQuestions}
                </div>)
            }
        }else return null
    }

    

    handleRemettreClick= ()=>{
        let evaluation = this.props.evaluations.find(evaluation=>evaluation.idEvaluation===this.state.idEvaluation)
        let finalPropositions=[]
        evaluation.questions.map(question=>{
            let questionProp = this.state.newPropositions.find(proposition=>proposition.index===question.index)
            let tempProps={}
            if(questionProp===undefined){
                tempProps = {index:question.index, proposition:'', score:0}
                finalPropositions.push(tempProps)
            }else{
                // let typeQuestion= this.props.typeQuestions.find(type=>type.idTypeQuestion===question.idTypeQuestion).nomTypeQuestion
                let tempScore = questionProp.proposition===question.answer?question.mark:0
                tempProps={...questionProp, score:tempScore}
                finalPropositions.push(tempProps)
                // if(typeQuestion==='QCM'){
                // }else {
                //     tempProps={...questionProp, score:tempScore}
                //     finalPropositions.push(tempProps)
                // }
            }
            return null
        })

        let toBeUploaded = {idEvaluation:this.state.idEvaluation, idEtudiant:this.state.idEtudiant, idTypeEvaluation:evaluation.idTypeEvaluation, propositions:finalPropositions, submitted: true, startDate: Date.now()}
        /*
            The collection of interest here is the Copies collection. 
            1. The object to be uploaded to the Copies collection is: toBeUploaded

        */
         fetch(`https://tranquil-thicket-81941.herokuapp.com/student/compos/examen/new`, {
                         method: 'post',
                         headers: {'Content-Type': 'application/json','x-access-token':window.localStorage.getItem("token")},
                         body: JSON.stringify({
                            copie: toBeUploaded
                         })
                       })
                       .then(response=>response.json())
                       .then(data=>{
                         if(data.message){
                             alert('Successfull submittion of your copie')
                             console.log(data.message)
                        this.props.dispatch({type: "CREATE_COPIE", payload: [{
                                idCopie:data.message._id, 
                                idEvaluation:data.message.idEvaluation, 
                                idEtudiant:data.message.idEtudiant,  
                                idTypeEvaluation:data.message.idTypeEvaluation, 
                                propositions:data.message.propositions,
                                submitted:data.message.submitted
                            }]})
                         }
                         else{
                            alert('Failed to submit')
                           console.log(data)
                         }
                       })
                       .catch(error=>{
                            alert('Failed to submit');
                            console.log(error);
                        }) 
       console.log(toBeUploaded)
       this.setState({idEvaluation:'', newPropositions:[], questionOrder:[]})
    }

    displayDoneBtn=()=>(
        <button id='remettreEpreuveBtn' onClick={this.handleRemettreClick}>Remettre ma copie</button>
    )

    render() {
        console.log("The state",this.state)
        return (
             <div>
                 <StudentNav />
            {(!this.state.idEtudiant)?
                <div id="loading-on">Loading</div>
            :
            <Hoc>
                {this.styleAllCompos().length!==0?(this.state.composer?null:this.styleAllCompos()):"Pas de Composition aujourd'hui"}
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
        classes: state.Classe.classes,
        cours: state.Cour.cours,
        evaluations: state.Evaluation.evaluations,
        typeQuestions: state.TypeQuestion.typeQuestions,
        copies: state.Copie.copies
    }
}

export default connect(mapStateToProps)(Examen)