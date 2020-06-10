import React from 'react';
import Avatar from '../components/Avatar';
import Logo from '../components/Logo';
import LogoUniv from './../../assets/logoUnivDefault.jpg';
import './NavBar.css';
import { NavLink } from 'react-router-dom';


export default function Navbar(props)
{
    return (
        <header className="headerNavBar">
            <NavLink to='/'><Logo /></NavLink>
            <Avatar alt="Logo Université" image={LogoUniv}  width="130px" height="130px" className="avatarStart avatarLogin" />
        </header>
    );
}