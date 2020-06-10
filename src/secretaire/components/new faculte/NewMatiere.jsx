import React, { Component } from 'react'
import './NewMatiere.css'

export default class NewMatiere extends Component {
    state={
        nomFiliere:'',
        niveauMax:'',
        open:false,
    }

    
    styleFiliere =()=>{
        return this.props.filieres.map(filiere=>{
            return Number(this.props.edit) === filiere.index?
            (
            <div className="StyledFiliere" key={filiere.index}>
                <h2>{filiere.index}</h2>
                <input type='text' value={this.props.filiereEdit.nomFiliere} onChange={(e)=>this.props.handleEditChange(e)} className='editInput' id='EditInput' />
                <h2>{filiere.niveauMax}</h2>
                <input type='submit' value='Save' onClick={(e)=>this.props.handleEditSave(e)} className='newFilierSubmit1'/>
                <input type='submit' value='Supprimer' onClick={(e)=>this.props.handleDelete(e)} id={filiere.index} className='newFilierSubmit'/>
            </div>
            ):(
            <div className="StyledFiliere" key={filiere.index}>
                <h2>{filiere.index}</h2>
                <h2>{filiere.nomFiliere}</h2>
                <h2>{filiere.niveauMax}</h2>
                <input type='submit' value='Editer' onClick={(e)=>this.props.handleEditBtn(e)} id={filiere.index} className='newFilierSubmit1'/>
                <input type='submit' value='Supprimer' onClick={(e)=>this.props.handleDelete(e)} id={filiere.index} className='newFilierSubmit'/>
            </div>
            )
                
        })
    }

    

    

    

    handleSubmit=(e)=>{
        e.preventDefault();
        if((this.state.nomFiliere!=='' || this.state.niveauMax!=='') && typeof(Number(this.state.niveauMax))==='number'){
            document.getElementById('niveauMax').value=''
            document.getElementById('filiere').value=''
            this.setState({nomFiliere:'', niveauMax:''})
            let uploadObject ={nomFiliere:this.state.filiere, niveauMax:this.state.niveauMax, index:this.props.filieres.length+1}
            uploadObject = [...this.props.filieres, uploadObject]
            this.props.addNewFiliere(uploadObject)
        }else alert('input a filiere name and a niveau max')
    }

    handleChange=(e)=>{
        this.setState({[e.target.id]:e.target.value})
    }
    
    toggleFaIcon = ()=>{
        let icon = document.getElementById('fa-icon')
        this.setState({open:!this.state.open})
        if(icon.classList.contains('fa-plus-circle')){
            icon.classList.remove('fa-plus-circle')
            icon.classList.add('fa-minus-circle')
        }else{
            icon.classList.remove('fa-minus-circle')
            icon.classList.add('fa-plus-circle')
        }
    }

    render() {
        return (
            <div>
                {this.styleFiliere()}
                <div className="newMatiereFilieresHolder">
                    <div className='newFilierep' onClick={this.toggleFaIcon} ><i className='fa fa-plus-circle' id='fa-icon'/>Nouvelle Filiere</div>
                    {
                        this.state.open?(
                        <form onSubmit={this.handleSubmit}>
                            <input type='text' onChange={this.handleChange} id='filiere'placeholder='Nom Filiere' className='newFiliere' />
                            <input type='number' onChange={this.handleChange} id='niveauMax' placeholder='Niveau max' className='filiereNiveauMax' />
                            <input type='submit' value='Ajouter' onClick={this.handleSubmit} className='newFiliereSubmit' />
                        </form>):(null)
                    }
                </div>
            </div>
        )
    }
}
