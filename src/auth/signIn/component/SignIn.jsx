import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';
import { withRouter } from 'react-router';
import MicRecorder from 'mic-recorder-to-mp3';
import disableBrowserBackNavigation from 'disable-browser-back-navigation'

import { setUser } from '../../../store/actions/user.actions';

import parseJwt from '../../../shared/utils/parseJwt.js'

import './SignIn.css'
import Spinner from '../../../shared/alerts/Spinner';
import BadAlert from '../../../shared/alerts/BadAlert';
import ReactAudioPlayer from 'react-audio-player'
import { ReactMic } from 'react-mic';

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

class SignInBody extends Component {
    state={
        username:'',
        password:'',
        error:'',
        spin:false,
        gAlert:false,
        alertCounter:0,
        recordedBlob:[],

        isRecording: false,
        blobURL: '',
        isBlocked: false,
    }

    handleChange=(e)=>{
        e.preventDefault()
        this.setState({
            [e.target.id]:e.target.value
        })
    }
    
    handleSubmit=(e)=>{
        e.preventDefault();
        if(this.state.username!=='' && this.state.password!==''){
          this.setState({spin:true, spinMessage:"Nous cherchons l'utilisateur"})
            fetch('https://dp-dbv2.herokuapp.com/signin', {
              method: 'post',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                email: this.state.username.toLowerCase(),
                password: this.state.password
              })
          })
            .then(response=>response.json())
            .then(data=>{
              if(data.message){
                const { token, auth } = data.message
                window.localStorage.setItem('token',token)
                window.localStorage.setItem('auth',auth)
                const user = {...(parseJwt(token).user), history:null, hash:null, role:{...(parseJwt(token))}.user.role }
                this.props.setUser(user)
                this.setState({spin:false, gAlert:false, alertCounter:0})
                console.log(user.role,this.props)
                if(user.role==="secretaire"){
                this.props.history.push("/manage-personnels")
                } else if(user.role==="coordonateur"){
                  this.props.history.push("/coordo")
                }else if(user.role==="enseignant"){
                  this.props.history.push("/teacher")
                }
                else{
                  console.log("hello")
                  this.props.history.push("/student")
                }
              }
              else{
                this.setState({error:true,
                  spin:false,
                  alertCounter:0,
                  spinMessage:'Echec',
                  gAlert:'bad',
                })
                console.log(data)
              }
          })
            .catch(error=>console.log(error))
          
            this.setState({password:''})
      }
    }

    setGAlertFalse=()=>{
      this.setState({gAlert:false})
    }

    setAlertCounter=()=>{
      this.setState({alertCounter:this.state.alertCounter+1})
    }

    componentDidMount=()=>{
      disableBrowserBackNavigation();
    }

    render() {
        return (
            <form className='signInForm' onSubmit={this.handleSubmit}>
              {this.state.error?<span className='error'>Email ou mot de passe incorrect</span>:null}
              <i className='fa fa-user'><input type='text' value={this.state.username} onChange={this.handleChange} placeholder='Email' id='username' className='signInInput' /></i>
              <i className='fa fa-key'><input type='password' value={this.state.password} onChange={this.handleChange} placeholder='Mot de passe' id='password' className='signInInput' /></i>
              <span className='signInFgtPwd'><Link to='/sendmail'>Mot de passe oublié?</Link></span>
              <input type='submit' value='Connexion' onSubmit={this.handleSubmit} className='signInConfirm'/>
              <span className='toSignUp'><Link to='/signup'>S'inscrire</Link></span>
              <Spinner spin={this.state.spin} message={this.state.spinMessage}/>
              {this.state.gAlert?<BadAlert message={this.state.spinMessage} alertCounter={this.state.alertCounter} setCounter={this.setAlertCounter} gAlertSetter={this.setGAlertFalse} spin={this.state.gAlert} message={this.state.spinMessage} />:null}
            </form>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    setUser: (user)=>dispatch(setUser(user)),
})

export default withRouter(connect(null,mapDispatchToProps)(SignInBody));