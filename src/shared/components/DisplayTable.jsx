import React, { Component } from 'react'
import './DisplayTable.css'

export default class DisplayTable extends Component {
    state={
        filieres:[],
        filiere:'',
        max:'',
        filiereEdit:{nomFiliere:'', niveauMax:'', index:0},
        open:false,
        edit:''
    }

    
    styleFiliere =()=>{
        return this.state.filieres.map(filiere=>{
            return Number(this.state.edit) === filiere.index?
            (
            <div className="StyledFiliere" key={filiere.index}>
                <h2>{filiere.index}</h2>
                <input type='text' value={this.state.filiereEdit.nomFiliere} onChange={this.handleEditChange} className='editInput' id='EditInput' />
                <h2>{filiere.niveauMax}</h2>
                <input type='submit' value='Save' onClick={this.handleEditSave} className='newFilierSubmit1'/>
                <input type='submit' value='Delete' onClick={this.handleDelete} id={filiere.index} className='newFilierSubmit'/>
            </div>
            ):(
            <div className="StyledFiliere" key={filiere.index}>
                <h2>{filiere.index}</h2>
                <h2>{filiere.nomFiliere}</h2>
                <h2>{filiere.niveauMax}</h2>
                <input type='submit' value='Editer' onClick={this.handleEditBtn} id={filiere.index} className='newFilierSubmit1'/>
                <input type='submit' value='Delete' onClick={this.handleDelete} id={filiere.index} className='newFilierSubmit'/>
            </div>
            )
                
        })
    }

    handleEditSave =()=>{
        //push filiereEdit into filieres at the right position
        let newFilieres = []
        this.state.filieres.filter(filiere=>{
            if(filiere.index === this.state.filiereEdit.index) newFilieres.push(this.state.filiereEdit)
            else newFilieres.push(filiere)
        })
        this.setState({filieres:newFilieres,edit:''})
        //put edit back to empty


    }
    
    handleEditChange=(e)=>{
        let newElement = {nomFiliere:e.target.value, niveauMax:this.state.filiereEdit.niveauMax, index:this.state.filiereEdit.index}
        this.setState({filiereEdit:newElement})
    }

    handleDelete=(e)=>{
        let element = e.target.id
        let newList = this.state.filieres.filter(filiere=>{return Number(element) !== filiere.index})
        newList = this.adjustIndex(newList)
        this.setState({filieres:newList})
    }

    adjustIndex = (listArray) => {
        let index = 0;
        let tempQuestions = []
        listArray.map(filiere => {
            index = index + 1
            filiere.index = index
            tempQuestions.push(filiere)
            return null;
        })

        return tempQuestions;
    }

    handleEditBtn =(e)=>{
        let element = this.state.filieres.find(filiere=>filiere.index === Number(e.target.id))
        let icon = document.getElementById('fa-icon')
            icon.classList.remove('fa-minus-circle')
            icon.classList.add('fa-plus-circle')
        this.setState({
            filiereEdit:element,
            edit:e.target.id,
            open:false
        })
    }

    handleSubmit=(e)=>{
        e.preventDefault();
        let submitObject ={nomFiliere:this.state.filiere, niveauMax:this.state.max, index:this.state.filieres.length+1}
        submitObject = [...this.state.filieres, submitObject]
        this.setState({filieres:submitObject})
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
                <div className='newFilierep' onClick={this.toggleFaIcon} ><i className='fa fa-plus-circle' id='fa-icon'/>Nouvelle filiere</div>
                {
                    this.state.open?(
                    <form onSubmit={this.handleSubmit}>
                        <input type='text' onChange={this.handleChange} id='filiere'placeholder='Entrez nom de filiere' className='newFiliere' />
                        <input type='text' onChange={this.handleChange}id='max' placeholder='Niveau max' className='filiereNiveauMax' />
                        <input type='submit' value='Ajouter' onClick={this.handleSubmit} className='newFiliereSubmit' />
                    </form>):(null)
                }
            </div>
        )
    }
}
