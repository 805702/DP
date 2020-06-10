import React from 'react';
import Logo from '../components/Logo';
import { setUser } from '../../store/actions/user.actions';
import './NavBar.css';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

let handleSignOut=(e,props)=>{
    e.preventDefault()
    window.localStorage.setItem('token',null)
    window.localStorage.setItem('auth',false)
    props.setUser({})
    props.history.push('/')
}

const SecretaireNav=withRouter((props)=>{
    return (
        <header className="studentNav">
            <NavLink to='/manage-personnels'><Logo /></NavLink>
            <div className="theLinks">
                <NavLink to='/manage-personnels'>Gestion du personnel</NavLink>
                <NavLink to='/settings'>Parametrer le campus</NavLink>
                <NavLink to='/teacher/courses'>Attribuer cours</NavLink>
                <NavLink to='/newstudent'>Ajouter etudiants</NavLink>
                <NavLink to='/manage=personnels' className='signout' onClick={(e)=>handleSignOut(e,props)}>Deconnexion</NavLink>
            </div>
        </header>
    );
})

const mapDispatchToProps = dispatch => ({
    setUser: (user)=>dispatch(setUser(user)),
})

export default connect(null,mapDispatchToProps)(SecretaireNav)