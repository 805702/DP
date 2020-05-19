import React from 'react';
import Logo from '../components/Logo';
import './NavBar.css';
import { NavLink, Redirect} from 'react-router-dom';


let handleSignOut=()=>{
    window.localStorage.setItem('token',null)
    window.localStorage.setItem('auth',false)
    return <Redirect to='/hel' />
}

export default function TeacherNav(props)
{
    return (
        <header className="studentNav">
            <Logo />
            <div className="theLinks">
                <NavLink to='/teacher'>Emploie de temps</NavLink>
                <NavLink to='/teacher/questionnaire'>Evaluation</NavLink>
                <NavLink to='/teacher/correct'>Correction</NavLink>
                <NavLink to='/teacher/notes'>Notes</NavLink>
                <NavLink to='/' className='signout' onClick={handleSignOut}>SignOut</NavLink>
            </div>
        </header>
    );
}