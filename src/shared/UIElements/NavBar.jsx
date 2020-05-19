import React from 'react';
import Avatar from '../components/Avatar';
import Logo from '../components/Logo';
import LogoUniv from './../../assets/logoUnivDefault.jpg';
import './NavBar.css';


export default function Navbar(props)
{
    return (
        <header className="headerNavBar">
            <Logo />
            <Avatar alt="Logo Université" image={LogoUniv}  width="130px" height="130px" className="avatarStart avatarLogin" />
        </header>
    );
}