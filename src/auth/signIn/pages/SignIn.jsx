import React from 'react'

import NavBar from '../../../shared/UIElements/NavBar';
import SignInBody from '../component/SignIn'
import Footer from '../../../shared//UIElements/Footer'

export default function SignIn() {
    return (
        <div>
            <NavBar />
            <main><SignInBody /></main>
            <Footer />
        </div>
    )
}
