import React from 'react'

import NavBar from '../../../shared/UIElements/NavBar'
import SendMailBody from '../component/SendMail'
import Footer from '../../../shared/UIElements/Footer'

export default function SendMail() {
    return (
        <div>
            <NavBar />
            <SendMailBody />
            <Footer />
        </div>
    )
}
