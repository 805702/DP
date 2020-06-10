import React, { Component } from 'react';
import { withRouter } from 'react-router'; 
import bcryptjs from 'bcryptjs';
import disableBrowserBackNavigation from 'disable-browser-back-navigation'

import parseJwt from '../../../shared/utils/parseJwt.js'
import './SendMail.css'
import { Link } from 'react-router-dom';
import Spinner from '../../../shared/alerts/Spinner';
import BadAlert from '../../../shared/alerts/BadAlert';
import GoodAlert from '../../../shared/alerts/GoodAlert';

class SendMailBody extends Component {
    state={
        code:'',
        mail:'',
        spin:false
    }

    handleEmailEntry=(e)=>{
        this.setState({
            mail:e.target.value
        })
    }

    handleCodeEntry=(e)=>{
        // this.state.code === e.target.value?(<Redirect to='/resetpwd' />):(null)
        if(bcryptjs.compareSync(e.target.value,this.state.code)){
            this.props.history.push("/resetpwd")
        }
    }

    handleSubmit =(e)=>{
        e.preventDefault();
        this.setState({spin:true})
        fetch('https://tranquil-thicket-81941.herokuapp.com/send-mail', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              email: this.state.mail,
            })
        })
        .then(response=>response.json())

        .then(data=>{
            if(data.error) {
                this.setState({spin:false, spin:false, alertCounter:0, spinMessage:'Echec... Essayez a nouveau', gAlert:'bad'})
                console.log(data.error)
            }
            else if(data.message === "Email not found") {
                this.setState({spin:false, spin:false, alertCounter:0, spinMessage:"Echec... Compte inexistant", gAlert:'bad'})
            }
            else {
                window.localStorage.setItem('token',data.message)
                this.setState({spin:false, spinMessage:'Email Envoye', gAlert:'good', alertCounter:0})
                this.setState({code: parseJwt(data.message).code})

                let recoveryMail = document.getElementById('recoveryMail')
                let fontAwe = document.getElementById('iTag')
                let codeInput =document.getElementById('codeInput')
                recoveryMail.removeAttribute('required')
                recoveryMail.setAttribute('hidden', 'true')
                fontAwe.classList=[]
                fontAwe.setAttribute('hidden', 'true')
                codeInput.removeAttribute('hidden')
                codeInput.setAttribute('required', 'true')
                document.getElementsByClassName('sendMailBtn')[0].setAttribute('hidden','true')
                document.getElementsByClassName('sendMailForm')[0].removeAttribute(onsubmit)
    
            }
        })
          .catch(error=>console.log(error.message))
        this.setState({mail:''})
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
            <div>
                <form className='sendMailForm' onSubmit={this.handleSubmit}>
                    <i className='fa fa-envelope' id='iTag' ><input onChange={this.handleEmailEntry} type='email' value={this.state.mail} id='recoveryMail' className='recoveryMail' placeholder='Recovery email' required/></i>
                    <input hidden onChange={this.handleCodeEntry} id='codeInput' type='text' className='recoveryCode' placeholder='Code' max="6"/>
                    <span className='signInFgtPwd'><Link to='/'>Se connecter</Link></span>
                    <Spinner spin={this.state.spin} message={this.state.spinMessage}/>
                    {this.state.gAlert?<BadAlert message={this.state.spinMessage} alertCounter={this.state.alertCounter} setCounter={this.setAlertCounter} gAlertSetter={this.setGAlertFalse} spin={this.state.gAlert} message={this.state.spinMessage} />:null}
                    {this.state.gAlert?<GoodAlert message={this.state.spinMessage} alertCounter={this.state.alertCounter} setCounter={this.setAlertCounter} gAlertSetter={this.setGAlertFalse} spin={this.state.gAlert} message={this.state.spinMessage} />:null}
                    <input type='submit' className='sendMailBtn' placeholder='Send code' />
                </form>
            </div>
        )
    }
}

export default withRouter(SendMailBody)
