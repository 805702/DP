import React, { Component } from 'react'
import './GoodAlert.css'
class Spinner extends Component {
    componentDidMount=()=>{
        setInterval(()=>{
            if(this.props.alertCounter<2)this.props.setCounter()
        }, 1000)
    }

    clearScreen=()=>{
        let pageDiv = document.getElementById('pageDiv')
        pageDiv!==null?pageDiv.style.display = 'none':pageDiv=null
        // pageDiv.style.display = 'none'
        this.props.gAlertSetter()
        return null
    }

    showScreen=()=>{
        if(this.props.alertCounter<2 && this.props.spin==='bad'){
        let pageDiv = document.getElementById('pageDiv')
        pageDiv!==null?pageDiv.style.display = 'grid':pageDiv=null
        return true
        }else return false
    }

    render() {
        return this.showScreen()?(
            <div className='pageDiv' onClick={this.clearScreen} id='pageDiv'>
                <div className="dataDiv">
                    <i className='fa fa-times-circle' />
                    <span className="spinnerMessage">{this.props.message}</span>
                </div>
            </div>
        ):null
    }
}

export default Spinner