import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';
import { withRouter } from 'react-router';

import { setUser } from '../../../store/actions/user.actions';

import parseJwt from '../../../shared/utils/parseJwt.js'

import './SignIn.css'

class SignInBody extends Component {
    state={
        username:'',
        password:'',
        error:''
    }

    handleChange=(e)=>{
        e.preventDefault()
        this.setState({
            [e.target.id]:e.target.value
        })
    }
    
    handleSubmit=(e)=>{
        e.preventDefault();
          fetch('https://tranquil-thicket-81941.herokuapp.com/signin', {
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
              this.setState({error:true})
              console.log('the error'+data)
            }
        })
          .catch(error=>console.log(error))
    }
    render() {
        return (
            <form className='signInForm' onSubmit={this.handleSubmit}>
              {this.state.error?<span className='error'>Login ou mot de passe incorrect</span>:null}
                <i className='fa fa-user'><input type='text' onChange={this.handleChange} placeholder='Username' id='username' className='signInInput' /></i>
                <i className='fa fa-key'><input type='password' onChange={this.handleChange} placeholder='Password' id='password' className='signInInput' /></i>
                <span className='signInFgtPwd'><Link to='/sendmail'>Forgot password?</Link></span>
                <input type='submit' value='Connexion' onSubmit={this.handleSubmit} className='signInConfirm'/>
                <span className='toSignUp'><Link to='/signup'> Sign up</Link></span>
            </form>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    setUser: (user)=>dispatch(setUser(user)),
})

export default withRouter(connect(null,mapDispatchToProps)(SignInBody));