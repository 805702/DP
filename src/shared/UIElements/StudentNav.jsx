import React from 'react';
import Logo from '../components/Logo';
import './NavBar.css';
import { NavLink } from 'react-router-dom';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'

let handleSignOut=(props)=>{
    window.localStorage.setItem('token',null)
    window.localStorage.setItem('auth',false)
    return <Redirect to='/hel' />
}

export default function StudentNav(props)
{
    return (
        <header className="studentNav">
            <Logo />
            <div className="theLinks">
                <NavLink to='/student'>Emploie de temps</NavLink>
                <NavLink to='/student/note'>Notes</NavLink>
                <NavLink to='/student/examen'>Composition</NavLink>
                <NavLink to='/student/devoir'>Devoirs</NavLink>
                <NavLink to='/' className='signout' onClick={handleSignOut}>SignOut</NavLink>
            </div>
        </header>
    );
}