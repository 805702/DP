import React from 'react'

import NavBar from '../../../shared/UIElements/NavBar'
import SignUpBody from '../component/SignUpBody'
import Footer from '../../../shared/UIElements/Footer'

export default function SignUp() {
    return (
        <div>
            <NavBar />
            <main><SignUpBody /></main>
            <Footer />
        </div>
    )
}
