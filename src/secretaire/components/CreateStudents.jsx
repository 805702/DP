import React, { Component } from 'react'
import './CreateStudent.css'
import SecretaireNav from '../../shared/UIElements/SecretaireNav'
import DisplayStudents from './DisplayStudents'

class CreateStudents extends Component {
    state={
        newSupport:'',
        activeTab:'studentList'
    }

    handleFileChange=(e)=>{
        this.setState({newSupport:e.target.files[0]})
    }

    uploadSupport=async()=>{
        let formData = new FormData()
        formData.append(
            'file',
            this.state.newSupport
        )
        fetch('https://tranquil-thicket-81941.herokuapp.com/manage-personnel/api/students', {
            method: 'post',
            body: formData
        })
        .then(response=>response.json())
        .then(data=>{
            if(data.message){
                alert('Successfully created the students')
            }
            else{
                alert('Failed, Check your file')
            }
        })
        .catch(err=>console.log(err))
        // I don't know if you need the form data here
        // but you have the list of students.
        // create them here
        // i hope you are sending them their passwords to access the platform at the same time ;)
        // this.setState({newSupport:''})
    }

    handleTabClick=(e)=>{
        document.getElementById(this.state.activeTab).classList.remove('activeTab')
        this.setState({activeTab:e.target.id},()=>{
            document.getElementById(this.state.activeTab).classList.add('activeTab')
        })
    }

    displayTab=()=>{
        return(
            <div className="timeTableTab">
                <span className='tabElement activeTab' id='studentList' onClick={this.handleTabClick}>Voir liste des etudiants</span>
                <span className='tabElement' id='addStudents' onClick={this.handleTabClick}>Ajouter des etudiants</span>
            </div>
        )
    }

    showUploadFile=()=>{
        return (
            <div>
                <SecretaireNav />
                {this.displayTab()}
                {this.state.activeTab!=='addStudents'?<DisplayStudents />
                :<div className='createStudentHolder'>
                    <span className='createStudents'>Ajouter des etudiants</span>
                    <input type='file' accept='.csv' onChange={this.handleFileChange}/>
                    {this.state.newSupport!==''?(
                        <div className='newFileInfo'>
                            <span className='newFileName'>Nom fichier: {this.state.newSupport.name}</span>
                            <span className='newFileType'>Type fichier: Fichier {this.state.newSupport.name.split('.')[1].toUpperCase()}</span>
                            <span className='newFileSize'>Taille fichier: {((Number(this.state.newSupport.size)/1024)/1024).toFixed(2)}Mb</span>
                            <div><button onClick={this.uploadSupport}><i className='fa fa-upload'/>uploadFile</button></div>
                        </div>
                    ):null}
                </div>}
            </div>
        )
    }

    render() {
        return (
            this.showUploadFile()
        )
    }
}
export default CreateStudents