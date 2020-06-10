import React from 'react';
import Logo from '../components/Logo';
import './NavBar.css';
import { setUser } from '../../store/actions/user.actions';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

let handleSignOut=(e,props)=>{
    e.preventDefault()
    window.localStorage.setItem('token',null)
    window.localStorage.setItem('auth',false)
    props.setUser({})
    props.history.push('/')
}

const CoordoNav=withRouter((props)=>{
    return (
        <header className="studentNav">
            <NavLink to='/coordo'><Logo /></NavLink>
            <div className="theLinks">
                <NavLink to='/coordo'>Gerer emploies de temps</NavLink>
                <NavLink to='/teacher'>Mon emploie de temps</NavLink>
                <NavLink to='/teacher/questionnaire'>Evaluation</NavLink>
                <NavLink to='/teacher/correct'>Correction</NavLink>
                <NavLink to='/coordo/publish-notes'>Publier les notes</NavLink>
                <NavLink to='/teacher/notes'>Voir les notes</NavLink>
                <NavLink to='/coordo' className='signout' onClick={(e)=>handleSignOut(e,props)}>Deconnexion</NavLink>
            </div>
        </header>
    );
})

const mapDispatchToProps = dispatch => ({
    setUser: (user)=>dispatch(setUser(user)),
})

export default connect(null,mapDispatchToProps)(CoordoNav)