import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import io from 'socket.io-client'
import Hoc from '../shared/utils/hoc.js'
import parseJwt from '../shared/utils/parseJwt.js'
import './TeacherForum.css'
import { connect } from 'react-redux'
import TeacherNav from '../shared/UIElements/TeacherNav.jsx'

class TeacherForum extends Component {
    state={
        /*
            Don't forget to make this link accessible only the the subject teacher.
            that is to say only the teacher of a subject can acces the url teacherforum/:idcour

            you decide which way to go. that is should the idcour be in the url (visible to any who's wise)
            or send it through jwt when a teacher tries to access this page

            according to me if it is sent through jwt, then it is more secure. only the teacher will be able to get to a specified forum
            given that this data is sent through a jwt... 
            
            dont' forget to sent the teacher(personnel) info in the jwt too.
        */
       idCour:this.props.match.params.idCour, //using it for frontend purposes. this data should be sent using jwt
       idPersonnel: null, //using it for frontend purposes. this data should be sent using jwt

        refFile:'',
        message:'',
        newSupport:'',
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

    getForumMessages=()=>this.props.forums.find(forum=>forum.idCour===this.state.idCour).messages;

    getForumChatDates=()=>{
        let forumMessages = this.getForumMessages()
        console.log("Found Message",forumMessages)
        let chatDates = []

        forumMessages.map(message=>{
            if(!chatDates.includes(message.date)){
                chatDates.push(message.date)
            }

            return null
        })
        return chatDates.sort((a,b)=>{
            let c=new Date(a)
            let d = new Date(b)
            return c>d?1:-1
        })
    }

    displayMessage=(message, key)=>{
       let nomSender =''
       let messageClassName = ''
       if(message.isEnseignant) {
           nomSender = this.props.personnels.find(personnel=>personnel.idPersonnel===this.state.idPersonnel)
           messageClassName='teacherMessage'
        }else{
            nomSender = this.props.etudiants.find(etudiant=>etudiant.idEtudiant===message.idEtudiant)
            messageClassName='studentMessage'
        }
        let messageTime = message.dateTime.split(' ')[4]
        nomSender= nomSender.nom +' '+ nomSender.prenom

        //if refFile is not empty, then it means there is a file for this message
        //if its an image, then display the image in the img tag
        //else make the ref downloadable on click
        //adjust the return below to either be an image or a link that downloads a ref on Click
        let refFile = !message.refFile?null:message.refFile.filetype.split('/').includes('image')?(<img src={"https://tranquil-thicket-81941.herokuapp.com/forum/file/"+message.refFile.link} alt='refFile' className='messageImage' />): <a href={"https://tranquil-thicket-81941.herokuapp.com/forum/file/"+message.refFile.link} download={message.refFile.name}>{message.refFile.name}</a>
        
        return (
            <div key={key} className={messageClassName+ ' message'}>
                <span className='messageSender'>{nomSender}</span>
                <span className='messageRef'>{refFile}</span>
                <span className='messageContent'>{message.message}</span>
                <span className='messageTime'>{messageTime}</span>
            </div>
        )
    }
  //   scrollToBottom =()=> {
  //   const chat = document.querySelector('.dateMessagesBlock');
  //   chat.scrollTop = chat.scrollHeight;
  //   chat.scrollTop = chat.scrollHeight - chat.clientHeight;
  //   console.log(chat)
  // }

    displayForumMessagesPerDatePerTime=()=>{
        let chatDates = this.getForumChatDates()
        let messages = this.getForumMessages()
        let key=0
        return chatDates.map(chatDate=>{
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
                    </div>                    <div className='dateMessages'>
                        {dateMessages.map(message=>this.displayMessage(message, ++key))}
                    </div><br />
                </div>
            )
        })
    }

    handleNewMessageChange=(e)=>{
        this.setState({message:e.target.value})
    }

