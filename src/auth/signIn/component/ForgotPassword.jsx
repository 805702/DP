import React, { Component } from 'react';

import { withRouter } from 'react-router';
import disableBrowserBackNavigation from 'disable-browser-back-navigation'

import parseJwt from '../../../shared/utils/parseJwt.js'
import './ForgotPassword.css'
import Spinner from '../../../shared/alerts/Spinner';
import BadAlert from '../../../shared/alerts/BadAlert';

class ForgotPassword extends Component {
    state={
        password:'',
        error:false,
        message:"",
        spin:false,
        gAlert:false,
        alertCounter:0
    }

    handlePasswordChange = (e)=>{
        this.setState({
            password: e.target.value
        })
    }

    verifyPasswords = (e) =>{
        let btn = document.getElementById('fgtSubmit')
        if(this.state.password.length < 8 ){
            this.setState({error:true, message:"Please password at least 8 characters"})
            btn.disabled=true
            btn.style.backgroundColor='grey'
        }
        else if(e.target.value !== this.state.password){
            this.setState({error:true,message:"Passwords don't match!!!"})
            btn.disabled=true
            btn.style.backgroundColor='grey'
        }else{
            btn.disabled=false
            btn.style.backgroundColor = '#28A08B'
            this.setState({error:false})
        }
    }

    handleSubmit = (e) =>{
        e.preventDefault()
        // push to the signed in page(depending on the user that is signed in)
        this.setState({spin:true})
        const id = parseJwt(window.localStorage.getItem('token')).id
        fetch('https://tranquil-thicket-81941.herokuapp.com/reset-password', {
            method: 'put',
            headers: {'Content-Type': 'application/json','x-access-token':window.localStorage.getItem("token")},
            body: JSON.stringify({
              id: id,
              password: this.state.password
            })
        })
        .then(response=>response.json())
        .then(data=>{
            if(data.message) {
                this.setState({spin:false, gAlert:false, alertCounter:0})
                alert(data.message)
                this.props.history.push('/signin')
            }
            else{
                this.setState({spin:false,spin:false,
                    alertCounter:0,
                    spinMessage:'Echec',
                    gAlert:'bad'})
                alert(data.error)
            }
        })
        .catch(error=>console.log(error.message))
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
            <div className="forgotMiddle">
                <form className="fgtPwdForm" onSubmit={this.handleSubmit} >
                    {this.state.error?(<div className='pwdMismatchError'>{this.state.message}</div>):(null)}
                    <input type="password" onChange={this.handlePasswordChange}className = 'fgtInput' placeholder='New password' />
                    <input type="password" onChange={this.verifyPasswords} className = 'fgtInput' placeholder='Confirm password' />
                    <Spinner spin={this.state.spin} message={this.state.spinMessage}/>
                    {this.state.gAlert?<BadAlert message={this.state.spinMessage} alertCounter={this.state.alertCounter} setCounter={this.setAlertCounter} gAlertSetter={this.setGAlertFalse} spin={this.state.gAlert} message={this.state.spinMessage} />:null}
                    <input disabled onClick={this.handleSubmit} type='submit' className = 'forgetSubmit' id = 'fgtSubmit' value='Change password' />
                </form>
            </div>
        )
    }
}

export default withRouter(ForgotPassword);