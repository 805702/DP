import React from 'react';

import './Logo.css';
import schoolLogo from '../../assets/svg_educ.png'

export default function Logo()
{
    return (
        <div className="header-logo">
            <img src={schoolLogo} alt='E-School' />
            <span className='nameApp'>E-School</span>
        </div>
    );
}