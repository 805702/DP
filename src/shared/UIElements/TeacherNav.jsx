import React from 'react';
import Logo from '../components/Logo';
import './NavBar.css';
import { NavLink, withRouter} from 'react-router-dom';
import { setUser } from '../../store/actions/user.actions';
import { connect } from 'react-redux';


let handleSignOut=(e,props)=>{
    e.preventDefault()
    window.localStorage.setItem('token',null)
    window.localStorage.setItem('auth',false)
    props.setUser({})
    props.history.push('/')
}

const TeacherNav=withRouter((props)=>{
    return (
        <header className="studentNav">
            <NavLink to='/teacher'><Logo /></NavLink>
            <div className="theLinks">
                <NavLink to='/teacher'>Emploie de temps</NavLink>
                <NavLink to='/teacher/questionnaire'>Evaluation</NavLink>
                <NavLink to='/teacher/correct'>Correction</NavLink>
                <NavLink to='/teacher/notes'>Notes</NavLink>
                <NavLink to='/teacher' className='signout' onClick={(e)=>handleSignOut(e,props)}>Deconnexion</NavLink>
            </div>
        </header>
    );
})

const mapDispatchToProps = dispatch => ({
    setUser: (user)=>dispatch(setUser(user)),
})

export default connect(null,mapDispatchToProps)(TeacherNav)
