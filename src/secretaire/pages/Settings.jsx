import React from 'react'

import './Settings.css'
import ClasseSettings from '../components/new module/ClasseSettings'
import NewFaculte from '../components/new faculte/NewFaculte'
import SecretaireNav from '../../shared/UIElements/SecretaireNav'

export default function Settings() {
    return (
        <div>
            <SecretaireNav />
            <div className="settingsPartialHolder">
                <ClasseSettings />
                <NewFaculte />
            </div>
        </div>
    )
}
