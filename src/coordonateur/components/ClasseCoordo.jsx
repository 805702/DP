import React, { Component } from 'react'

import './ClasseCoordo.css'

export default class ClasseCoordo extends Component {

    

    handleTimeFocus=()=>{
        document.getElementById('thatTime').type='time'
    }

    styleClasses =()=>{
        return this.props.classes.map(classe=>(
            <div className='coordoTimetableClasse' key={classe.idClasse}>
                <span>{classe.filiere.nomFiliere+" "+classe.niveau}</span>
                <div className="coordoClassBtns">
                    <input type='submit' value='Definir' className='classeOptions' id={classe.filiere.nomFiliere+"_"+classe.niveau+"_"+classe.idClasse} onClick={this.props.handleDefinirClick}/>
                    <input type='submit' value='Modifier' className='classeOptions' id={classe.filiere.nomFiliere+"_"+classe.niveau+"_"+classe.idClasse} onClick={this.props.handleModifierClick}/>
                </div>
            </div>
        ))
    }

    render() {
        return (
            <div className="classeCoordoOverallHolder">
                {this.styleClasses()}
            </div>
        )
    }
}
