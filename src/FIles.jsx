import React, { Component } from 'react'

export default class FIles extends Component {
    state={
        file:''
    }

    handleFileChange=(e)=>{
        // console.log(e.target.files[0])
        this.setState({file:e.target.files[0]},()=>{
            let formData = new FormData()
            formData.append(
                'courseFile',
                this.state.file,
                this.state.file.name
            )
            console.log(this.state.file.name)
        })
    }

    handleClick=(e)=>{
        let btn = document.getElementById('fileBtn')
        btn.type='file'
        console.log(e.target.files[0])
    }

    handleOnBlur=()=>{
        let btn = document.getElementById('fileBtn')
        btn.type='button'
    }

    render() {
        return (
            <div>
                <button onClick={this.handleClick} id='fileBtns'><i className='fa fa-paperclip' /></button>
                <input type='button' value='button' id='fileBtn' onFocus={this.handleClick} onBlur={this.handleOnBlur} />
            </div>
        )
    }
}
