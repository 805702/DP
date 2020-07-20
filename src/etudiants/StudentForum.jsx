import React, { Component } from 'react'
import { connect } from 'react-redux'
import io from 'socket.io-client'

import './StudentForum.css'
import Hoc from '../shared/utils/hoc.js'
import parseJwt from '../shared/utils/parseJwt.js'
import StudentNav from '../shared/UIElements/StudentNav.jsx'
import MicRecorder from 'mic-recorder-to-mp3';
import ReactAudioPlayer from 'react-audio-player'
const Mp3Recorder = new MicRecorder({ bitRate: 128 });

class StudentForum extends Component {
    state={
        idEtudiant:null,
        idCour:this.props.match.params.idCour,
        message:'',
        refFile:'',
        stop:false,

        isRecording: false,
        blobURL: '',
        isBlocked: false,
        seconds:0
    }

    fileTypeIcons = {
        "mov":"file-video", "qt":"file-video", "rm":"file-video", "wmn":"file-video", "wmf":"file-video", "mkv":"file-video", "mka":"file-video", "mks":"file-video", "mk3d":"file-video",
        "mp4":"file-video", "mp4a":"file-video", "mp4v":"file-video", "m4p":"file-video", "m4v":"file-video", "mpg":"file-video", "mpeg":"file-video", "m2p":"file-video", "ps":"file-video",
        "ts":"file-video", "tsv":"file-video", "tsa":"file-video", "asf":"file-video", "wma":"file-video", "wmv":"file-video", "flv":"file-video", "ogg":"file-video", "ogv":"file-video", "oga":"file-video",
        "ogx":"file-video", "ogm":"file-video", "3gp":"file-video", "3g2":"file-video", "m2ts":"file-video", "mts":"file-video", "vob":"file-video", "mpe":"file-video", "mpv":"file-video", "xvid":"file-video",
        
        "mp3":"file-audio", "wav":"file-audio", "aac":"file-audio", "midi":"file-audio", "flac":"file-audio", "pls":"file-audio", "mpa":"file-audio", "m3u":"file-audio", 

        "py":"file-code", "lua":"file-code", "java":"file-code", "c":"file-code", "cpp":"file-code", "m":"file-code", "cs":"file-code", "cmd":"file-code", "sh":"file-code", "go":"file-code", 
        "js":"file-code", "html":"file-code", "htm":"file-code", "jsx":"file-code", "xml":"file-code", "xhtml":"", "net":"file-code", "css":"file-code",


        "doc":"file-word", "dot":"file-word", "docx":"file-word", "ott":"file-word", "fodt":"file-word", "uot":"file-word",

        "ppt":"file-powerpoint", "pptx":"file-powerpoint", "pps":"file-powerpoint", "ppsx":"file-powerpoint", "pot":"file-powerpoint", "potm":"file-powerpoint", "odp":"file-powerpoint","odg":"file-powerpoint",
        "otp":"file-powerpoint", "uog":"file-powerpoint",

        "xls":"file-excel", "xlsx":"file-excel", "xlt":"file-excel", "slk":"file-excel", "xlsm":"file-excel", "ots":"file-excel", "ods":"file-excel", "fods":"file-excel", "uos":"file-excel", "dif":"file-excel",
        "csv":"file-csv",

        "png":"file-image", "jpg":"file-image", "jpeg":"file-image", "ico":"file-image", "tif":"file-image", "bmp":"file-image", "gif":"file-image", "svg":"file-image",

        "zip":"file-archive", "rar":"file-archive", "gz":"file-archive", "xs":"file-archive", "iso":"file-archive", "tar":"file-archive", "7z":"file-archive",
        "txt":"file-text", "pdf":"file-pdf"
    }

    getForumMessages=()=>this.props.forums.find(forum=>forum.idCour===this.state.idCour).messages

    getForumChatDates=()=>{
        let forumMessages = this.getForumMessages()
        let differentDates = []
        forumMessages.map(message=>{
            if(!differentDates.includes(message.date)){
                differentDates.push(message.date)
            }

            return null
        })

        return differentDates.sort((a,b)=>{
            let c=new Date(a)
            let d = new Date(b)
            return c>d?1:-1
        })
    }

