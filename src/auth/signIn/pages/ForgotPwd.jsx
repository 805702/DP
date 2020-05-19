import React from 'react'

import ForgotPassword from '../../../auth/signIn/component/ForgotPassword'
import NavBar from '../../../shared/UIElements/NavBar'
import Footer from '../../../shared/UIElements/Footer'

export default function ForgotPwd() {
    return (
        <div>
            <NavBar />
            <ForgotPassword />
            <Footer />
        </div>
    )
}
