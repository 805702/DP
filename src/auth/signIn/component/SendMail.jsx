import React, { Component } from 'react';
import { withRouter } from 'react-router'; 
import bcryptjs from 'bcryptjs';

import parseJwt from '../../../shared/utils/parseJwt.js'

import './SendMail.css'

class SendMailBody extends Component {
    state={
        code:'',
        mail:'',
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
                alert('Retry Please')
                console.log(data.errror)
            }
            else if(data.message === "Email not found") {
                alert('Not a User')
            }
            else {
                window.localStorage.setItem('token',data.message)
                this.setState({code: parseJwt(data.message).code})
            }
        })
          .catch(error=>console.log(error.message))
    }

    render() {
        return (
            <div>
                <form className='sendMailForm' onSubmit={this.handleSubmit}>
                    <i className='fa fa-envelope' id='iTag' ><input onChange={this.handleEmailEntry} type='email' id='recoveryMail' className='recoveryMail' placeholder='Recovery email' required/></i>
                    <input hidden onChange={this.handleCodeEntry} id='codeInput' type='text' className='recoveryCode' placeholder='Code' max="6"/>
                    <input type='submit' className='sendMailBtn' placeholder='Send code' />
                </form>
            </div>
        )
    }
}

export default withRouter(SendMailBody)
