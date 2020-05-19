import React, { Component } from 'react'

import './ClasseDefinir.css'

export default class ClasseDefinir extends Component {
    state={
        fromDate:'',
        toDate:'',
    }

    handleDateFocus=(e)=>{
        let element=e.target.id
        document.getElementById(element).type='date'
    }

    handleDateBlur=(e)=>{
        let element = e.target.id
        document.getElementById(element).type='text'
    }

    handlePlusClick=(e)=>{
        let Date={fromDate:this.state.fromDate, toDate:this.state.toDate}
        let Time={fromTime:this.state.fromTime, toTime:this.state.toTime}
        let data={date:Date, time:Time}
        //upload data with the function you'll receive from props
        // this.props.uploadData(data)
    }

    render() {
        return (
            <div className='ClasseDefinir'>
                <span className='className'>{this.props.theClasse.split(' ')[0]+' '+this.props.theClasse.split(' ')[1]}</span>
                <div className='ClasseDefinirDateHolder'>
                    <span className='ClasseDefinirLabelD'>De:</span>
                    <input type='Text' onFocus={this.handleDateFocus} onBlur={this.handleDateBlur} value={this.props.fromDate} placeholder='YYYY-MM-DD' onChange={this.props.handleInputChange} className='classeDefinirInput' id='fromDate' />

                    <span className='ClasseDefinirLabelA'>A</span>
                    <input type='Text' placeholder='YYYY-MM-DD' disabled value={this.props.toDate} className='classeDefinirInput' id='toDate' />
                </div>
            </div>
        )
    }
}