    handleSendMessage=async()=>{
        if(this.state.refFile!=='' || this.state.message!==''){
            let ref = null;
            if(this.state.refFile){
               let data = await fetch('https://tranquil-thicket-81941.herokuapp.com/forum/upload', {
                         method: 'post',
                         body: this.state.refFile
                       })
        data = await data.json()
        console.log(data)
        if(data.error) return alert('Could not upload file')
        if (data.message) ref = data.message
        }
            let date = new Date().toUTCString()
            date = new Date(date).toDateString()
            let dateTime = new Date().toUTCString()+' '
            dateTime = dateTime.split(' G')[0]
            let newMessage = {date:date, dateTime:dateTime, isEnseignant:true, message:this.state.message, refFile:ref, idEtudiant:''}
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

    writeMessage=()=>(
        <div>
            <div className='newMessage'>
                <input type='file' onChange={this.handleAttachFile} className='fa fa-paperclip'/>
                <form onSubmit={this.handleSendMessage}>
                    <input type='text' className='newMessageInput' value={this.state.message} placeholder='Type your message' onChange={this.handleNewMessageChange} />
                    <i className='fa fa-send' onClick={this.handleSendMessage} />
                </form>
            </div>
                <Link to='/teacher/timetable'>Voir emploi de temps</Link>
        </div>
    )

    afficheCourHeader=()=>{
        let theCour = this.props.cours.find(cour=>cour.idCour===this.state.idCour)
        let classes = theCour.classe.map(classe=><span key={classe} className='nomClasseForum'>{(function(Classes){
            console.log(classe,Classes)
            let Classe=Classes.find(cls=>cls.idClasse==classe)
            if(!Classe)return "class not found"; 
            return Classe.filiere.nomFiliere +" "+ Classe.niveau
        })(this.props.classes)}</span>)
        return (
            <div className='courHeader'>
                <span className='nomForumCour'>Intitule cours: {theCour.nomCours}</span>
                <span className='concernedClassesForum'>Classes: {classes}</span>
            </div>
        )
    }

    showSupportCours=()=>{
        let supports = this.props.cours.find(cour=>cour.idCour===this.state.idCour).refSupports
        return (
            <div className="supportsCours">
                {supports.map(support=>!support?null:(
                    <div className='support' key={support.ref}>
                        <a href={`https://tranquil-thicket-81941.herokuapp.com/forum/file/${support.link}`} download={support.nameFile}>
                            <i className={'fa fa-'+(this.fileTypeIcons[support.nameFile.split('.')[support.nameFile.split('.').length-1]] || 'file' )+'-o'} />
                            <span className='nomSupport'>{support.nameFile}</span>
                        </a>
                    </div>
                ))}
            </div>
        )

    }
    handleFileChange=(e)=>{
        this.setState({newSupport:e.target.files[0]})
    }

    uploadSupport=async()=>{
        let formData = new FormData()
        formData.append(
            'courseFile',
            this.state.newSupport
        )
        let coursObject=this.props.cours.find(cour=>cour.idCour===this.state.idCour)
        let ref =coursObject.codeCours+'_'+(coursObject.refSupports.length+1)
        /*
            update the cours with idCour: this.state.idCour by adding newFormRef to its refSupport object
            add this.state.newSupport to the gridFS or i don't know what.
            The refName of this file to store in gridFS should be: ref
        */
       let data = await fetch(`https://tranquil-thicket-81941.herokuapp.com/forum/uploadSupport/${ref}`, {
        method: 'post',
        body: formData
        })
        data = await data.json()
        console.log(data)
        if(data.error) return alert('Could not upload file')
        // coursObject.refSupports.push(data.message)
        // this.props.dispatch({type: "UPDATE_COUR", payload: coursObject})

        // console.log(newFormRef)
        this.setState({newSupport:''})
    }

    showUploadFile=()=>{
        return (
            <div className='fileSupportCours'>
                <input type='file' onChange={this.handleFileChange}/>
                {this.state.newSupport!==''?(
                    <div className='newFileInfo'>
                        <span className='newFileName'>Nom fichier: {this.state.newSupport.name}</span>
                        <span className='newFileType'>Type fichier: {this.state.newSupport.type}</span>
                        <span className='newFileSize'>Taille fichier: {((Number(this.state.newSupport.size)/1024)/1024).toFixed(2)}Mb</span>
                        <div><button onClick={this.uploadSupport}><i className='fa fa-upload'/>uploadFile</button></div>
                    </div>
                ):null}
            </div>
        )
    }
    componentDidMount(){
        fetch('https://tranquil-thicket-81941.herokuapp.com/teacher/forum', {
           method: 'get',
           headers: {'Content-Type': 'application/json','x-access-token':window.localStorage.getItem("token")}
         })
         .then(response=>response.json())
         .then(data=>{
           if(data.message){
             console.log(data.message)
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
               this.setState({idPersonnel:parseJwt(window.localStorage.getItem('token')).user._id})
           }
           else{
             console.log(data)
           }
        }).catch(error=>console.log(1,error))      
            this.socket = io("https://tranquil-thicket-81941.herokuapp.com");

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
                <TeacherNav />
                {(!this.state.idPersonnel)?<div id="loading-on">Loading</div>:
                <Hoc>
                    <div className='studendForumOverallHolder'>
                        <div className="forumBottomSection">
                            <div className="forumMessageSection">
                                <span className='messagesSection'>Forum de cours</span>
                                <div className="forumMessagesPer" id='forumMessagesPer' >
                                    {this.displayForumMessagesPerDatePerTime()}
                                    {this.writeMessage()}
                                </div>
                            </div>
                            <div className="forumSupportSection">
                                <span className='theSupportsCours'>Support Cours</span>
                                {this.showSupportCours()}
                                {this.showUploadFile()}
                            </div>
                        </div>
                    </div>
                </Hoc>}
            </div>
        )
    }
}

const mapStateToProps=(state)=>{
    return {
        etudiants: state.Etudiant.etudiants,
        forums: state.Forum.forums,
        cours: state.Cour.cours,
        classes: state.Classe.classes,
        personnels: state.Personnel.personnels
    }
}


export default connect(mapStateToProps)(TeacherForum)
