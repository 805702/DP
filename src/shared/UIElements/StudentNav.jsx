import React from 'react';
import Logo from '../components/Logo';
import './NavBar.css';
import { NavLink, withRouter } from 'react-router-dom';
import { setUser } from '../../store/actions/user.actions';
import { connect } from 'react-redux';

let handleSignOut=(e,props)=>{
    e.preventDefault()
    window.localStorage.setItem('token',null)
    window.localStorage.setItem('auth',false)
    props.setUser({})
    props.history.push('/')
}

const StudentNav=withRouter((props)=>{
    return (
        <header className="studentNav">
            <NavLink to='/student'><Logo /></NavLink>
            <div className="theLinks">
                <NavLink to='/student'>Emploie de temps</NavLink>
                <NavLink to='/student/note'>Notes</NavLink>
                <NavLink to='/student/examen'>Composition</NavLink>
                <NavLink to='/student/devoir'>Devoirs</NavLink>
                <NavLink to='/student' className='signout' onClick={(e)=>handleSignOut(e,props)}>Deconnexion</NavLink>
            </div>
        </header>
    );
})

const mapDispatchToProps = dispatch => ({
    setUser: (user)=>dispatch(setUser(user)),
})

export default connect(null,mapDispatchToProps)(StudentNav)