    displayMessage=(message, key)=>{
       let nomSender =''
       let messageClassName = ''
       if(message.isEnseignant) {
           nomSender = this.props.personnels.find(personnel=>personnel.idPersonnel===this.props.cours.find(cour=>cour.idCour===this.state.idCour).nomEnseignant)
           messageClassName='teacherMessage'
        }else if(message.idEtudiant===this.state.idEtudiant){
            nomSender = {nom:'Moi', prenom:''}
            messageClassName='myMessage'
        }else{
            nomSender=this.props.etudiants.find(etudiant=>etudiant.idEtudiant===message.idEtudiant)
            messageClassName='othersMessage'
        }
        let messageTime = message.dateTime.split(' ')[4]
        nomSender= nomSender.nom +' '+ nomSender.prenom

        //if refFile is not empty, then it means there is a file for this message
        //if its an image, then display the image in the img tag
        //else make the ref downloadable on click
        //adjust the return below to either be an image or a link that downloads a ref on Click
        let refFile = !message.refFile?null:message.refFile.filetype.split('/').includes('image')?(<img src={"https://dp-dbv2.herokuapp.com/forum/file/"+message.refFile.link} alt='refFile' className='messageImage' />)
        :message.refFile.filetype.split('/').includes('audio')?<ReactAudioPlayer src={"https://dp-dbv2.herokuapp.com/forum/file/"+message.refFile.link} autoPlay={false} controls />
        :<a href={"https://dp-dbv2.herokuapp.com/forum/file/"+message.refFile.link} download={message.refFile.name}>{message.refFile.name}</a>
        return (
            <div key={key} className={messageClassName+ ' message'}>
                <span className='messageSender'>{nomSender}</span>
                <span className='messageRef'>{refFile}</span>
                <span className='messageContent'>{message.message}</span>
                <span className='messageTime'>{messageTime}</span>
            </div>
        )
    }

    displayForumMessagesPerDatePerTime=()=>{
        let chatDates = this.getForumChatDates()
        let messages = this.getForumMessages()
        let key=0
        let globalMessages = chatDates.map(chatDate=>{
            let dateMessages = messages.filter(message=>message.date===chatDate).sort((a,b)=>{
                let c=new Date(a.dateTime)
                let d = new Date(b.dateTime)
                return c>d?1:-1
            })

            return (
                <div className='dateMessagesBlock' key={chatDate}>
                    <div className="dateHeaderHolder">
                        <span className='straightLine'> </span>
                        <span className='dateMessagesHeader'>{chatDate}</span>
                    </div>
                    <div className='dateMessages'>
                        {dateMessages.map(message=>this.displayMessage(message, ++key))}
                    </div>
                </div>
            )
        })
        
        return <div className="forumMessagesPer" id='forumMessagesPer'>
            {globalMessages}
        </div>
    }

