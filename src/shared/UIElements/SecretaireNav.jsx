import React from 'react';
import Logo from '../components/Logo';
import './NavBar.css';
import { NavLink, Redirect } from 'react-router-dom';

let handleSignOut=()=>{
    window.localStorage.setItem('token',null)
    window.localStorage.setItem('auth',false)
    return <Redirect to='/hel' />
}

export default function SecretaireNav(props)
{
    return (
        <header className="studentNav">
            <Logo />
            <div className="theLinks">
                <NavLink to='/manage-personnels'>Gestion du personnel</NavLink>
                <NavLink to='/settings'>Parametrer le campus</NavLink>
                <NavLink to='/teacher/courses'>Attribuer cours</NavLink>
                <NavLink to='/newstudent'>Ajouter etudiants</NavLink>
                <NavLink to='/' className='signout' onClick={handleSignOut}>SignOut</NavLink>
            </div>
        </header>
    );
}