import React from 'react';
import Logo from '../components/Logo';
import './NavBar.css';
import { NavLink, Redirect } from 'react-router-dom';

let handleSignOut=()=>{
    window.localStorage.setItem('token',null)
    window.localStorage.setItem('auth',false)
    return <Redirect to='/hel' />
}

export default function CoordoNav(props)
{
    return (
        <header className="studentNav">
            <Logo />
            <div className="theLinks">
                <NavLink to='/coordo'>Gerer emploies de temps</NavLink>
                <NavLink to='/teacher'>Mon emploie de temps</NavLink>
                <NavLink to='/teacher/questionnaire'>Evaluation</NavLink>
                <NavLink to='/teacher/correct'>Correction</NavLink>
                <NavLink to='/coordo/publish-notes'>Publier les notes</NavLink>
                <NavLink to='/teacher/notes'>Voir les notes</NavLink>
                <NavLink to='/' className='signout' onClick={handleSignOut}>SignOut</NavLink>
            </div>
        </header>
    );
}