    handleNewMessageChange=(e)=>{
        this.setState({message:e.target.value})
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

    handleSendMessage=async(e)=>{
        if(e!==undefined)e.preventDefault()
        if(this.state.refFile!=='' || this.state.message!==''){
            let ref = null;
            if(this.state.refFile){
               let data = await fetch('https://dp-dbv2.herokuapp.com/forum/upload', {
                         method: 'post',
                         body: this.state.refFile
                       })
                data = await data.json()
                console.log(data)
                if(data.error) return alert('Could not upload file')
                if (data.message) ref = data.message
            }
            let date = this.adjustGmtTime(1)
            // let date = new Date().toUTCString()
            date = new Date(date).toDateString()
            let dateTime = this.adjustGmtTime(1)+' '
            // let dateTime = new Date().toUTCString()+' '
            dateTime = dateTime.split(' G')[0]
            let newMessage = {date:date, dateTime:dateTime, isEnseignant:false, message:this.state.message, refFile:ref, idEtudiant:this.state.idEtudiant}
            //In the forum collection, update the forum with id: this.state.idCours
            //add the message: newMessage to the messages array of this forum
            //After adding the message, fetch the data back to the forums in the state.
            //If there was the possibility to fetch only that forum back so as not to use the user's data
            let sendData = { idCour: this.state.idCour, message: newMessage }
            this.socket.emit("message",sendData)
            // let updatedForum = this.props.forums.find(forum=>forum.idCour===this.state.idCour)
            // updatedForum.messages.push(newMessage)
            // this.props.dispatch({type: "UPDATE_FORUM", payload: updatedForum})
            //in the componentDidMount of this page, make it fetch the forum's page every second... or i don't know if mongo has a realtime db
            //that will do automatic fetches if the db changes..

            console.log(newMessage)
            this.setState({message:'', refFile:''})
        }
    }

    handleAttachFile=(e)=>{
        if(e.target.files[0].size > 14000000){
            e.target.value = "";
          return alert("File is too big!");
        };
        let Fd = new FormData();
        Fd.append('file',e.target.files[0])
        this.setState({refFile: Fd})
    }
    // scrollToBottom =()=>{
    // const chat = document.querySelector('.dateMessagesBlock');
    // chat.scrollTop = chat.scrollHeight;
    // chat.scrollTop = chat.scrollHeight - chat.clientHeight;;
    // }
    writeMessage=()=>(
        <div>
            <div className='newMessage'>
                <input type='file' onChange={this.handleAttachFile} className='fa fa-paperclip'/>
                <form onSubmit={this.handleSendMessage}>
                    <input type='text' className='newMessageInput' value={this.state.message} placeholder='Type your message' onChange={this.handleNewMessageChange} />
                    <i className='fa fa-send' onClick={this.handleSendMessage} />
                </form>
            </div>
        </div>
    )

    componentWillMount=()=>{
        navigator.getUserMedia({ audio: true },
          () => {
            console.log('Permission Granted');
            this.setState({ isBlocked: false });
          },
          () => {
            console.log('Permission Denied');
            this.setState({ isBlocked: true })
          },
        );
      }
  
      start = () => {
        if (this.state.isBlocked) {
          console.log('Permission Denied');
        } else {
            this.setState({seconds:0})
          Mp3Recorder
            .start()
            .then(() => {
              this.setState({ isRecording: true });
            }).catch((e) => console.error(e));
        }
      };

      countDuration=()=>{
          let minutes = Math.floor(this.state.seconds/60)
          let seconds = this.state.seconds%60

          return `${minutes}:${seconds<10?'0'+seconds:seconds}`
      }
  
      stop = () => {
        Mp3Recorder
          .stop()
          .getMp3()
          .then(([buffer, blob]) => {
            const blobURL = URL.createObjectURL(blob)
            console.log(blob)

            // let formData = new FormData();
            // formData.append("firstName", "John");
            // formData.append("image", blob, "vn.mp3");
            let blb = blob
            blb.blobURL=blobURL
            blb.lastModified=Date.now()
            blb.lastModifiedDate=this.adjustGmtTime(1)
            blb.name=`vn${this.state.idEtudiant}${Date.now()}`
            blb.webkitRelativePath=""
            let uploadFile = new File([blb], blb.name+'.myvn', {type:"audio/mp3", lastModified:Date.now(), lastModifiedDate:this.adjustGmtTime(1),})

            let Fd = new FormData();
            Fd.append('file',uploadFile)
    

            console.log(uploadFile)
            this.setState({refFile:Fd},()=>this.handleSendMessage())

            this.setState({ isRecording: false });
          }).catch((e) => console.log(e));
      };


    writeMessage=()=>(
        <div>
            <div className='newMessage'>
                {!this.state.isRecording?<input type='file' onChange={this.handleAttachFile} className='fa fa-paperclip'/>:null}
                <form onSubmit={this.handleSendMessage}>
                    {!this.state.isRecording?<input type='text' className='newMessageInput' value={this.state.message} placeholder='Type your message' onChange={this.handleNewMessageChange} />
                    :<span className='newMessageInput'>{this.countDuration()}</span>}
                    <i className='fa fa-send' onClick={this.handleSendMessage} />
                </form>
            </div>
            <div className="workingOnMic">
                {!this.state.isRecording?<i className='fa fa-microphone greenMic' onClick={this.start} />:
                <i className='fa fa-send greenMic greenSend' onClick={this.handleSendMessage} onClick={this.stop} />}
            </div>
        </div>
    )


    showSupportCours=()=>{
        let supports = this.props.cours.find(cour=>cour.idCour===this.state.idCour).refSupports
        supports = supports!==undefined?supports:[]
        return (
            <div className="supportsCours">
                {supports.map(support=>(
                    <div className='support' key={support.ref}>
                        <i className={'fa fa-'+(this.fileTypeIcons[support.nameFile.split('.')[support.nameFile.split('.').length-1]] || 'file' )+'-o'} />
                        <span className='nomSupport'>{support.nameFile}</span>
                        <a href={`https://dp-dbv2.herokuapp.com/forum/file/${support.link}`} download={support.nameFile}><i className='fa fa-download' /></a>
                    </div>
                ))}
            </div>
        )

    }

    displayCoursHeader=()=>{
        let coursData = this.props.cours.find(cour=>cour.idCour===this.state.idCour)
        let classes = coursData.classe.map(idClasse=>{
            let classObj = this.props.classes.find(classe=>classe.idClasse===idClasse)
            return classObj.filiere.nomFiliere+' '+classObj.niveau
        })
        let nomEnseignant = this.props.personnels.find(personnel=>personnel.idPersonnel===coursData.nomEnseignant)
        nomEnseignant =  nomEnseignant.nom+' '+nomEnseignant.prenom

        return(
            <div className="studentCourHeader">
                <span className='classesOfferingCours'>{'Classe(s): '}{classes.map(classe=><span className='aForumClass' key={classe}>{classe+','}</span>)}</span>
                <span className='studentCoursTeacher'>{'Enseignant: '}<span className='studentCourTeacher'>{nomEnseignant}</span></span>
                <span className='studentIntituleCour'>{'Intitule du cours: '}<span className='studentIntituleCours'>{coursData.nomCours}</span></span>
            </div>
        )
    }

    scrollToTop=()=>{
        let elmt = document.getElementById('forumMessagesPer')
        if(elmt!==null){
            elmt.scrollIntoView({ behavior: 'smooth' })
            elmt.scrollTop=elmt.scrollHeight
        }
        this.setState({stop:true})
        // console.log(elmt.scrollIntoView)
    }

    componentDidMount(){
        setInterval(() => {this.setState({ seconds: this.state.seconds+1 })}, 1000)
        fetch('https://dp-dbv2.herokuapp.com/teacher/forum', {
           method: 'get',
           headers: {'Content-Type': 'application/json','x-access-token':window.localStorage.getItem("token")}
         })
         .then(response=>response.json())
         .then(data=>{
           if(data.message){
               const students = data.message.students.map(student=>{return{
                   idEtudiant:student._id,
                   matriculePersonnel: student.matricule,
                   nom: student.nom,
                   prenom: student.prenom,
                   mail: student.email,
                   tel: student.tel,
                   role: student.role,
                   idClasse: student.idClasse
               }})
               const cours = data.message.courses.map(cour=>{return{
                   idCour:cour._id,
                   classe: cour.classes,
                   nomCours: cour.nomCour,
                   codeCours: cour.codeCour,
                   nomEnseignant: cour.idEnseignant,
                   refSupports: cour.refSupports
               }})
               const users = data.message.users.map(user=>{return{
                   idPersonnel:user._id,
                   matricule: user.matricule,
                   nom: user.nom,
                   prenom: user.prenom,
                   mail: user.email,
                   tel: user.tel,
                   role: user.role
               }})
               const forums = data.message.forums.map(note=> {
                   return {
                       idForum:note._id, 
                       idCour:note.idCour, 
                       messages:note.messages
                   }
                 })
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
               this.props.dispatch({type: "LOAD_CLASSE", payload: classes})
               this.props.dispatch({type: "LOAD_FORUM", payload: forums})
               this.props.dispatch({type: "LOAD_PERSONNEL", payload: users})
               this.props.dispatch({type: "LOAD_COUR", payload: cours})
               this.props.dispatch({type: "CREATE_ETUDIANT", payload: students})
               this.setState({idEtudiant:parseJwt(window.localStorage.getItem('token')).user._id})
           }
           else{
             console.log(data)
           }
         })
         .catch(error=>console.log(error))      
        this.socket = io("https://dp-dbv2.herokuapp.com/");
        this.socket.on('init', (msg) => {
            // this.scrollToBottom()
        });
        // Update the chat if a new message is broadcasted.
        this.socket.on("success",(msg)=>console.log('Send Message'))
        this.socket.on('updatedForum', (msg) => {
            let updatedForum = this.props.forums.find(forum=>forum.idCour===msg.idCour)
                updatedForum.messages.push(msg.message)
                this.props.dispatch({type: "UPDATE_FORUM", payload: updatedForum})
                    // this.scrollToBottom()
        });
        this.socket.on('updatedCour', (msg) => {
            let updatedCour = this.props.cours.find(cour=>cour.idCour===msg.idCour)
                updatedCour.refSupports.push(msg.refObj)
                this.props.dispatch({type: "UPDATE_COUR_FORUM", payload: updatedCour})
                    // this.scrollToBottom()
        });

    }

    render() {
        return (
            <div>
                <StudentNav />
                {(!this.state.idEtudiant)?<div id="loading-on">Loading</div>:
                <Hoc>
                    <div className='studendForumOverallHolder'>
                        {this.displayCoursHeader()}
                        <div className="forumBottomSection">
                            <div className="forumMessageSection">
                                <span className='messagesSection'>Forum de cours</span>
                                {this.displayForumMessagesPerDatePerTime()}
                                <div className="forumWriteNewMessage">
                                    {this.writeMessage()}
                                </div>
                            </div>
                            <div className="forumSupportSection">
                                <span className='theSupportsCours'>Support Cours</span>
                                {this.showSupportCours()}
                            </div>
                        </div>
                    </div>
                </Hoc>}
                </div>
        )
    }
}

const mapStateToProps=(state)=>{
    return{
        forums: state.Forum.forums,
        etudiants: state.Etudiant.etudiants,
        cours: state.Cour.cours,
        classes: state.Classe.classes,
        personnels: state.Personnel.personnels
    }
}

export default connect(mapStateToProps)(StudentForum)